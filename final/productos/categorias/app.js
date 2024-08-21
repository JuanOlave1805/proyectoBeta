import { categorias } from "../../Modulos JS/config.js"; 
import solicitud from "../../Modulos JS/listar.js";




// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion();
    listar();
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});


//Control de las secciones
const validarSesion = () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (!usuarioActivo) {
        // Redirigir al login si no hay sesión activa
        window.location.href = "../../../index.html";
    } else {
        // Si hay sesión activa, convertir el string almacenado a un objeto
        const usuario = JSON.parse(usuarioActivo);
        console.log(usuario.id);
    }
};


const dom = document;
const tabla = dom.querySelector("#table");

const listar = async () => {
    const fragmento = dom.createDocumentFragment();
    const dataCategorias = await solicitud(categorias);

    // Crear el tbody
    const tbody = dom.createElement('tbody');

    dataCategorias.forEach((element) => {
        // Crear una nueva fila
        const fila = dom.createElement('tr');

        // Crear y agregar las celdas con los datos
        const celda1 = dom.createElement('td');
        celda1.textContent = element.nombre;
        fila.appendChild(celda1);

        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    tabla.appendChild(tbody);
};

