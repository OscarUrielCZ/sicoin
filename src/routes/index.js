const path = require('path');
const fs = require('fs-extra');
const express = require('express');

const Administrador = require('../models/administrador');
const Producto = require('../models/producto');

const router = express.Router();

// Dashboard
router.get('/', (req, res) => {
    res.render('index');
});

// Administradores

router.get('/administradores', (req, res) => {
    Administrador.find((err, administradores) => {
        let data;

        if (err) {
            data = {
                ok: false,
                err,
                scripts: ['administradores.js']
            };
        } else {
            data = {
                ok: true,
                administradores,
                scripts: ['administradores.js']
            }
        }

        return res.render('administradores', data);
    });
});

router.post('/nuevo-admin', async(req, res) => {
    let nombre = req.body.nombre;
    let clave = req.body.clave;
    let image = req.file;

    let ext = path.extname(image.originalname).toLowerCase();
    let targetPath = path.resolve(`src/public/assets/images/users/${image.filename}${ext}`);

    await fs.rename(image.path, targetPath);

    let admin = new Administrador({
        nombre,
        clave,
        imagen: image.filename + ext
    });

    admin.save(async(err, adminDB) => {
        if (err) {
            await fs.unlink(image.path);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            admin: adminDB
        });
    });
});

router.get('/eliminar-admin/:id', (req, res) => {
    let adminid = req.params.id;

    Administrador.findOneAndRemove({ _id: adminid }, async(err, adminDeleted) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        await fs.unlink(path.resolve(`src/public/assets/images/users/${adminDeleted.imagen}`));
        return res.redirect('/administradores');
    });
});

router.get('/editar-admin/:id', (req, res) => {
    let adminid = req.params.id;

    Administrador.findById({ _id: adminid }, (err, adminDB) => {
        if (err) return res.render('administradores');
        return res.render('editar-admin', {
            administrador: adminDB,
            scripts: ['editar-admin.js']
        });
    });
});

router.post('/actualiza-admin', async(req, res) => {
    let adminid = req.body.id;
    let imagen = req.file;
    let data = {
        nombre: req.body.nombre,
        clave: req.body.clave
    };
    if (imagen) {
        let ext = path.extname(imagen.originalname);
        let targetPath = path.resolve(`src/public/assets/images/users/${imagen.filename}${ext}`);

        data.imagen = imagen.filename + ext;

        await fs.rename(imagen.path, targetPath);
    }

    Administrador.findByIdAndUpdate({ _id: adminid }, data, async(err, admin) => {
        if (err) {
            if (imagen)
                await fs.unlink(targetPath);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (imagen)
            await fs.unlink(path.resolve(`src/public/assets/images/users/${admin.imagen}`));

        return res.json({
            ok: true,
            adminintrador: admin
        });
    });
});

// Inventario

router.get('/inventario', async(req, res) => {
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
});

router.post('/nuevo-producto', (req, res) => {
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
});

router.get('/borrar-producto/:id', (req, res) => {
    let prodid = req.params.id;

    Producto.findOneAndRemove({ _id: prodid }, (err, prodDeleted) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        return res.redirect('/inventario');
    });
});

router.get('/comprar-producto/:id', (req, res) => {
    let prodid = req.params.id;

    Producto.findById({ _id: id }, (err, producto) => {
        if (err)
            return res.redirect('/inventario');
        let existencias = producto.existencias;

        if (existencias <= 0) return res.redirect('/inventario');

        res.render('comprar-prod', {
            producto
        });
    });
});

router.post('/hacer-compra/:id', (req, res) => {
    Producto.findById({ _id: prodid }, (err, producto) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        let ventas = producto.ventas;


        Producto.findByIdAndUpdate({ _id: prodid, }, {
            existencias: existencias - 1,
            ventas: ventas + 1
        }, { new: true }, (err, prodUpdated) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            return res.redirect('/inventario');
        });
    });
});

router.get('/editar-producto/:id', (req, res) => {
    let prodid = req.params.id;

    Producto.findById({ _id: prodid }, (err, prodDB) => {
        if (err) return res.render('inventario');
        return res.render('editar-prod', {
            producto: prodDB,
            scripts: ['editar-prod.js']
        });
    });
});

router.post('/actualizar-prod', (req, res) => {
    let idprod = req.body.id;
    let data = {
        nombre: req.body.nombre,
        marca: req.body.marca,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        existencias: req.body.existencias
    };

    console.log('id: ', idprod);
    Producto.findByIdAndUpdate({ _id: idprod }, data, (err, lastprod) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        console.log('prod ', lastprod);
        return res.json({
            ok: true,
            producto: lastprod
        });
    });

})

// Estadíticas

router.get('/estadisticas', (req, res) => {
    res.render('estadisticas');
});

module.exports = router;