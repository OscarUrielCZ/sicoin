const { Schema, model } = require('mongoose');

let ventaSchema = new Schema({
    prodID: String,
    cantidad: Number,
    fecha: String,
    hora: String,
    cliente: String,
    ingreso: Number
});

module.exports = model('Venta', ventaSchema);