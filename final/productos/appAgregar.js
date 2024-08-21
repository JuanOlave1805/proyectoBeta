import { producto, categorias, proveedores } from "../Modulos JS/config.js"; 
import solicitud from "../Modulos JS/listar.js";
import agregarDato from "../Modulos JS/agregar.js";
import validar from "../Modulos JS/validarFormularios.js";
import { numerosValores, numerosStock } from "../Modulos JS/moduloSoloNumeros.js";
// import validateTextInput from "../Modulos JS/moduloSoloLetras.js";


const dom = document;
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
        celda1.textContent = element.nombre;
        fila.appendChild(celda1);

        const celda2 = dom.createElement('td');
        celda2.textContent = element.precioVenta;
        fila.appendChild(celda2);

        const celda3 = dom.createElement('td');
        celda3.textContent = element.precioCompra;
        fila.appendChild(celda3);

        const celda4 = dom.createElement('td');
        celda4.textContent = element.stock;
        fila.appendChild(celda4);

        const celda5 = dom.createElement('td');
        const categoria = dataCategorias.find(c => c.id === element.categoria);
        celda5.textContent = categoria ? categoria.nombre : "Sin categoría";
        fila.appendChild(celda5);

        const celda6 = dom.createElement('td');
        const proveedor = dataProveedores.find(p => p.id === element.proveedor);
        celda6.textContent = proveedor ? proveedor.nombre : "Sin proveedor";
        fila.appendChild(celda6);

        console.log(proveedor);
        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    // Agregar el tbody a la tabla
    $tabla.appendChild(tbody);
};

const save = async () => {
    // Verifica la validez del formulario
    let ok = validar("#registroForm");

    // Captura todos los atributos
    const data = {
        nombre: $inputNombre.value.toUpperCase(),
        precioVenta: $precioVenta.value,
        precioCompra: $precioCompra.value,
        stock: $stock.value,
        categoria: $selectCategoria.value,
        proveedor: $selectProveedor.value
    };

    if (ok) {
        try {
            // Verificar si el producto ya existe por nombre
            const existeProducto = await verificarProductoPorNombre(data.nombre);

            if (existeProducto) {
                alert("Producto ya registrado");
                return; // Salir de la función si el producto ya existe
            }

            // Si el producto no existe, proceder a agregar el dato
            const resultado = await agregarDato(producto, data);
            console.log('Resultado:', resultado); // Maneja el resultado

            // Mostrar un alert de éxito
            alert("Producto agregado exitosamente");

            // Limpiar los campos del formulario
            $inputNombre.value = "";
            $precioVenta.value = "";
            $precioCompra.value = "";
            $stock.value = "";
            $selectCategoria.selectedIndex = 0; 
            $selectProveedor.selectedIndex = 0;
            $checkbox.checked = false;

            // Agregar la nueva fila a la tabla
            agregarFila(data);

        } catch (error) {
            console.error('Error al agregar el dato:', error);
        }
    }
};

const agregarFila = (data) => {
    // Crear una nueva fila
    const fila = document.createElement('tr');

    // Crear y agregar las celdas con los datos
    const celda1 = document.createElement('td');
    celda1.textContent = data.nombre; 
    fila.appendChild(celda1);

    const celda2 = document.createElement('td');
    celda2.textContent = data.precioVenta; 
    fila.appendChild(celda2);

    const celda3 = document.createElement('td');
    celda3.textContent = data.precioCompra; 
    fila.appendChild(celda3);

    const celda4 = document.createElement('td');
    celda4.textContent = data.stock; 
    fila.appendChild(celda4);

    const celda5 = document.createElement('td');
    celda5.textContent = $selectCategoria.querySelector(`option[value="${data.categoria}"]`).textContent; 
    fila.appendChild(celda5);

    const celda6 = document.createElement('td');
    celda6.textContent = $selectProveedor.querySelector(`option[value="${data.proveedor}"]`).textContent; 
    fila.appendChild(celda6);

    // Agregar la fila al tbody
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.appendChild(fila);
    } else {
        console.error("No se encontró el tbody en la tabla.");
    }
};

const verificarProductoPorNombre = async (nombre) => {
    try {
        // Realizar la solicitud para obtener todos los datos
        const respuesta = await solicitud(producto);

        if (Array.isArray(respuesta)) {
            const idExiste = respuesta.filter(item => item.nombre === nombre).length > 0;
            return idExiste;
        } else {
            console.error("Error en la verificación del nombre: La respuesta no es un array.");
            return false;
        }
    } catch (error) {
        console.error("Error al verificar el nombre:", error);
        return false;
    }
};