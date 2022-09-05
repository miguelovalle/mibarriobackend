 const mongoose = require('mongoose');

 
 const dbConnection  = async() => {

    try {
        await mongoose.connect('mongodb://localhost:27017/mibarrio'); 
        console.log('BD OnLIne');
    } catch (error) {
        console.log(error);
        throw new Error('error inicializando BD'); 
    }
 }

 module.exports = {
    dbConnection
}

