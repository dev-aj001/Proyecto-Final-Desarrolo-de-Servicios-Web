const User = require('../models/userModel.js');
const facturapi = require('../api/facturapi');
const { get } = require('mongoose');

async function getAllUsers() {
    return await User.find();
}

async function getUserById(userId) {
    return await User.findById(userId);
}

async function createUser(UserInput) {

    console.log(UserInput);

    const user = User.create(UserInput);

    if(user.facturapi_customer !== undefined){
        const facturapiCustomer = await facturapi.createUser(facturapi_customer);
        user.facturapi_customer.id = facturapiCustomer.id;
    }

    return user;
}

async function deleteUser(userId) {
    
    const user = User.findByIdAndDelete(userId);

    if(user.facturapi_customer){
        await facturapi.removedCustomer(user.facturapi_customer.id);
    }

    return user;
}

async function createFacturapiCustomer(userId, customer) {
    
    const user = User.findById(userId);

    if(user.facturapi_customer){
        throw new Error("Este usuario ya esta registrado en facturapi");
    }else{
        const facturapiCustomer = await facturapi.createUser(customer);
        user.facturapi_customer.id = facturapiCustomer.id;
    }

    return await user.save();
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    createFacturapiCustomer,
    deleteUser
}