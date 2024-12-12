const Product = require('../models/productModel');
const facturapi = require('../api/facturapi');

async function getAllProducts() {
    return await Product.find();
}

async function getProductById(productId) {
    const product = await Product.findById(productId);
    if(!product){ 
        throw new Error("No se encontro el producto");
    }
    return product;
}

async function createProduct(productInput) {

    const facturapiProduct = await facturapi.createProduct(productInput);

    const product = new Product(productInput);
    product._id = facturapiProduct.id;
    return await product.save();
}

async function deleteProduct(productId) {

    console.log("productId", productId);
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new Error("No se encontro el producto");
    }

    await facturapi.deleteProduct(productId);

    return product;
}

async function updateProduct(productId, productInput) {

    const product = await Product.findByIdAndUpdate(productId, productInput, { new: true });

    if (!product) {
        throw new Error("No se encontro el producto");
    }
    
    return product;
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
}