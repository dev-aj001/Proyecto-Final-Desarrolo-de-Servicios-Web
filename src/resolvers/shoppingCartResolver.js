const shoppingCartService = require('../services/shoppingCartService');

const resolvers = {
    Query: {
        getShoppingCartById: () => shoppingCartService.getShoppingCartById(args._id),
        getAllShoppingCartsByUser: (_, args) => shoppingCartService.getAllShoppingCartsByUser(args.userId),
    },
    Mutation: {
        createShoppingCart: (_, args) => shoppingCartService.createShoppingCart(args.shoppingCart),
        addItemToCart: (_, args) => shoppingCartService.addItemToCart(args._id, args.cartItem),
        updateItemQuantity: (_, args) => shoppingCartService.updateItemQuantity(args._id, args.productId, args.quantity),
        removeItemFromCart: (_, args) => shoppingCartService.removeItemFromCart(args._id, args.productId),
        closeShoppingCart: (_, args) => shoppingCartService.closeShoppingCart(args._id),
    },
};

module.exports = resolvers;