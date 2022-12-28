
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    name: { 
        nombres: String, 
        apellidos: String 
    },
    
    address: [{ 
        lugar: String,
        direccion: String,
        coordenadas:{lat: Number, long: Number}
    }],

    phone: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
    },
})

module.exports = model('Usuario', UsuarioSchema );