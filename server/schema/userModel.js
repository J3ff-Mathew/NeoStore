const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    address: [
        {
            name: { type: String },
            address: { type: String },
            contact: { type: Number }
        }
    ],
    cart: {
        type: Array
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    otp: {
        type: Number
    }
});

module.exports = mongoose.model("users", userSchema);