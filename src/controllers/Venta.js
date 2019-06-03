const Venta = require('../models/venta');

module.exports = {
    obtener: (req, res) => {
        Venta.find((err, ventas) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            return res.json({
                ok: true,
                ventas
            })
        });
    }
};