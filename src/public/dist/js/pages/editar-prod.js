window.addEventListener('load', () => {
    let idprod = document.getElementById('id-prod').value;
    let guardar = document.getElementById('btn-guardar');

    guardar.addEventListener('click', () => {
        let nombre = document.getElementById('nombre').value;
        let marca = document.getElementById('marca').value;
        let precio = document.getElementById('precio').value;
        let cantidad = document.getElementById('cantidad').value;
        let existencias = document.getElementById('existencias').value;

        if (nombre && marca && precio && cantidad && existencias) {
            let data = new FormData();

            data.append('id', idprod);
            data.append('nombre', nombre);
            data.append('marca', marca);
            data.append('precio', precio);
            data.append('cantidad', cantidad);
            data.append('existencias', existencias);

            fetch('/actualizar-prod', {
                    method: 'POST',
                    body: data
                })
                .then(resp => resp.json())
                .then(resp => {
                    alert('Guardado correctamente')
                })
                .catch(err => location.reload());
        } else {
            alert('Faltan datos');
        }
    });
});