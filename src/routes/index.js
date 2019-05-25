const path = require('path');
const fs = require('fs-extra');
const express = require('express');

const Administrador = require('../models/administrador');

const router = express.Router();

// Dashboard
router.get('/', (req, res) => {
    res.render('index');
});

// Administradores
router.get('/administradores', (req, res) => {
    res.render('administradores', {
        scripts: ['administradores.js']
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

// Inventario
router.get('/inventario', (req, res) => {
    res.render('inventario');
});

// Estadíticas
router.get('/estadisticas', (req, res) => {
    res.render('estadisticas');
});

module.exports = router;