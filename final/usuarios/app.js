import { usuario, rol } from "../Modulos JS/config.js"; 
import solicitud from "../Modulos JS/listar.js";

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
        window.location.href = "../../index.html";
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
    const dataUsuarios = await solicitud(usuario);
    const dataRoles = await solicitud(rol);

    // Crear el tbody
    const tbody = dom.createElement('tbody');
    tbody.classList.add('tableBody')

    dataUsuarios.forEach((element) => {
        // Crear una nueva fila
        const fila = dom.createElement('tr');

        // Crear y agregar las celdas con los datos
        const celda1 = dom.createElement('td');
        celda1.textContent = element.id;
        fila.appendChild(celda1);

        const celda2 = dom.createElement('td');
        celda2.textContent = element.nombre;
        fila.appendChild(celda2);

        const celda3 = dom.createElement('td');
        celda3.textContent = element.apellido;
        fila.appendChild(celda3);

        const celda4 = dom.createElement('td');
        celda4.textContent = element.edad;
        fila.appendChild(celda4);

        const celda5 = dom.createElement('td');
        celda5.textContent = element.correo;
        fila.appendChild(celda5);

        const celda6 = dom.createElement('td');
        celda6.textContent = element.telefono;
        fila.appendChild(celda6);

        const celda7 = dom.createElement('td');
        const rolUsuario = dataRoles.find(r => r.id == element.rol);
        celda7.textContent = rolUsuario ? rolUsuario.name : "Sin rol";
        fila.appendChild(celda7);

        const celda8 = dom.createElement('td');
        celda8.textContent = element.estado;
        fila.appendChild(celda8);

        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    tabla.appendChild(tbody);
};

