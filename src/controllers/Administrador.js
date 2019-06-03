const Administrador = require('../models/administrador');

module.exports = {
    mostrar: (req, res) => {
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
    },
    mostrarLogin: (req, res) => {
        res.render('login', {
            scripts: ['login.js']
        });
    },
    login: async(req, res) => {
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
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/inventario');
    },
    signup: async(req, res) => {
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
    },
    eliminar: (req, res) => {
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
    },
    editar: (req, res) => {
        let adminid = req.params.id;

        Administrador.findById({ _id: adminid }, (err, adminDB) => {
            if (err) return res.render('administradores');
            return res.render('editar-admin', {
                administrador: adminDB,
                scripts: ['editar-admin.js']
            });
        });
    },
    actualizar: async(req, res) => {
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
    }
};