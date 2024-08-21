import { categorias } from "../../Modulos JS/config.js"; 
import solicitud from "../../Modulos JS/listar.js";
import validar from "../../Modulos JS/validarFormularios.js";
import actualizarDato from "../../Modulos JS/actualizar.js";
import {default as validateTextInput} from "../../Modulos JS/moduloSoloLetras.js";

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
    seleccionarFila($table, [$inputID, $inputNombre]);
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});

$inputNombre.addEventListener("input", (event) => {
    validateTextInput(event.target);
});

// Agrega un event listener al checkbox para manejar el cambio de estado
$checkbox.addEventListener('change', toggleButtonState);

// Agrega un event listener al formulario para manejar el submit
$formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    try {
        await actualizar();
    } catch (error) {
        console.error('Error al guardar los datos:', error); // Maneja el error
    }
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
        celda1.textContent = element.id;
        fila.appendChild(celda1);

        const celda2 = dom.createElement('td');
        celda2.textContent = element.nombre;
        fila.appendChild(celda2);

        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    tabla.appendChild(tbody);
};

const actualizar = async () => {
    // Verifica la validez del formulario
    let ok = validar("#registroForm");

    if (!ok) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    // Captura todos los atributos
    const data = {
        id: $inputID.value,
        nombre: $inputNombre.value.toUpperCase()
    };

    try {
        const resultado = await actualizarDato(categorias, data);
        console.log('Resultado:', resultado);

        if (resultado) {
            // Actualiza la fila en la tabla
            actualizarFilaEnTabla(data);

            // Mostrar un alert de éxito
            alert("Categoria actualizada exitosamente");

            // Limpiar los campos del formulario
            $inputID.value = "";
            $inputNombre.value = "";
            $checkbox.checked = false;
        } else {
            alert("Error al actualizar el proveedor.");
        }
    } catch (error) {
        console.error('Error al agregar el dato:', error);
        alert("Ocurrió un error al intentar actualizar el proveedor.");
    }
};


// Función para habilitar o deshabilitar el botón
function toggleButtonState() {
    $Button.disabled = !$checkbox.checked; // Habilita o deshabilita el botón según el estado del checkbox
}


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

            if (celdas.length >= 2) { // Asegurarse de que haya suficientes celdas
                inputs[0].value = celdas[0].textContent; // id
                inputs[1].value = celdas[1].textContent; // Nombre
                console.log("Datos transferidos a los inputs");
            } else {
                console.error("La fila no tiene suficientes celdas.");
            }
        } else {
            console.error("No se encontró la fila.");
        }
    });
};

const actualizarFilaEnTabla = (data) => {
    // Busca la fila correspondiente en la tabla usando el ID
    const filas = document.querySelectorAll('#table > tbody > tr');
    console.log(filas)
    let filaEncontrada = null;

    filas.forEach((fila) => {
        const celdaID = fila.querySelector('td:first-child'); // Suponiendo que la primera celda contiene el ID
        if (celdaID && celdaID.textContent == data.id) {
            filaEncontrada = fila;
        }
    });

    // Si la fila se encuentra, actualiza sus celdas
    if (filaEncontrada) {
        const celdas = filaEncontrada.querySelectorAll('td');
        celdas[1].textContent = data.nombre;
    } else {
        console.error('No se encontró la fila para el ID proporcionado');
    }
};

