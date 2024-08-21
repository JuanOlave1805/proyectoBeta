import { categorias } from "../../Modulos JS/config.js"; 
import solicitud from "../../Modulos JS/listar.js";
import validar from "../../Modulos JS/validarFormularios.js";
import agregarDato from "../../Modulos JS/agregar.js";
import validateTextInput from "../../Modulos JS/moduloSoloLetras.js";

const $inputID = document.querySelector('#id')
const $inputNombre = document.querySelector('#nombre');
const $table = document.querySelector('#table');
const $checkbox = document.querySelector('#terminos');
const $formulario = document.querySelector('#registroForm');
const $Button = document.querySelector('#button');

// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion();
    listar();
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});

// Agrega un event listener al checkbox para manejar el cambio de estado
$checkbox.addEventListener('change', toggleButtonState);

// Agrega un event listener al formulario para manejar el submit
$formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    try {
        await save();
    } catch (error) {
        console.error('Error al guardar los datos:', error); // Maneja el error
    }
});

$inputNombre.addEventListener("input", (event) => {
    validateTextInput(event.target);
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

const save = async () => {
    // Verifica la validez del formulario
    let ok = validar("#registroForm"); // Llama a la función validar

    // Captura todos los atributos
    const data = {
        nombre: $inputNombre.value.toUpperCase(),
    };

    if (ok) {
        try {
            const resultado = await agregarDato(categorias, data);
            console.log('Resultado:', resultado); // Maneja el resultado

            // Mostrar un alert de éxito
            alert("Categpria agregada exitosamente");

            // Limpiar los campos del formulario
            $inputNombre.value = "";
            $checkbox.checked = false;

            // Agregar la nueva fila a la tabla
            agregarFila(data); // Actualiza la tabla con el nuevo dato

        } catch (error) {
            console.error('Error al agregar el dato:', error);
        }
    }
};


// Función para habilitar o deshabilitar el botón
function toggleButtonState() {
    $Button.disabled = !$checkbox.checked; // Habilita o deshabilita el botón según el estado del checkbox
}


const agregarFila = (data) => {
    const fragmento = dom.createDocumentFragment();
    
    // Crear una nueva fila
    const fila = dom.createElement('tr');

    // Crear y agregar las celdas con los datos
    const celda1 = dom.createElement('td');
    celda1.textContent = data.nombre;
    fila.appendChild(celda1);

    // Agregar la fila al fragmento
    fragmento.appendChild(fila);

    // Agregar el fragmento al tbody
    const tbody = dom
    .querySelector('tbody');
    if (tbody) {
        tbody.appendChild(fragmento);
    } else {
        console.error("No se encontró el tbody en la tabla.");
    }
};

