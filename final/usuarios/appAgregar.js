import validar from "../Modulos JS/validarFormularios.js";
import { default as numeros, numerosEdad } from '../Modulos JS/moduloSoloNumeros.js';
import { default as validateTextInput } from '../Modulos JS/moduloSoloLetras.js';
import { default as validateEmail } from '../Modulos JS/correo.js';
import agregarDato from '../Modulos JS/agregar.js';
import solicitud from '../Modulos JS/listar.js';
import { usuario, rol } from "../Modulos JS/config.js";

// id html
const dom = document;
const $inputID = dom.querySelector("#identificacion");
const $inputNombre = dom.querySelector("#nombre");
const $inputApellido = dom.querySelector("#apellido");
const $inputEdad = dom.querySelector("#edad");
const $inputCorreo = dom.querySelector("#correo");
const $inputTelefono = dom.querySelector("#telefono");
const $selectRol = dom.querySelector("#rol");
const $selectEstado = dom.querySelector("#estado");

const $checkbox = document.querySelector('#terminos');
const $Button = document.querySelector('#button');
const $formulario = dom.querySelector('#registroForm');

// Eventos

$inputID.addEventListener("keyup", (event) => {
    numeros(event, event.target);
});
$inputID.addEventListener("keypress", (event) => {
    numeros(event, event.target);
});
$inputNombre.addEventListener("input", (event) => {
    validateTextInput(event.target);
});
$inputApellido.addEventListener("input", (event) => {
    validateTextInput(event.target);
});
$inputEdad.addEventListener("keypress", (event) => {
    numerosEdad(event, event.target);
});
$inputEdad.addEventListener("keyup", (event) => {
    numerosEdad(event, event.target);
});
$inputCorreo.addEventListener("input", (event) => {
    validateEmail(event.target);
});
$inputTelefono.addEventListener("keypress", (event) => {
    numeros(event, event.target);
});
$inputTelefono.addEventListener("keyup", (event) => {
    numeros(event, event.target);
});


// Agrega un event listener al checkbox para manejar el cambio de estado
$checkbox.addEventListener('change', toggleButtonState);

// Agrega un event listener al formulario para manejar el submit
$formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    // Verifica la validez del formulario
    let ok = validar("#registroForm"); // Llama a la función validar
    
    if (!ok) {
        alert("Por favor, complete todos los campos requeridos.");
        return; // Salir de la función si hay campos vacíos
    }

    try {
        await save(); // Llama a la función save para manejar el envío de datos
    } catch (error) {
        console.error('Error al guardar los datos:', error); // Maneja el error
    }
});

// Funciones
const save = async () => {

    // Validar el correo electrónico
    const isEmailValid = validateEmail($inputCorreo);

    if (!isEmailValid) {
        alert('Por favor, corrige los errores en el formulario antes de enviarlo.');
        return; // Si el correo no es válido, no continuar
    }

    // Captura todos los atributos
    const data = {
        id: $inputID.value,
        nombre: $inputNombre.value,
        apellido: $inputApellido.value, 
        edad: $inputEdad.value,
        correo: $inputCorreo.value,
        telefono: $inputTelefono.value,
        rol: $selectRol.value,
        estado: $selectEstado.value
    };

    try {
        // Verificar si el ID ya existe
        const existeID = await verificarID(data.id);

        if (existeID) {
            alert("Usuario ya registrado");
            return; // Salir de la función si el ID ya existe
        }

        // Si el ID no existe, proceder a agregar el dato
        const resultado = await agregarDato(usuario, data); // Asumiendo que agregarDato es la función para enviar los datos
        console.log('Resultado:', resultado); // Maneja el resultado

        // Mostrar un alert de éxito
        alert("Dato agregado exitosamente");

        // Limpiar los campos del formulario
        $inputID.value = "";
        $inputNombre.value = "";
        $inputApellido.value = "";
        $inputEdad.value = "";
        $inputCorreo.value = "";
        $inputTelefono.value = "";
        $selectRol.selectedIndex = 0; // Resetea el select rol
        $selectEstado.selectedIndex = 0; // Resetea el select estado
        $checkbox.checked = false;

        // Agregar la nueva fila a la tabla
        agregarFila(data); // Actualiza la tabla con el nuevo dato

    } catch (error) {
        console.error('Error al agregar el dato:', error);
    }
};


