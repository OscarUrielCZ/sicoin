const path = require('path');
const fs = require('fs-extra');
const express = require('express');

const Administrador = require('../models/administrador');
const Producto = require('../models/producto');
const Venta = require('../models/venta');

const router = express.Router();

// Dashboard
router.get('/', isAuthenticated, async(req, res) => {
    let hoy = new Date();
    let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];
    let colores = ['success', 'info', 'danger', 'warning', 'success']
    let dia = hoy.getDate(),
        mes = hoy.getMonth();
    let fecha = {
        diasemana: dias[hoy.getDay()],
        dia,
        mes: meses[mes]
    };
    let fechaformato = `${dia}/${mes+1}/${hoy.getFullYear()}`;
    let ventas = await Venta.find({ fecha: fechaformato });
    let totalIngresos = totalVentas = 0;
    let ides = [],
        productos = [];
    let producto, parcialventas;

    for (let i = 0; i < ventas.length; i++) {
        if (ides.indexOf(ventas[i].prodID) == -1) {
            ides.push(ventas[i].prodID);
            producto = {
                producto: await Producto.findById({ _id: ventas[i].prodID }),
                ventas: ventas[i].cantidad
            };
            productos.push(producto);
        } else {
            parcialventas = productos[ides.indexOf(ventas[i].prodID)].ventas;
            productos[ides.indexOf(ventas[i].prodID)].ventas = parcialventas += ventas[i].cantidad;
        }
        totalIngresos += ventas[i].ingreso;
        totalVentas += ventas[i].cantidad;
    }

    producto = productos[0];
    for (let i = 1; i < productos.length; i++) {
        if (productos[i].ventas > producto.ventas)
            producto = productos[i];
    }

    let auxventas = ventas.reverse().slice(0, 5);
    let ultimasventas = [];
    for (let i = 0; i < auxventas.length; i++) {
        ultimasventas.push({
            producto: productos[ides.indexOf(auxventas[i].prodID)].producto,
            cantidad: auxventas[i].cantidad,
            ganancias: auxventas[i].ingreso,
            hora: auxventas[i].hora,
            color: colores[i]
        });
    }

    res.render('index', {
        fecha,
        ingresos: totalIngresos,
        ventas: totalVentas,
        bestseller: producto.producto,
        ultimasventas,
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        scripts: ['login.js']
    });
});

router.post('/login', async(req, res) => {
    let nombre = req.body.nombre;
    let clave = req.body.clave;

    let admin = await Administrador.findOne({ nombre });

    if (admin) {
        if (clave == admin.clave) {
            req.session.administrador = admin;
            return res.json({
                ok: true,
                administrador: admin
            });
        } else {
            return res.json({
                ok: false,
                message: 'Contraseña incorrecta'
            });
        }
    }

    return res.json({
        ok: false,
        message: 'No existe el usuario'
    });
});

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy();
    res.redirect('/inventario');
});

// Administradores

router.get('/administradores', isAuthenticated, (req, res) => {
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

router.get('/eliminar-admin/:id', isAuthenticated, (req, res) => {
    let adminid = req.params.id;

    Administrador.findOneAndRemove({ _id: adminid }, async(err, adminDeleted) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        await fs.unlink(path.resolve(`src/public/assets/images/users/${adminDeleted.imagen}`));
        if (adminid == req.session.administrador._id)
            return res.redirect('/cerrar-sesion');
        return res.redirect('/administradores');
    });
});

router.get('/editar-admin/:id', isAuthenticated, (req, res) => {
    let adminid = req.params.id;

    Administrador.findById({ _id: adminid }, (err, adminDB) => {
        if (err) return res.render('administradores');
        return res.render('editar-admin', {
            administrador: adminDB,
            scripts: ['editar-admin.js']
        });
    });
});

router.post('/actualiza-admin', isAuthenticated, async(req, res) => {
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
        let newimage;
        if (imagen)
            await fs.unlink(path.resolve(`src/public/assets/images/users/${admin.imagen}`));

        if (imagen)
            newimage = data.imagen;
        else
            newimage = admin.imagen;


        req.session.administrador = { // actualiza sesión actual
            _id: adminid,
            nombre: data.nombre,
            clave: data.clave,
            imagen: newimage
        };
        return res.json({
            ok: true,
            administrador: admin
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

router.post('/nuevo-producto', isAuthenticated, (req, res) => {
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

router.get('/borrar-producto/:id', isAuthenticated, (req, res) => {
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
});

router.post('/hacer-compra', (req, res) => {
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
});

router.get('/editar-producto/:id', isAuthenticated, (req, res) => {
    let prodid = req.params.id;

    Producto.findById({ _id: prodid }, (err, prodDB) => {
        if (err) return res.render('inventario');
        return res.render('editar-prod', {
            producto: prodDB,
            scripts: ['editar-prod.js']
        });
    });
});

router.post('/actualizar-prod', isAuthenticated, (req, res) => {
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

})

// Estadíticas

router.get('/estadisticas', isAuthenticated, (req, res) => {
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
});

router.post('/obtener-ventas', (req, res) => {
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
});

router.post('/obtener-producto/:id}', (req, res) => {
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
});

function isAuthenticated(req, res, next) {
    if (req.session.administrador)
        return next();
    return res.redirect('/inventario');
}

module.exports = router;