import { producto, categorias, proveedores } from "../Modulos JS/config.js"; 
import solicitud from "../Modulos JS/listar.js";
import actualizarDato from "../Modulos JS/actualizar.js";
import validar from "../Modulos JS/validarFormularios.js";
import { numerosValores, numerosStock } from "../Modulos JS/moduloSoloNumeros.js";


const dom = document;
const $inputID = dom.querySelector('#id')
const $inputNombre = dom.querySelector("#nombre");

const $precioVenta = dom.querySelector("#precioVenta");
const $precioCompra = dom.querySelector("#precioCompra");
const $stock = dom.querySelector("#stock")
const $selectCategoria = dom.querySelector("#categoria");
const $selectProveedor = dom.querySelector("#proveedor");

const $checkbox = document.querySelector('#terminos');
const $Button = document.querySelector('#button');
const $formulario = dom.querySelector('#registroForm');
const $tabla = dom.querySelector("#table");

// $inputNombre.addEventListener("input", (event) => {
//     validateTextInput(event.target);
// });
$precioCompra.addEventListener("keypress", (event) => {
    numerosValores(event, event.target);
});
$precioVenta.addEventListener("keypress", (event) => {
    numerosValores(event, event.target);
});
$stock.addEventListener("keyup", (event) => {
    numerosStock(event, event.target);
});
$stock.addEventListener("keypress", (event) => {
    numerosStock(event, event.target);
});

// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion(); // Llama a la función para validar sesión
    listar(); // Llama a la función para listar datos

    // Define los inputs en función de las constantes ya capturadas
    const inputs = [
        $inputID,
        $inputNombre,
        $precioVenta,
        $precioCompra,
        $stock,
        $selectCategoria,
        $selectProveedor
    ];

    // Asegúrate de que $tabla esté definido
    if ($tabla) {
        seleccionarFila($tabla, inputs);
    } else {
        console.error("La tabla no fue encontrada.");
    }
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
        window.location.href = "../../index.html";
    } else {
        // Si hay sesión activa, convertir el string almacenado a un objeto
        const usuario = JSON.parse(usuarioActivo);
        console.log(usuario.id);
    }
};

// Función para habilitar o deshabilitar el botón
function toggleButtonState() {
    $Button.disabled = !$checkbox.checked; // Habilita o deshabilita el botón según el estado del checkbox
}

const listar = async () => {
    const fragmento = dom.createDocumentFragment();
    const dataProductos = await solicitud(producto);
    const dataCategorias = await solicitud(categorias);
    const dataProveedores = await solicitud(proveedores);

    console.log(dataProductos);

    // Llenar el select de categorías
    dataCategorias.forEach(categoria => {
        const option = dom.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        $selectCategoria.appendChild(option);
    });

    // Llenar el select de proveedores
    dataProveedores.forEach(proveedor => {
        const option = dom.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        $selectProveedor.appendChild(option);
    });

    // Crear el tbody
    const tbody = dom.createElement('tbody');

    dataProductos.forEach((element) => {
        // Crear una nueva fila
        const fila = dom.createElement('tr');

        const celda1 = dom.createElement('td');
        celda1.textContent = element.id;
        fila.appendChild(celda1);

        const celda2 = dom.createElement('td');
        celda2.textContent = element.nombre;
        fila.appendChild(celda2);

        const celda3 = dom.createElement('td');
        celda3.textContent = element.precioVenta;
        fila.appendChild(celda3);

        const celda4 = dom.createElement('td');
        celda4.textContent = element.precioCompra;
        fila.appendChild(celda4);

        const celda5 = dom.createElement('td');
        celda5.textContent = element.stock;
        fila.appendChild(celda5);

        const celda6 = dom.createElement('td');
        const categoria = dataCategorias.find(c => c.id === element.categoria);
        celda6.textContent = categoria ? categoria.nombre : "Sin categoría";
        fila.appendChild(celda6);

        const celda7 = dom.createElement('td');
        const proveedor = dataProveedores.find(p => p.id === element.proveedor);
        celda7.textContent = proveedor ? proveedor.nombre : "Sin proveedor";
        fila.appendChild(celda7);

        console.log(proveedor);
        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    // Agregar el tbody a la tabla
    $tabla.appendChild(tbody);
};

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

            if (celdas.length >= 6) { // Asegurarse de que haya suficientes celdas
                // Rellena los valores de los inputs
                inputs[0].value = celdas[0].textContent.trim(); // $inputID
                inputs[1].value = celdas[1].textContent.trim(); // $inputNombre
                inputs[2].value = celdas[2].textContent.trim(); // $precioVenta
                inputs[3].value = celdas[3].textContent.trim(); // $precioCompra
                inputs[4].value = celdas[4].textContent.trim(); // $stock

                // Establece la opción seleccionada en los select
                const selectCategoria = inputs[5];
                const selectProveedor = inputs[6];

                const seleccionarOpcion = (select, valor) => {
                    let encontrado = false;
                    for (let i = 0; i < select.options.length; i++) {
                        const opcionSelect = select.options[i];
                        if (opcionSelect.text === valor.trim()) {
                            select.selectedIndex = i;
                            encontrado = true;
                            break;
                        }
                    }
                    if (!encontrado) {
                        console.error(`Opción "${valor}" no encontrada en el select.`);
                    }
                };

                // Selecciona las opciones en los selects
                seleccionarOpcion(selectCategoria, celdas[5].textContent); // Asumiendo que la categoría está en la celda 5
                seleccionarOpcion(selectProveedor, celdas[6].textContent); // Asumiendo que el proveedor está en la celda 6

                console.log("Datos transferidos a los inputs");
            } else {
                console.error("La fila no tiene suficientes celdas.");
            }
        } else {
            console.error("No se encontró la fila.");
        }
    });
};


