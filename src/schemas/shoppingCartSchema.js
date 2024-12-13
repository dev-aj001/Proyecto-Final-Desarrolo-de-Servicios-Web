const { gql } = require('apollo-server');
const { roles } = require('../utils/enums');
const { categories } = require('../utils/enums');

const typeDefs = gql`

    # Definición del enum de roles
    enum Roles {
        ${Object.values(roles).join('\n')}
    }

    # Definición del enum de categorias
    enum Categories {
        ${Object.values(categories).join('\n')}
    }

    # Definición del esquema de usuario
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        role: Roles!
    }

    # Definición del esquema de producto
    type Product {
        _id: ID!
        name: String!
        description: String!
        brand: String!
        price: Float!
        stock: Int!
        category: Categories!
        createdAt: String!
        imgs: [Image]!
        product_key: String!
    }

    # Definición del esquema de item de carrito de compras
    type CartItem {
        product: Product!
        price: Float!
        quantity: Int!
        totalPrice: Float!
    }

    # Definición del esquema de carrito de compras
    type ShoppingCart {
        _id: ID!
        user: User!
        items: [CartItem]!
        subTotal: Float!
        total: Float!
        createdAt: String!
        closedAt: String
        isActive: Boolean!
    }

    # Definición de la entrada para el item de carrito de compras
    input CartItemInput {
        product: ID!
        quantity: Int
    }

    # Definición de la entrada para la creacion del carrito de compras
    input ShoppingCartInput {
        user: ID!
        items: [CartItemInput]!
        tax: Float
    }

    # Definición de la entrada para la actualizacion del carrito de compras
    input ShoppingCartUpdateInput {
        items: [CartItemInput]!
    }

    # Definición del esquema de consulta y mutaciones
    type Query {
        # Obtener todos los carritos de compras
        # getAllShoppingCarts: [ShoppingCart]
        # Obtener un carrito de compras por ID
        getShoppingCartById(id: ID!): ShoppingCart
        # Obtener todos los carritos de compras de un usuario
        getAllShoppingCartsByUser(userId: ID!): [ShoppingCart]
    }

    type Mutation {
        # Crear un nuevo carrito de compras
        createShoppingCart(shoppingCart: ShoppingCartInput!): ShoppingCart
        # Agregar item
        addItemToCart(_id: ID!, cartItem: CartItemInput!): ShoppingCart
        # Actualizar item
        updateItemQuantity(_id: ID!, productId: ID!, quantity: Int!): ShoppingCart
        # Eliminar item
        removeItemFromCart(_id: ID!, productId: ID!): ShoppingCart
        # Cerrar un carrito de compras
        closeShoppingCart(_id: ID!): ShoppingCart
    }
`;

module.exports = typeDefs;