window.addEventListener('load', () => {
    let guardar = document.getElementById('btn-guardar');
    let file = document.getElementById('img-reg');
    let adminid = document.getElementById('id-reg').value;
    let imgModified = false;

    // Vista previa
    file.addEventListener('change', function() {
        imgModified = true;
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

    guardar.addEventListener('click', () => {
        let nombre = document.getElementById('nombre-reg').value;
        let clave = document.getElementById('clave-reg').value;
        let imagen = file.files[0];

        if (nombre && clave && (!imgModified || imagen)) {
            let data = new FormData();

            data.append('id', adminid);
            data.append('nombre', nombre);
            data.append('clave', clave);
            if (imgModified) data.append('image', imagen, imagen.name);

            fetch('/actualiza-admin', {
                    method: 'POST',
                    body: data
                })
                .then(resp => resp.json())
                .then(resp => {
                    alert('Guardado correctamente');
                    location.href = '/administradores';
                })
                .catch(err => console.log(err));
        } else {
            alert('Faltan datos');
        }
    });

});