const actualizar = async () => {
    const ok = validar("#registroForm");

    if (!ok) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    const data = {
        id: $inputID.value.trim(),
        nombre: $inputNombre.value.trim().toUpperCase(),
        precioVenta: $precioVenta.value.trim(),
        precioCompra: $precioCompra.value.trim(),
        stock: $stock.value.trim(),
        categoria: $selectCategoria.value,
        proveedor: $selectProveedor.value
    };

    try {
        const resultado = await actualizarDato(producto, data);
        const dataCategorias = await solicitud(categorias);
        const dataProveedores = await solicitud(proveedores);

        // Asegúrate de que dataCategorias y dataProveedores sean arrays
        if (!Array.isArray(dataCategorias)) {
            throw new Error('La respuesta de categorías no es un array.');
        }
        if (!Array.isArray(dataProveedores)) {
            throw new Error('La respuesta de proveedores no es un array.');
        }

        if (resultado) {
            actualizarFilaEnTabla(data, dataCategorias, dataProveedores);
            alert("Producto actualizado exitosamente");

            // Limpiar los campos
            $inputID.value = "";
            $inputNombre.value = "";
            $precioVenta.value = "";
            $precioCompra.value = "";
            $stock.value = "";
            $selectCategoria.selectedIndex = 0;
            $selectProveedor.selectedIndex = 0;
            $checkbox.checked = false;
        } else {
            alert("Error al actualizar el producto.");
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert("Ocurrió un error al intentar actualizar el producto.");
    }
};

const actualizarFilaEnTabla = (data, dataCategorias, dataProveedores) => {
    const filas = document.querySelectorAll('#table > tbody > tr');
    let filaEncontrada = null;

    filas.forEach((fila) => {
        const celdaID = fila.querySelector('td:first-child');
        if (celdaID && celdaID.textContent.trim() === data.id) {
            filaEncontrada = fila;
        }
    });

    if (filaEncontrada) {
        const celdas = filaEncontrada.querySelectorAll('td');
        celdas[1].textContent = data.nombre;
        celdas[2].textContent = data.precioVenta;
        celdas[3].textContent = data.precioCompra;
        celdas[4].textContent = data.stock;

        // Encontrar categoría y proveedor
        const categoria = dataCategorias.find(c => c.id == data.categoria);
        const proveedor = dataProveedores.find(p => p.id == data.proveedor);

        // Asegurarse de que las celdas para categoría y proveedor existan
        if (celdas[5]) {
            celdas[5].textContent = categoria ? categoria.nombre : "Sin categoría";
        }
        if (celdas[6]) {
            celdas[6].textContent = proveedor ? proveedor.nombre : "Sin proveedor";
        }
    } else {
        console.error('No se encontró la fila para el ID proporcionado');
    }
};
