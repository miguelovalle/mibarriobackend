const { Schema, model } = require('mongoose');

const commerceSchema = Schema({
    tipo: {
        type: String,
//         required: true
    },
    name: {
        type: String,
//         required: true,
        trim: true
    },
     emblem: {
        type: String,
        default: " ",
        trim: true
    },
    specialty: {
        type: String,
        default: " ",
        trim: true
    },
    categories: {
        type: Array,
        default: []
    },

    contact: {
        type: String,
        // required: true,
        trim: true
    },
    phone: {
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        trim: true
    },
    passwd: {
        type: String
        // required: true
    },
   lat: {
       type: String
   },
   long: {
       type: String
   },
   location: {
        type: {
            type: String,
            enum: ['point']
            // required: true
        },
        coordinates: {
            type: [Number]
            // required: true
        }
    },
    address: {
        type: String,
        default: " ",
        trim: true
    },
    cross: { 
        type: String,
        default: null,
        trim: true
    },
    addrritems: {
        principal: String,
        cruceA: String,
        cruceB: String,
        puerta: String,
        detalles: String
    },
    imgName: {
        type: String
    } 
})
commerceSchema.index({ 'location' : "2dsphere" });

module.exports = model('Commerce', commerceSchema );