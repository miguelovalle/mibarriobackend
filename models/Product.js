const { Schema, model } = require("mongoose");

const productSchema = Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    enabled: {
        type: String,
        trim: true,
        default:"no"
    },
    logo: {
        type: String,
        trim: true
    },
    commerce: {
        type: Schema.Types.ObjectId,
        ref: 'Negocio',
        required: true
    }
})
module.exports = model('Product', productSchema );