import { producto, categorias, proveedores } from "../Modulos JS/config.js"; 
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
    const dataProductos = await solicitud(producto);
    const dataCategorias = await solicitud(categorias);
    const dataProveedores = await solicitud(proveedores);

    // Crear el tbody
    const tbody = dom.createElement('tbody');

    dataProductos.forEach((element) => {
        // Crear una nueva fila
        const fila = dom.createElement('tr');

        // Crear y agregar las celdas con los datos

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

        console.log(proveedor)
        // Agregar la fila al fragmento
        fragmento.appendChild(fila);
    });

    // Agregar el fragmento al tbody
    tbody.appendChild(fragmento);

    tabla.appendChild(tbody);
};

