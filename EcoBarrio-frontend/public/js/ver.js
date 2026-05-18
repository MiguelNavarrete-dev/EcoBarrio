const urlParams = new URLSearchParams(window.location.search); // lee los parámetros de la URL
const miSlug = urlParams.get('slug');

if (miSlug) {
    fetch(`http://127.0.0.1:8000/puntos-verdes/${miSlug}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('comuna-text').innerText = data.comuna;
            document.getElementById('planta-nombre').innerText = data.nombre;
            
            const imgElement = document.getElementById('imagen');
            if(imgElement) imgElement.src = data.foto_referencia;
        })
        .catch(err => console.error("Error al cargar la planta:", err));
}