const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { FACTURAPI_SECRET_KEY } = process.env;

// Importar los esquemas y resolvers
// const productTypeDefs = require('./schemas/productSchema');
// const productResolvers = require('./resolvers/productResolver');
const userTypeDefs = require('./schemas/userSchema');
const userResolvers = require('./resolvers/userResolver');
// const carritoTypeDefs = require('./schemas/carritoSchema');
// const carritoResolvers = require('./resolvers/carritoResolver');


const startServer = async () => {
  // Conectar a MongoDB
  await mongoose.connect('mongodb://127.0.0.1:27017/test01?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0');
  
  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers});
  
  server.listen().then(({ url }) => {
    console.log(`Servidor corriendo en ${url}`);
  });
};

console.log(FACTURAPI_SECRET_KEY);
startServer();
