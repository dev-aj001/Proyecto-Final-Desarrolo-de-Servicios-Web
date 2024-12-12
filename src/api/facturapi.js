const { FACTURAPI_SECRET_KEY } = process.env;
const Facturapi = require('facturapi').default;

const facturapi = new Facturapi(FACTURAPI_SECRET_KEY);

module.exports = {
    createProduct: async (product) => {
        const facturapiProduct = {
            description: product.name,
            product_key: product.product_key,
            price: product.price
        };
        return await facturapi.products.create(facturapiProduct);
    },

    updateProduct: async (_id, rest) => {
        const facturapiProduct = {
            ...rest,
            description: rest.name || undefined,
        };
        return await facturapi.products.update(_id, facturapiProduct);
    },


    deleteProduct: async (_id) => {
        return await facturapi.products.del(_id);
    },

    createCustomer: async (customer) => {
        const facturapiCustomer = {
            legal_name: customer.fullname,
            tax_id: customer.tax_id || 'ABC101010111',
            tax_system: '601',
            address: customer.address || {
                zip: '63900',
            },
        };
        return await facturapi.customers.create(facturapiCustomer);
    },

    updateCustomer: async (_id, rest) => {
        const facturapiCustomer = {
            ...rest
        };
        return await facturapi.customers.update(_id, facturapiCustomer);
    },


    deleteCustomer: async (_id) => {
        return await facturapi.customers.del(_id);
    },
}