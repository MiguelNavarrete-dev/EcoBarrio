import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBU2HcRd3B_edvFkdQxMFncSGI6GzHRrps",
  authDomain: "eco-barri0.firebaseapp.com",
  projectId: "eco-barri0",
  storageBucket: "eco-barri0.firebasestorage.app",
  messagingSenderId: "749028695342",
  appId: "1:749028695342:web:2c5a04012a1187b8ddaebf",
  measurementId: "G-PV1HXDJ7PR"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/* * Este archivo se encarga de cargar los datos de la tabla de plantas desde el backend**/
const loadTableData = {
    async loadplant() {
        try {
            const response = await fetch('http://127.0.0.1:8000/puntos-verdes/');
            const data = await response.json();
            const tableBody = document.getElementById('tablaPuntos');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
            data.forEach(plant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 text-sm font-mono text-gray-500">${plant.id}</td>

                    <td class="px-6 py-4">
                        ${plant.foto_referencia ? 
                            `<img src="${plant.foto_referencia}" class="w-10 h-10 object-cover rounded-xl shadow-sm border border-white">` : 
                            `<div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"><i class="bi bi-image"></i></div>`
                        }
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-800">${plant.nombre}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${plant.slug}</td>
                    <td class="px-6 py-4 text-sm text-right">
                        <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            ${plant.nivel_resistencia}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                        <button class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" onclick="verDetalle('${plant.slug}')">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors btn-delete" data-slug="${plant.slug}">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button 
                            onclick="prepararEdicion('${plant.slug}')" 
                            class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }   
};

/** Función para alternar la visibilidad de la barra lateral */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    // Si tiene la clase de estar afuera, la quitamos; si no, la ponemos.
    sidebar.classList.toggle('-translate-x-full');
}

/* Cargar los datos de la tabla cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
    loadTableData.loadplant(); 
});

/* funcionalidad botones de la tabla */

// click en el botón de eliminar
document.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('button');
    if (deleteBtn && deleteBtn.classList.contains('btn-delete')) { // O usa una clase específica
        const slug = deleteBtn.dataset.slug;
        ejecutarBorrado(slug);
        console.log(`Botón de eliminar con slug: ${slug} fue clickeado`);
    }
});

// click ver detalle de un punto verde, usando delegación de eventos para manejar los botones dinámicos
document.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('button');
    if (viewBtn && viewBtn.classList.contains('btn-view')) { // O usa una clase específica
        const slug = viewBtn.dataset.slug;
        verDetalle(slug);
        console.log(`Botón de ver con slug: ${slug} fue clickeado`);
    }
});


/* Función para agregar un nuevo punto verde */
async function agregarPuntoVerde() {
    const nombre = document.getElementById('nombre').value;
    const slug = document.getElementById('slug').value;
    const latitud = parseFloat(document.getElementById('latitud').value);
    const longitud = parseFloat(document.getElementById('longitud').value);
    const comuna = document.getElementById('comuna').value;
    const nivel_resistencia = parseInt(document.getElementById('nivel_resistencia').value);
    const foto_referencia = document.getElementById('foto_referencia').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/puntos-verdes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, slug, latitud, longitud, comuna, nivel_resistencia, foto_referencia })
        });
        if (response.ok) {
            loadTableData.loadplant(); // Recargar la tabla después de agregar
            document.getElementById('agregarDato').classList.add('hidden'); // Cerrar el pop-up
            resetForm(); // Limpiar el formulario
        } else {
            Swal.fire({
                title: "Alerta!",
                text: "El punto verde no se pudo agregar. Verifica que el slug sea único y que todos los campos estén completos.",
                icon: "error"
            });
        }
    } catch (error) {
        console.error('Error al agregar el punto verde:', error);
    }
}

// cargar la preview de la imagen en agregar punto verde, y manejar el error si el link no es válido
function actualizarPreview(inputId, previewId) {
    const url = document.getElementById(inputId).value;
    const previewImg = document.getElementById(previewId);

    if (url && url.trim() !== "") {
        previewImg.src = url;
        previewImg.classList.remove('hidden');
        
        // Manejo de error si el link no es una imagen válida
        previewImg.onerror = function() {
            this.classList.add('hidden');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo cargar la imagen. Verifica que el enlace sea correcto y apunte a una imagen válida.",
            });
        };
    } else {
        previewImg.classList.add('hidden');
    }
}

// resetea el formulario de agregar punto verde para que no queden datos anteriores al abrirlo de nuevo
async function resetForm() {
    document.getElementById('nombre').value = '';
    document.getElementById('slug').value = '';
    document.getElementById('latitud').value = '';
    document.getElementById('longitud').value = '';
    document.getElementById('comuna').value = '';
    document.getElementById('nivel_resistencia').value = '';
    document.getElementById('foto_referencia').value = '';
}

/* Funciones para los botones */
async function ejecutarBorrado(slug) {
   confirm('¿Estás seguro de que deseas eliminar este punto verde?') && await fetch(`${`http://127.0.0.1:8000/puntos-verdes/`}${slug}`, {
        method: 'DELETE'
    });
    loadTableData.loadplant(); // Recargar la tabla después de eliminar
}

