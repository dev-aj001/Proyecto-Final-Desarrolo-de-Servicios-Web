const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // Referencia al usuario por ID
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Items de la compra
    items: [{
        // Referencia al producto por ID
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        // Precio del producto
        price: {
            type: Number,
            required: true
        },
        // Cantidad de este producto
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        // Precio total (precio * cantidad)
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    // Porcentaje de impuestos
    tax: {
        type: Number,
        required: true,
        default: 0.16 // 16% de IVA por defecto
    },
    // Total antes de impuestos
    subTotal: {
        type: Number,
        required: true,
        default: 0
    },
    // Total con impuestos
    total: {
        type: Number,
        required: true,
        default: 0
    },
    // Fecha de creación
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Fecha de cierre
    closedAt: {
        type: Date,
        default: null
    },
    // Estado activo
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ShoppingCart', cartSchema);