const { Schema, model } = require('mongoose');

const prodSchema = new Schema({
    nombre: String,
    marca: String,
    precio: Number,
    cantidad: String,
    existencias: Number
});

module.exports = model('Producto', prodSchema);