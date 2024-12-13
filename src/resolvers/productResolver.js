const productService = require('../services/productService');

const resolvers = {
    Query: {
        getAllProducts: () => productService.getAllProducts(),
        getProductById: (_, args) => productService.getProductById(args._id),
    },
    Mutation: {
        createProduct: (_, args) => productService.createProduct(args.product),
        // updateProduct: (_, args) => productService.update(args.id, args.input),
        deleteProduct: (_, args) => productService.deleteProduct(args._id),
        // createFacturapiCustomer: (_, args) => productService.createFacturapiCustomer(args._id, args.customer),
    },
};

module.exports = resolvers;