//Seleccion de opcion
document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
        if (select.value.trim() === "") {
            // Si no hay opción seleccionada, poner borde rojo
            select.style.border = '2px solid red';
        } else {
            // Si hay una opción seleccionada, poner borde verde
            select.style.border = '2px solid green';
        }
    });
});

// Función para verificar si el ID ya existe
const verificarID = async (id) => {
    try {
        // Realizar la solicitud para obtener todos los datos
        const respuesta = await solicitud(usuario);
        
        // Verificar si la respuesta es un array de objetos
        if (Array.isArray(respuesta)) {
            // Usar filter para encontrar si existe algún ID igual
            const idExiste = respuesta.filter(item => item.id == id).length > 0;
            return idExiste;
        } else {
            console.error("Error en la verificación del ID: La respuesta no es un array.");
            return false;
        }
    } catch (error) {
        console.error("Error al verificar el ID:", error);
        return false;
    }
};

// Función para habilitar o deshabilitar el botón
function toggleButtonState() {
    $Button.disabled = !$checkbox.checked; // Habilita o deshabilita el botón según el estado del checkbox
}

const agregarFila = async (data) => {
    const datarol = await solicitud(rol);
    // Crear una nueva fila
    const fila = dom.createElement('tr');
    

    // Crear y agregar las celdas con los datos
    const celda1 = dom.createElement('td');
    celda1.textContent = data.id; // Añadido el ID
    fila.appendChild(celda1);

    const celda2 = dom.createElement('td');
    celda2.textContent = data.nombre;
    fila.appendChild(celda2);

    const celda3 = dom.createElement('td');
    celda3.textContent = data.apellido; // Actualizado para usar apellido
    fila.appendChild(celda3);

    const celda4 = dom.createElement('td');
    celda4.textContent = data.edad; // Añadido el campo edad
    fila.appendChild(celda4);

    const celda5 = dom.createElement('td');
    celda5.textContent = data.correo;
    fila.appendChild(celda5);

    const celda6 = dom.createElement('td');
    celda6.textContent = data.telefono;
    fila.appendChild(celda6);

    const celda7 = dom.createElement('td');
    const roll = datarol.find(r => r.id === data.rol);
    celda7.textContent = roll ? roll.name  : "Sin Rol"; // Añadido el rol
    fila.appendChild(celda7);

    const celda8 = dom.createElement('td');
    celda8.textContent = data.estado; // Añadido el estado
    fila.appendChild(celda8);

    // Agregar la fila al tbody
    const tbody = dom.querySelector('tbody');
    if (tbody) {
        tbody.appendChild(fila);
    } else {
        console.error("No se encontró el tbody en la tabla.");
    }
};

const listarOpciones = async () => {
    try {
        // Crear un fragmento de documento
        const fragmento = document.createDocumentFragment(); // Usa 'document' si 'dom' no es necesario

        // Realizar la solicitud para obtener los datos del rol
        const datarol = await solicitud(rol);

        console.log(datarol);

        // Verificar si se obtuvieron datos
        if (Array.isArray(datarol)) {
            datarol.forEach((element) => {
                // Crear y agregar las opciones con los datos
                const opcion = document.createElement('option'); // Usa 'document' si 'dom' no es necesario
                opcion.textContent = element.name.toUpperCase();
                opcion.value = element.id;

                // Agregar la opción al fragmento
                fragmento.appendChild(opcion);
            });

            // Agregar el fragmento al select
            $selectRol.appendChild(fragmento);
        } else {
            console.error('Los datos obtenidos no son una lista:', datarol);
        }
    } catch (error) {
        console.error('Error al listar opciones:', error);
    }
};

listarOpciones();