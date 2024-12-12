const { gql } = require('apollo-server');

const { categories } = require('../utils/enums');

const typeDefs = gql`

    # Definición del enum de categorias
    enum Categories {
        ${Object.values(categories).join('\n')}
    }

    # Definición del esquema de imagen
    type Image {
        url: String!
        alt: String!
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

    # Definición de la entrada para la creacion del producto
    input ProductInput {
        name: String!
        description: String!
        brand: String!
        price: Float!
        stock: Int!
        category: Categories!
        product_key: String!
    }

    # Definición de la entrada para la actualizacion del producto
    input ProductUpdateInput {
        name: String
        description: String
        brand: String
        price: Float
        stock: Int
        category: Categories
    }

    # Definición del esquema de consulta y mutaciones
    type Query {
        # Obtener todos los productos
        getAllProducts: [Product]
        # Obtener un producto por su ID
        getProductById(id: ID!): Product
        # Obtener productos por categoría
        getProductsByCategory(category: Categories!): [Product]
    }

    type Mutation {
        # Crear un nuevo producto
        createProduct(product: ProductInput!): Product
        # Actualizar un producto
        updateProduct(id: ID!, product: ProductUpdateInput!): Product
        # Eliminar un producto
        deleteProduct(id: ID!): Product
    }
`;

module.exports = typeDefs;