const { Schema, model } = require('mongoose');

const NegocioSchema =  Schema({

    tipo: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    emblema: {
        type: String,
    },
    especialidad: {
        type: String,
    },
    contacto: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwd: {
        type: String,
        required: true
    },
   lat: {
       type: String
   },
   long: {
       type: String
   },
   location: {
        type:{
            type: String,
            enum: ['point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    direccion: {
    type: String
    },
    cruce: { 
    type:String,
    },
    imgName: {
        type:String
    }
})
NegocioSchema.index({ "location": "2dsphere" });

module.exports = model('Negocio',NegocioSchema );
