const { gql } = require('apollo-server');

const { roles } = require('../utils/enums');

const typeDefs = gql`

    # Definición del enum de roles
    enum Roles {
        ${Object.values(roles).join('\n')}
    }

    # Definición del esquema de address
    type Address {
        zip: String!
        street: String!
        exterior: String!
        interior: String!
        neighborhood: String!
        city: String!
        municipality: String!
        state: String!
        country: String!
    }

    # Definición del esquema de facturapi_customer
    type FacturapiCustomer {
        id: ID!
        legal_name: String!
        tax_id: String!
        tax_system: String!
        address: Address!
        email: String
        phone: String
    }

    # Definición del esquema de usuario
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        role: Roles!
        registeredAt: String!
        facturapi_customer: FacturapiCustomer
    }

    # Definición del esquema de autenticación
    type AuthPayload {
        token: String!
        user: User!
    }

    # Definición de la entrada para la creacion del address
    input AddressInput {
        zip: String!
        street: String
        exterior: String
        interior: String
        neighborhood: String
        city: String
        municipality: String
        state: String
        country: String
    }

    # Definición de la entrada para la creacion del facturapi_customer
    input FacturapiCustomerInput {
        legal_name: String!
        tax_id: String!
        tax_system: String!
        address: AddressInput!
        email: String
        phone: String
    }

    # Definición de la entrada para la creacion del usuario
    input UserInput {
        name: String!
        email: String!
        password: String!
        role: Roles
        facturapi_customer: FacturapiCustomerInput
    }

    # Definición de la entrada para la actualizacion del usuario
    input UserUpdate {
        name: String
        email: String
        password: String
        role: Roles
    }

    # Definición de la entrada para la actualizacion del address
    input AddressUpdate {
        zip: String
        street: String
        exterior: String
        interior: String
        neighborhood: String
        city: String
        municipality: String
        state: String
        country: String
    }

    # Definición de la entrada para la actualizacion del facturapi_customer
    input FacturapiCustomerUpdate {
        legal_name: String
        tax_id: String
        tax_system: String
        address: AddressUpdate
        email: String
        phone: String
    }

    # Definición del esquema de consulta y mutaciones
    type Query {
        # Obtener todos los usuarios
        getAllUsers: [User]
        # Obtener un usuario por su ID
        getUserById(_id: ID!): User
    }

    type Mutation {
        # Crear un nuevo usuario
        createUser(user: UserInput!): User
        # Actualizar un usuario existente
        updateUser(_id: ID!, user: UserUpdate!): User
        # Eliminar un usuario existente
        deleteUser(_id: ID!): User

        # Iniciar sesión de un usuario
        login(email: String!, password: String!): AuthPayload

        # Crear un nuevo cliente en Facturapi
        createFacturapiCustomer(_id: ID!, customer: FacturapiCustomerInput!): FacturapiCustomer
        # Actualizar un cliente existente en Facturapi
        # updateFacturapiCustomer(_id: ID!, customer: FacturapiCustomerUpdate!): FacturapiCustomer
    }
`;

module.exports = typeDefs;