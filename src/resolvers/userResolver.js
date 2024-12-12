const userService = require('../services/userService');

const resolvers = {
    Query: {
        getAllUsers: () => userService.getAllUsers(),
        getUserById: (_, args) => userService.getUserById(args._id),
    },
    Mutation: {
        createUser: (_, args) => userService.createUser(args.user),
        // updateUser: (_, args) => userService.update(args.id, args.input),
        deleteUser: (_, args) => userService.deleteUser(args._id),
        createFacturapiCustomer: (_, args) => userService.createFacturapiCustomer(args._id, args.customer),
    },
};

module.exports = resolvers;