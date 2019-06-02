window.addEventListener('load', () => {
    let comprar = document.getElementById('btn-comprar');
    let prodid = document.getElementById('id-prod').value;

    comprar.addEventListener('click', () => {
        let nombrecliente = document.getElementById('nombrecliente').value;
        let cantidad = document.getElementById('cantidad').value;
        let fecha = new Date();
        let tiempo = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        let momento = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;

        if (nombrecliente && cantidad) {
            let data = new FormData();

            data.append('prodid', prodid);
            data.append('fecha', momento);
            data.append('hora', tiempo);
            data.append('nombrecliente', nombrecliente);
            data.append('cantidad', cantidad);

            fetch('/hacer-compra', {
                    method: 'POST',
                    body: data
                })
                .then(resp => resp.json())
                .then(resp => {
                    alert(resp.message);
                    if (resp.ok) {
                        location.href = '/inventario';
                    }
                })
                .catch(err => console.log(err));
        } else {
            alert('Faltan campos');
        }
    });
});