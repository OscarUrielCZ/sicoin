const { Schema, model } = require('mongoose');

let ventaSchema = new Schema({
    prodID: String,
    cantidad: String,
    fecha: String,
    hora: String,
    cliente: String
});

module.exports = model('Venta', ventaSchema);