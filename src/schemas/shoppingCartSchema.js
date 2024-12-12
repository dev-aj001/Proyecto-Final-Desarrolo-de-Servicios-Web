const { gql } = require('apollo-server');

const typeDefs = gql`

    # Definición del esquema de usuario
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        role: String!
        tax_system: String!
    }

    # Definición del esquema de producto
    type Product {
        _id: ID!
        name: String!
        description: String!
        brand: String!
        price: Float!
        stock: Int!
        category: String!
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
        total: Float!
        createdAt: String!
        closedAt: String
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
        getShoppingCartsByUser(userId: ID!): [ShoppingCart]
    }

    type Mutation {
        # Crear un nuevo carrito de compras
        createShoppingCart(shoppingCart: ShoppingCartInput!): ShoppingCart
        # Actualizar un carrito de compras
        updateShoppingCart(id: ID!, shoppingCart: ShoppingCartUpdateInput!): ShoppingCart
        # Cerrar un carrito de compras
        closeShoppingCart(id: ID!): ShoppingCart
        # Eliminar un carrito de compras
        deleteShoppingCart(id: ID!): ShoppingCart
    }
`;