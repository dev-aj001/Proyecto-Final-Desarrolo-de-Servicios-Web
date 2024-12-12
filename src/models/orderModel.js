const mongoose = require('mongoose');

const { orderStatus, paymentStatus } = require('../utils/enums');

const orderSchema = new mongoose.Schema({
    // Referencia al usuario por ID
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Referencia al carrito por ID
    shoppingCart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingCart',
        required: true
    },
    // Total de la compra
    total: {
        type: Number,
        required: true
    },
    // Fecha de creación de la compra
    createdAt: {
        type: Date,
        default: Date.now
    },
    // // Referencia a la dirección por ID
    // address: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //     required: true
    // },
    paymentMethod: {
        type: String,
        required: true
    },
    // Estado del pago
    paymentStatus: {
        type: String,
        enum: Object.values(paymentStatus),
        default: paymentStatus.PENDING
    },
    // Estado de la orden
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PENDING
    },
    // Informacion adicional
    aditionalInfo: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Order', orderSchema);