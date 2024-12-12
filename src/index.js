const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

// Importar los esquemas y resolvers
const productTypeDefs = require('./schemas/productSchema');
const productResolvers = require('./resolvers/productResolver');
const userTypeDefs = require('./schemas/userSchema');
const userResolvers = require('./resolvers/userResolver');
// const carritoTypeDefs = require('./schemas/carritoSchema');
// const carritoResolvers = require('./resolvers/carritoResolver');


const startServer = async () => {
  // Conectar a MongoDB
  await mongoose.connect('mongodb+srv://admin:admin@cluster0.yelht.mongodb.net/tet01?retryWrites=true&w=majority&appName=Cluster0');

  const server = new ApolloServer({
    typeDefs: [userTypeDefs, productTypeDefs],
    resolvers: [userResolvers, productResolvers]});
  
  server.listen().then(({ url }) => {
    console.log(`Servidor corriendo en ${url}`);
  });
};

startServer();
