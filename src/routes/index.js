const path = require('path');
const fs = require('fs-extra');
const express = require('express');

const Dashboard = require('../controllers/Dashboard');
const Administrador = require('../controllers/Administrador');
const Producto = require('../controllers/Producto');
const Venta = require('../controllers/Venta');

const router = express.Router();

// Dashboard
router.get('/', isAuthenticated, Dashboard.mostrar);

// Administrador
router.get('/administradores', isAuthenticated, Administrador.mostrar);
router.get('/login', Administrador.mostrarLogin);
router.post('/login', Administrador.login);
router.get('/cerrar-sesion', Administrador.logout);
router.post('/nuevo-admin', Administrador.signup);
router.get('/eliminar-admin/:id', isAuthenticated, Administrador.eliminar);
router.get('/editar-admin/:id', isAuthenticated, Administrador.editar);
router.post('/actualiza-admin', isAuthenticated, Administrador.actualizar);

// Producto
router.get('/inventario', Producto.inventario);
router.post('/nuevo-producto', isAuthenticated, Producto.nuevo);
router.get('/borrar-producto/:id', isAuthenticated, Producto.eliminar);
router.get('/comprar-producto/:id', Producto.mostrarCompra);
router.post('/hacer-compra', Producto.comprar);
router.get('/editar-producto/:id', isAuthenticated, Producto.editar);
router.post('/actualizar-prod', isAuthenticated, Producto.actualizar);
router.get('/estadisticas', isAuthenticated, Producto.estadisticas);
router.post('/obtener-producto/:id}', Producto.obtener);

// Ventas
router.post('/obtener-ventas', Venta.obtener);

// Autenticación de usuario
function isAuthenticated(req, res, next) {
    if (req.session.administrador)
        return next();
    return res.redirect('/inventario');
}

module.exports = router;