const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    nombre: String,
    clave: String,
    imagen: String
});

module.exports = model('Administrador', adminSchema);