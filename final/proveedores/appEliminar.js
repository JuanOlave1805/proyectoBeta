import validar from "../Modulos JS/validarFormularios.js";
import { default as numeros } from '../Modulos JS/moduloSoloNumeros.js';
import { default as validateTextInput } from '../Modulos JS/moduloSoloLetras.js';
import { default as validateEmail } from '../Modulos JS/correo.js';
import { proveedores } from "../Modulos JS/config.js";
import solicitud from "../Modulos JS/listar.js";
import {default as eliminarDato} from "../Modulos JS/eliminar.js"

// id html
const dom = document;
const $inputTelefono = dom.querySelector("#telefono");
const $inputNombre = dom.querySelector("#nombre");
const $inputCorreo = dom.querySelector("#correo");
const $inputEncargado = dom.querySelector("#nombreUsuario");
const $inputID = dom.querySelector("#id");
const $checkbox = document.querySelector('#terminos');
const $Button = document.querySelector('#button');
const $formulario = dom.querySelector('#registroForm');
const $table = dom.querySelector("#table")

// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion();
    seleccionarFila($table, [$inputID, $inputNombre, $inputEncargado, $inputCorreo, $inputTelefono]);
    listar();
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});

$inputTelefono.addEventListener("keyup", (event) => {
    numeros(event, $inputTelefono);
});
$inputTelefono.addEventListener("keypress", (event) => {
    numeros(event, $inputTelefono);
});

$inputNombre.addEventListener("input", (event) => {
    validateTextInput(event.target);
});
$inputEncargado.addEventListener("input", (event) => {
    validateTextInput(event.target);
});

$inputCorreo.addEventListener("input", (event) => {
    validateEmail(event.target);
});

// Agrega un event listener al checkbox para manejar el cambio de estado
$checkbox.addEventListener('change', toggleButtonState);

// Agrega un event listener al formulario para manejar el submit
$formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    try {
        await eliminar();
    } catch (error) {
        console.error('Error al guardar los datos:', error); // Maneja el error
    }
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

// Funciones
const eliminar = async () => {
    // Verifica la validez del formulario
    let ok = validar("#formulario [required]");

    if (!ok) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    // Captura todos los atributos
    const data = {
        id: $inputID.value,
        nombre: $inputNombre.value.toUpperCase(),
        contactoNombre: $inputEncargado.value,
        correo: $inputCorreo.value,
        telefono: $inputTelefono.value,
        userId: $inputID.value
    };

    const dataId = data.id;

    try {
        const resultado = await eliminarDato(proveedores, dataId);
        console.log('Resultado:', resultado);

        if (resultado) {
            // Actualiza la fila en la tabla
            eliminarFilaDeTabla(dataId);

            // Mostrar un alert de éxito
            alert("Proveedor eliminado exitosamente");

            // Limpiar los campos del formulario
            $inputID.value = "";
            $inputNombre.value = "";
            $inputEncargado.value = "";
            $inputCorreo.value = "";
            $inputTelefono.value = "";
        } else {
            alert("Error al eliminar el proveedor.");
        }
    } catch (error) {
        console.error('Error al agregar el dato:', error);
        alert("Ocurrió un error al intentar eliminar el proveedor.");
    }
};


// Función para habilitar o deshabilitar el botón
function toggleButtonState() {
    $Button.disabled = !$checkbox.checked; // Habilita o deshabilita el botón según el estado del checkbox
}


console.log($table, $inputNombre, $inputEncargado, $inputCorreo, $inputTelefono); // 

const seleccionarFila = ($table, inputs) => {
    if (!$table) {
        console.error("La tabla no fue encontrada.");
        return;
    }

    console.log("EventListener añadido a la tabla");

    $table.addEventListener('click', (event) => {
        console.log("Click en la tabla");
        const fila = event.target.closest('tr'); // Obtener la fila clickeada

        if (fila) {
            const celdas = fila.querySelectorAll('td');
            console.log("Fila seleccionada: ", fila);

            if (celdas.length >= 5) { // Asegurarse de que haya suficientes celdas
                inputs[0].value = celdas[0].textContent; // id
                inputs[1].value = celdas[1].textContent; // Nombre
                inputs[2].value = celdas[2].textContent; // ContactoNombre
                inputs[3].value = celdas[3].textContent; // Correo
                inputs[4].value = celdas[4].textContent; // Teléfono
                console.log("Datos transferidos a los inputs");
            } else {
                console.error("La fila no tiene suficientes celdas.");
            }
        } else {
            console.error("No se encontró la fila.");
        }
    });
};

const listar = async () => {
    const fragmento = dom.createDocumentFragment();
    const dataproveedores = await solicitud(proveedores);

    // Crear el tbody
    const tbody = dom.createElement('tbody');

    dataproveedores.forEach((element) => {
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
        celda3.textContent = element.contactoNombre;
        fila.appendChild(celda3);

        const celda4 = dom.createElement('td');
        celda4.textContent = element.correo;
        fila.appendChild(celda4);

        const celda5 = dom.createElement('td');
        celda5.textContent = element.telefono;
        fila.appendChild(celda5);

        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    $table.appendChild(tbody);
};

const eliminarFilaDeTabla = (id) => {
    const filas = document.querySelectorAll('#table > tbody > tr');
    
    filas.forEach((fila) => {
        const celdaID = fila.querySelector('td:first-child');
        if (celdaID && celdaID.textContent === id.toString()) {
            fila.remove();
        }
    });
};