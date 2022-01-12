const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    reciever: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
            required: true
        }
    },
    order_items: {
        type: Array,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    totalBeforeTax: {
        type: Number,
        required: true
    },
    totalTax: {
        type: Number,
        required: true
    },
    totalAfterTax: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('order', orderSchema);