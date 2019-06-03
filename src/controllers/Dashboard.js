const Venta = require('../models/venta');
const Producto = require('../models/producto');

module.exports = {
    mostrar: async(req, res) => {
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
    }
};