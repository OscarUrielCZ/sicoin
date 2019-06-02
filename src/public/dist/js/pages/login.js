window.addEventListener('load', () => {
    let file = document.getElementById('img-reg');
    let registro = document.getElementById('btn-reg');
    let ingresar = document.getElementById('btn-ing');

    // Ingreso
    ingresar.addEventListener('click', () => {
        let nombre = document.getElementById('nombre-ing').value;
        let clave = document.getElementById('clave-ing').value;

        if (nombre && clave) {
            let data = new FormData();

            data.append('nombre', nombre);
            data.append('clave', clave);

            fetch('/login', {
                    method: 'POST',
                    body: data
                })
                .then(resp => resp.json())
                .then(resp => {
                    console.log(resp);
                    if (resp.ok)
                        location.href = '/';
                    else
                        alert(resp.message);
                });
        } else {
            alert('Faltan datos');
        }
    });
    // Vista previa
    file.addEventListener('change', function() {
        let previewCard = document.querySelector('.preview-card');

        if (file.files && file.files[0] && file.files[0].type.indexOf('image') != -1) {
            let preview = document.getElementById('admin-img-prev');
            let image = file.files[0];
            let reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
            };

            reader.readAsDataURL(image);
            previewCard.style.display = 'inline-block';
        } else {
            previewCard.style.display = 'none';
        }
    });

    // Registro
    registro.addEventListener('click', (e) => {
        e.preventDefault();
        let nombre = document.getElementById('nombre-reg').value;
        let clave = document.getElementById('clave-reg').value;
        let image = file.files[0];

        if (nombre && clave && image) {
            let data = new FormData();

            data.append('nombre', nombre);
            data.append('clave', clave);
            data.append('image', image, image.name);

            if (file.files[0].type.indexOf('image') != -1) {
                fetch('/nuevo-admin', {
                        method: 'POST',
                        body: data
                    })
                    .then(() => {
                        alert('Registro exitoso');
                        location.reload();
                    })
                    .catch(err => alert('Algo salió mal, intenta más tarde'));
            } else {
                alert('La imágen no es válida');
            }
        } else {
            alert('Por favor, rellenar correctamente todos los campos');
        }
    });
});