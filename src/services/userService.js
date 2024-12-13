const User = require('../models/userModel');
const facturapi = require('../api/facturapi');

async function getAllUsers() {
    return await User.find();
}

async function getUserById(userId) {
    const user = await User.findById(userId);
    if(!user){ 
        throw new Error("No se encontro el usuario");
    }
    return user;
}

async function createUser(UserInput) {

    const user = await User.create(UserInput);

    if(user.facturapi_customer !== undefined){
        const facturapiCustomer = await facturapi.createCustomer(user.facturapi_customer);
        user.facturapi_customer = facturapiCustomer;
        await user.save();
    }

    return user;
}

async function deleteUser(userId) {
    
    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            throw new Error("No se encontro el usuario");
        }

        if(user.facturapi_customer){
            await facturapi.deleteCustomer(user.facturapi_customer.id);
        }

        return user;
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
}

async function createFacturapiCustomer(userId, customer) {
    
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    if(user.facturapi_customer){
        throw new Error("Este usuario ya esta registrado en facturapi");
    }else{
        customer.email = user.email;
        const facturapiCustomer = await facturapi.createCustomer(customer);
        console.log(facturapiCustomer);
        user.facturapi_customer = facturapiCustomer;
        await user.save();
    }

    return user;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    createFacturapiCustomer,
    deleteUser
}