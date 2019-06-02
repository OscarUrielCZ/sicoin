window.addEventListener('load', () => {
    let diasSemana = [];

    let fecha = new Date(),
        dia = fecha.getDate(),
        mes = fecha.getMonth() + 1;

    for (let i = 0; i < 7; i++) {
        if (dia <= 0) {
            mes = mes - 1;
            if (mes <= 0)
                mes = 12;
            dia = diasEnMes(mes);
        }
        diasSemana.push(`${nombreMes(mes)}, ${dia}`);
        dia = dia - 1;

    }
    diasSemana = diasSemana.reverse();

    fetch('/obtener-ventas', { method: 'POST' })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.ok) {
                let totalVentas = [0, 0, 0, 0, 0, 0, 0];
                let totalGanancias = [0, 0, 0, 0, 0, 0, 0];
                let dias = 0;
                let ventas = resp.ventas.reverse();
                let fecahaux = [fecha.getDate(), fecha.getMonth() + 1, fecha.getFullYear()]
                let fechaventa;
                for (let i = 0; i < ventas.length; i++) {
                    if (!ventas[i].ingreso) console.log("Falte yo", ventas[i]._id);
                    fechaventa = ventas[i].fecha.split('/');
                    if (!esIgual(fechaventa, fecahaux))
                        dias++;
                    if (dias >= 7)
                        break;
                    totalVentas[dias] += Number(ventas[i].cantidad);
                    totalGanancias[dias] += Number(ventas[i].ingreso);
                    fecahaux = fechaventa.slice();
                }
                totalVentas = totalVentas.reverse();
                totalGanancias = totalGanancias.reverse();
                graficar('grafica-ventas', 'Ventas', '(10, 180, 10', diasSemana, totalVentas);
                graficar('grafica-ganancias', 'Ganancias', '(190, 210, 0', diasSemana, totalGanancias);
            }
        })
        .catch(err => console.log(err));


});

let graficar = (elemento, nombre, color, labels, data) => {
    let contexto = document.getElementById(elemento).getContext('2d');
    new Chart(contexto, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: nombre,
                backgroundColor: 'rgba' + color + ', 0.1)',
                borderColor: 'rgb' + color + ')',
                data
            }]
        },
        options: {}
    });
};

let esIgual = (lista1, lista2) => {
    if (lista1.length != lista2.length)
        return false
    for (let i = 0; i < lista1.length; i++)
        if (lista1[i] != lista2[i])
            return false;
    return true;
}

let diasEnMes = (mes) => {
    return new Date(2019, mes, 0).getDate();
};

let nombreMes = (mes) => {
    switch (mes) {
        case 1:
            return 'ene';
        case 2:
            return 'feb';
        case 3:
            return 'mar';
        case 4:
            return 'abr';
        case 5:
            return 'may';
        case 6:
            return 'jun';
        case 7:
            return 'jul';
        case 8:
            return 'ago';
        case 9:
            return 'sep';
        case 10:
            return 'oct';
        case 11:
            return 'nov';
        default:
            return 'dic';
    }
};