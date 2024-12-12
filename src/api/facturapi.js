require('dotenv').config();
const Facturapi = require('facturapi').default;

const facturapi = new Facturapi(process.env.FACTURAPI_SECRET_KEY);

module.exports = {
    createProduct: async (product) => {
        const facturapiProduct = {
            description: product.description,
            product_key: product.product_key,
            price: product.price
        };
        return await facturapi.products.create(facturapiProduct);
    },


    deleteProduct: async (_id) => {
        return await facturapi.products.del(_id);
    },

    createCustomer: async (customer) => {
        try {
            const facturapiCustomer = {
                legal_name: customer.legal_name,
                tax_id: customer.tax_id || 'ABC101010111',
                tax_system: '601',
                address: customer.address || {
                    zip: '63100',
                },
            };
            return await facturapi.customers.create(facturapiCustomer);
        } catch (error) {
            console.error('Error al crear el usuario en Facturapi:', {
                message: error.message,
                stack: error.stack,
                response: error.response ? error.response.data : null
            });
            throw new Error('No se pudo crear el usuario en Facturapi.');
        }
    },

    updateCustomer: async (_id, rest) => {
        const facturapiCustomer = {
            ...rest
        };
        return await facturapi.customers.update(_id, facturapiCustomer);
    },


    deleteCustomer: async (id) => {
        return await facturapi.customers.del(id);
    },
}