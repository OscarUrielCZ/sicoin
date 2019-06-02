const path = require('path');
const express = require('express');
const hbs = require('hbs');
const multer = require('multer');
const session = require('express-session');

const routes = require('../routes/index');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(app.get('views'), 'partials'));
require('./helpers');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'sistemadecontroldeinventarios',
    resave: true,
    saveUninitialized: true
}));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(multer({ dest: path.join(__dirname, '../public/assets/images/temp') }).single('image'));

app.use((req, res, next) => {
    app.locals.sesion = req.session.administrador;
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/', routes);

module.exports = app;