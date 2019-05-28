window.addEventListener('load', () => {
    let agregar = document.getElementById('agregar');

    agregar.addEventListener('click', (e) => {
        e.preventDefault();
        let nombre = document.getElementById('nombre').value;
        let marca = document.getElementById('marca').value;
        let precio = document.getElementById('precio').value;
        let cantidad = document.getElementById('cantidad').value;
        let existencias = document.getElementById('existencias').value;

        if (nombre && marca && precio && cantidad && existencias) {
            let data = new FormData();

            data.append('nombre', nombre);
            data.append('marca', marca);
            data.append('precio', precio);
            data.append('cantidad', cantidad);
            data.append('existencias', existencias);

            fetch('/nuevo-producto', {
                    method: 'POST',
                    body: data
                })
                .then(resp => location.reload())
                .catch(err => alert('Algo salió mal, intentar más tarde'));
        } else {
            alert('Por favor, rellenar correctamente todos los campos')
        }
    });
});