// ver detalle de un punto verde en un pop-up usando SweetAlert2
async function verDetalle(slug) {
    try {
        const response = await fetch(`${`http://127.0.0.1:8000/puntos-verdes/`}${slug}`);
        const plant = await response.json();
        
        Swal.fire({
            title: `<strong>${plant.nombre}</strong>`,
            icon: 'info',
            html: `
                <div style="text-align: left; font-size: 0.9em;">
                    <p><b>Slug:</b> ${plant.slug}</p>
                    <p><b>Coordenadas:</b> ${plant.latitud}, ${plant.longitud}, ${plant.comuna}</p>
                    <p><b>Resistencia:</b> Nivel ${plant.nivel_resistencia}</p>
                </div>
                ${plant.foto_referencia ? `<img src="${plant.foto_referencia}" style="width:100%; border-radius:15px; margin-top:10px;">` : ''}
            `,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="bi bi-check-lg"></i> Entendido',
            confirmButtonColor: '#3b82f6', // Un azul similar al tuyo
            customClass: {
                popup: 'rounded-3xl', // Para que combine con tu Soft UI
            }
        });

    } catch (error) {
        console.error('Error al obtener los detalles del punto verde:', error);
    }
}

//cerrar el pop-up de agregar punto verde
document.getElementById('cerrar-btn').onclick = () => {
    document.getElementById('agregarDato').classList.add('hidden');
    resetForm();
};

// EDICIÓN DE PUNTOS VERDES
async function prepararEdicion(slug) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/puntos-verdes/${slug}`);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar la información del punto verde');
        }
        
        const punto = await response.json();

    
        document.getElementById('edit-slug-hidden').value = punto.slug;
        document.getElementById('edit-nombre').value = punto.nombre || '';
        document.getElementById('edit-slug').value = punto.slug || '';
        document.getElementById('edit-latitud').value = punto.latitud || 0;
        document.getElementById('edit-longitud').value = punto.longitud || 0;
        document.getElementById('edit-comuna').value = punto.comuna || '';
        document.getElementById('edit-resistencia').value = punto.nivel_resistencia || 1;
        
        const inputFoto = document.getElementById('edit-foto');
        if (inputFoto) inputFoto.value = punto.foto_referencia || '';


        document.getElementById('editModal').classList.remove('hidden');
        
        console.log("Editando punto:", slug);

    } catch (error) {
        console.error("Error al preparar edición:", error);
        alert("Error: " + error.message); // El alert va aquí para atrapar cualquier fallo
    }
}

// guardar cambios después de editar un punto verde
async function guardarCambios() {
    const slugOriginal = document.getElementById('edit-slug-hidden').value;

    const DatosNuevos = {
        nombre: document.getElementById('edit-nombre').value,
        slug: document.getElementById('edit-slug').value,
        latitud: parseFloat(document.getElementById('edit-latitud').value),
        longitud: parseFloat(document.getElementById('edit-longitud').value),
        comuna: document.getElementById('edit-comuna').value,
        nivel_resistencia: parseInt(document.getElementById('edit-resistencia').value),
        foto_referencia: document.getElementById('edit-foto').value
    };
    try {
        const response = await fetch(`http://127.0.0.1:8000/puntos-verdes/${slugOriginal}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(DatosNuevos)
        });

        if (!response.ok) throw new Error('No se pudieron guardar los cambios');

        cerrarModal();
        loadTableData.loadplant(); // Recargar la tabla después de guardar
    } catch (error) {
        console.error("Error al guardar cambios:", error);
    }
}

// cerrar el pop-up de editar punto verde y poder usar el clickear fuera del cuadro para cerrarlo también
function cerrarModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('agregarDato').classList.add('hidden');
}

// TIP: Cerrar si el usuario hace clic fuera del cuadrito blanco
window.onclick = function(event) {
    const agregarModal = document.getElementById('agregarDato');
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        cerrarModal();
    }
    else if (event.target == agregarModal) {
        cerrarModal();
        resetForm(); // Limpiar el formulario al cerrar el pop-up de agregar
    }
}

document.getElementById('foto_referencia').addEventListener('input', (e) => {
    const url = e.target.value;
    const previsualizacion = document.getElementById('preview-img');
    if (url.startsWith('http')) {
        previsualizacion.src = url;
        previsualizacion.classList.remove('hidden');
    }
});

document.getElementById('tablaPuntos').addEventListener('click', (e) => {
    // Buscamos si el clic fue en el botón de editar (o en el icono dentro del botón)
    const btn = e.target.closest('#edit-btn');
    
    if (btn) {
        const slug = btn.getAttribute('data-slug');
        prepararEdicion(slug); // Llamas a la función que carga los datos
    }
});

// abro el pop-up de editar punto verde
function abrirModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');
}


// nombre admin
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const displayName = document.getElementById('display-name');
        
        const name = user.email ? user.email.split('@')[0] : "Admin";
        displayName.textContent = `Admin: ${name}`;
    }
});