const ShoppingCart = require('../models/shoppingCartModel'); // Modelo de carrito
const Product = require('../models/productModel'); // Modelo de producto
const facturapi = require('../api/facturapi');
const User = require('../models/userModel'); // Modelo de usuario
const { orderStatus } = require('../utils/enums');

const { sendEmailFactura, sendEmail } = require('../api/sendGrid');
const { uploadToS3 } = require('../api/aws');

const shoppingCartService = {

    async getAllShoppingCartsByUser(userId) {

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("El usuario no existe.");
        }

        const shoppingCarts = await ShoppingCart.find({ user: userId });

        if (shoppingCarts.length === 0) {
            throw new Error("El usuario no tiene carritos.");
        }

        return shoppingCarts;
    },

    async getShoppingCartById(cartId) {

        console.log("cartId", cartId);
        
        const cart = await ShoppingCart.findById(cartId)
        .populate('items.product')
        .populate('user');

        if (!cart) {
            throw new Error("El carrito no existe.");
        }

        return cart;
    },

    async createShoppingCart(cartInput) {
        try {
            const user = await User.findById(cartInput.user);

            if (!user) {
                throw new Error("El usuario no existe.");
            }

            if(user.facturapi_customer === undefined){
                throw new Error("El usuario no tiene datos de facturación.");
            }

            // Validación del impuesto
            if (cartInput.tax <= 0 || cartInput.tax > 1) {
                throw new Error(`El impuesto debe ser un valor entre 0.0 y 1.0.`);
            }
        
            // Validación de ítems iniciales
            if (!cartInput.items || cartInput.items.length === 0) {
                throw new Error(`El carrito debe contener al menos un ítem.`);
            }
        
            const cart = new ShoppingCart(cartInput);
        
            // Validación y cálculo para cada ítem
            let totalPrice = 0; // Total del carrito
            for (const item of cart.items) {
                const productData = await Product.findById(item.product);
                if (!productData) {
                    throw new Error(`El producto con ID ${item.product} no existe.`);
                }
        
                if (item.quantity <= 0) {
                    throw new Error(`La cantidad para el producto '${productData.name}' debe ser mayor a 0.`);
                }
        
                if (item.quantity > productData.stock) {
                    throw new Error(`Stock insuficiente para el producto '${productData.name}'.`);
                }
        
                item.price = productData.price;
                item.totalPrice = item.quantity * productData.price;
                totalPrice += item.totalPrice;
            }
        
            // Calcular subtotal y total
            cart.subTotal = totalPrice / (1 + cart.tax);
            cart.total = totalPrice;

            cart.status = orderStatus.PENDING;
        
            // Guardar el carrito
        
            await cart.save();

            return await this.getShoppingCartById(cart._id);
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw new Error(`Error al guardar el carrito: ${error.message}`);
        }
    },

    async addItemToCart(cartId, item ) {

        const cart = await ShoppingCart.findById(cartId);
        if (!cart) {
            throw new Error("El carrito no existe.");
        }

        const user = await User.findById(cart.user);

        if (!user) {
            throw new Error("El usuario no existe.");
        }

        const quantity = item.quantity;
        console.log(quantity);

        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor a 0.");
        }

        const product = item.product;

        const productData = await Product.findById(product);
        if (!productData) {
            throw new Error("El producto no existe.");
        }

        console.log("productData", productData);

        if (quantity > productData.stock) {
            throw new Error(`Stock insuficiente para el producto '${productData.name}'.`);
        }

        const existingItem = cart.items.find(item => item.product.toString() === product);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > productData.stock) {
                throw new Error(`Stock insuficiente para el producto '${productData.name}'.`);
            }
            existingItem.quantity = newQuantity;
            existingItem.totalPrice = newQuantity * productData.price;
        } else {
            cart.items.push({
                product,
                price: productData.price,
                quantity,
                totalPrice: productData.price * quantity
            });
        }

        cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.subTotal = cart.total/(1+cart.tax);
        await cart.save();

        return await this.getShoppingCartById(cart._id);
    },

    async updateItemQuantity(cartId, productId, quantity) {
        if (quantity < 0) {
            throw new Error("La cantidad no puede ser negativa.");
        }

        const cart = await ShoppingCart.findById(cartId);
        if (!cart) {
            throw new Error("El carrito no existe.");
        }

        const productData = await Product.findById(productId);
        if (!productData) {
            throw new Error("El producto no existe.");
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            throw new Error("El producto no está en el carrito.");
        }

        if (quantity === 0) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
        } else if (quantity > productData.stock) {
            throw new Error(`Stock insuficiente para el producto '${productData.name}'.`);
        } else {
            item.quantity = quantity;
            item.totalPrice = quantity * productData.price;
        }

        cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.subTotal = cart.total/(1+cart.tax);
        await cart.save();
        return this.getShoppingCartById(cart._id);
    },

    async removeItemFromCart(cartId, productId) {
        const cart = await ShoppingCart.findById(cartId);
        if (!cart) {
            throw new Error("El carrito no existe.");
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            throw new Error("El producto no está en el carrito.");
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.subTotal = cart.total/(1+cart.tax);
        await cart.save();
        return cart;
    },

    async closeShoppingCart(cartId) {
        try {
            const cart = await ShoppingCart.findById(cartId)
            .populate('user')
            .populate('items.product');
            
            if (!cart) {
                throw new Error("El carrito no existe.");
            }

            for (const item of cart.items) {
                const product = await Product.findById(item.product);
                if (item.quantity > product.stock) {
                    throw new Error(`Stock insuficiente para el producto '${product.name}'.`);
                }
            }

            for (const item of cart.items) {
                const product = await Product.findById(item.product);
                product.stock -= item.quantity;
                await product.save();
            }

            const customer = {
                legal_name: cart.user.facturapi_customer.legal_name,
                tax_id: cart.user.facturapi_customer.tax_id,
                tax_system: cart.user.facturapi_customer.tax_system,
                email: cart.user.facturapi_customer.email,
                address: cart.user.facturapi_customer.address,
            }

            const invoice = {
                customer,
                items: cart.items.map(item => ({
                        quantity: item.quantity,
                        product: {
                            description: item.product.description,
                            product_key: item.product.product_key,
                            price: item.product.price
                        }
                })),
                payment_form: "28",
                use: "S01"
            }

            //mandar la factura
            const { id } = await facturapi.createInvoice(invoice);

            const filePath = await facturapi.downloadInvoice(id);

            const fileLink = await subir(filePath, "wasaaa-apicarrito-dsw", `facturas/${id}.zip`);

            console.log("Enlace de la Factura:", fileLink, "filepath:", filePath);
            // Envía por correo
            await sendEmailFactura(cart.user.email, fileLink);

            cart.status = orderStatus.CONFIRMED;
            cart.isActive = false;
            cart.closedAt = new Date();
            await cart.save();
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error(`Error al cerrar el carrito: ${error.message}`);
        }
    }
};

const subir = async (filePath, bucketName, key) => {
    try {
        // Sube a S3
        const fileLink = await uploadToS3(filePath, bucketName, key);

        return fileLink;
    } catch (error) {
        console.error('Error en el proceso:', error);
    }
}

module.exports = shoppingCartService;
