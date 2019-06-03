const Producto = require('../models/producto');
const Venta = require('../models/venta');

module.exports = {
    inventario: async(req, res) => {
        Producto.find((err, productos) => {
            let data;

            if (err) {
                data = {
                    ok: false,
                    err,
                    scripts: ['inventario.js']
                };
            } else {
                data = {
                    ok: true,
                    productos,
                    scripts: ['inventario.js']
                }
            }

            return res.render('inventario', data);
        });
    },
    nuevo: (req, res) => {
        let nombre = req.body.nombre;
        let marca = req.body.marca;
        let precio = req.body.precio;
        let cantidad = req.body.cantidad;
        let existencias = req.body.existencias;

        let producto = new Producto({
            nombre,
            marca,
            precio,
            cantidad,
            existencias
        });

        producto.save((err, prodBD) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            return res.json({
                ok: true,
                producto: prodBD
            });
        })
    },
    eliminar: (req, res) => {
        let prodid = req.params.id;

        Producto.findOneAndRemove({ _id: prodid }, (err, prodDeleted) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            return res.redirect('/inventario');
        });
    },
    mostrarCompra: (req, res) => {
        let prodid = req.params.id;

        Producto.findById({ _id: prodid }, (err, producto) => {
            if (err)
                return res.redirect('/inventario');
            let existencias = producto.existencias;

            if (existencias <= 0) return res.redirect('/inventario');

            res.render('comprar-prod', {
                producto,
                scripts: ['comprar-producto.js']
            });
        });
    },
    comprar: (req, res) => {
        let prodid = req.body.prodid;
        let cantidad = Number(req.body.cantidad);

        Producto.findById({ _id: prodid }, (err, producto) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            let existencias = producto.existencias;
            let ventas = producto.ventas;
            let ingreso = cantidad * producto.precio;

            if (cantidad > existencias)
                return res.json({
                    ok: false,
                    message: `No hay suficiente cantidad de ${producto.nombre} en el inventario`
                });

            Producto.findByIdAndUpdate({ _id: prodid }, {
                existencias: existencias - cantidad,
                ventas: ventas + cantidad
            }, (err, prodUpdated) => {
                if (err)
                    return res.status(400).json({
                        ok: false,
                        err
                    });
            });

            let venta = new Venta({
                prodID: prodid,
                cantidad,
                fecha: req.body.fecha,
                hora: req.body.hora,
                cliente: req.body.nombrecliente,
                ingreso
            });

            venta.save((err, ventaDB) => {
                if (err)
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                return res.json({
                    ok: true,
                    message: 'Compra exitosa'
                });
            });
        });
    },
    editar: (req, res) => {
        let prodid = req.params.id;

        Producto.findById({ _id: prodid }, (err, prodDB) => {
            if (err) return res.render('inventario');
            return res.render('editar-prod', {
                producto: prodDB,
                scripts: ['editar-prod.js']
            });
        });
    },
    actualizar: (req, res) => {
        let idprod = req.body.id;
        let data = {
            nombre: req.body.nombre,
            marca: req.body.marca,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            existencias: req.body.existencias
        };

        Producto.findByIdAndUpdate({ _id: idprod }, data, (err, lastprod) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            return res.json({
                ok: true,
                producto: lastprod
            });
        });

    },
    estadisticas: (req, res) => {
        Producto.find((err, productos) => {
            if (err)
                return res.render('estadisticas');

            let bestsellers = productos.sort((a, b) => {
                return a.ventas - b.ventas;
            }).reverse().slice(0, 5);
            let bestearners = productos.sort((a, b) => {
                return a.ventas * a.precio - b.ventas * b.precio;
            }).reverse().slice(0, 5);

            return res.render('estadisticas', {
                bestsellers,
                bestearners,
                scripts: ['estadisticas.js']
            });
        });
    },
    obtener: (req, res) => {
        let prodid = req.params.id;

        Producto.findById({ _id: prodid }, (err, producto) => {
            if (err)
                return res.json(400).json({
                    ok: false,
                    err
                });
            return res.json({
                ok: true,
                producto
            });
        });
    }
};