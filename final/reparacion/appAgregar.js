import  solicitud  from "../Modulos JS/listar.js";
import { categorias, producto, proveedores, detallePedidos, pedidos } from "../Modulos JS/config.js";
import { default as numeros, numerosEdad, numerosValores } from "../Modulos JS/moduloSoloNumeros.js";
import agregarDato from "../Modulos JS/agregar.js";
import actualizarDato from "../Modulos JS/actualizar.js";

const dom = document;
const $table = dom.querySelector("#table");
const $selectCategoria = dom.querySelector("#categoria")
const $fragmento = document.createDocumentFragment();
const $tbody = document.querySelector("#tbody");
const $inputID = document.querySelector("#textProducto");
const $inputNombre = document.querySelector("#textNombre");
const $table2 = document.querySelector("#table2");
const $tbody2 = document.querySelector("#tbody2");
const $cantidad = document.querySelector("#textCantidad");
const $btnAgregarProducto = document.querySelector("#btnAgregarProducto");
const $btnRemoverProducto = document.querySelector("#btnRemoverProducto");
const $btnConfirmar = document.querySelector("#btnConfirmar");
const $textIdCliente = document.querySelector("#textidCliente");
const $textDescripcion = document.querySelector("#textDescripcion");
const $manoObra = document.querySelector("#textManoObra");

// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion();
    seleccionarFila($table, [$inputID, $inputNombre]);
    seleccionarFila($table2, [$inputID, $inputNombre]);
    listar();
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});

$selectCategoria.addEventListener('click', function() {
    let capturado = $selectCategoria.value;
    console.log(capturado);
    cargarProductos(capturado);
})

$cantidad.addEventListener("keyup", (event) => {
    numerosEdad(event, event.target);
});
$cantidad.addEventListener("keypress", (event) => {
    numerosEdad(event, event.target);
});

$textIdCliente.addEventListener("keyup", (event) => {
    numeros(event, event.target);
});
$textIdCliente.addEventListener("keypress", (event) => {
    numeros(event, event.target);
});

$manoObra.addEventListener("keyup", (event) => {
    numerosValores(event, event.target);
});
$manoObra.addEventListener("keypress", (event) => {
    numerosValores(event, event.target);
});

$btnAgregarProducto.addEventListener('click', function() {
    const productoBuscado = $inputID.value.trim();
    const cantidadDeseada = $cantidad.value.trim();

    if (cantidadDeseada === '' || isNaN(cantidadDeseada) || parseInt(cantidadDeseada) <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
    } else {
        agregarProducto(productoBuscado, cantidadDeseada);
    }
});

$btnConfirmar.addEventListener('click', function() {
    confirmarCompra();
})

$btnRemoverProducto.addEventListener('click', function() {
    const productoBuscado = $inputID.value.trim();
    removerProducto(productoBuscado);
})

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


const listar = async () => {
    try {
        // Crear un fragmento de documento
        const fragmento = document.createDocumentFragment(); // Usa 'document' si 'dom' no es necesario

        // Realizar la solicitud para obtener los datos del rol
        const dataCategoria = await solicitud(categorias);

        console.log(dataCategoria);

        // Verificar si se obtuvieron datos
        if (Array.isArray(dataCategoria)) {
            dataCategoria.forEach((element) => {
                // Crear y agregar las opciones con los datos
                const opcion = document.createElement('option'); // Usa 'document' si 'dom' no es necesario
                opcion.textContent = element.nombre;
                opcion.value = element.id;

                // Agregar la opción al fragmento
                fragmento.appendChild(opcion);
            });

            // Agregar el fragmento al select
            $selectCategoria.appendChild(fragmento);
        } else {
            console.error('Los datos obtenidos no son una lista:', dataCategoria);
        }
    } catch (error) {
        console.error('Error al listar opciones:', error);
    }
};


const cargarProductos = async (categoria) => {
    // Realizar la solicitud para obtener los datos del rol
    const dataProductos = await solicitud(producto);
    const dataCategorias = await solicitud(categorias);
    const dataProveedores = await solicitud(proveedores);
    $tbody.innerHTML="";

    dataProductos.forEach((element) => {
        if( element.categoria == categoria ){
            console.log(element);
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

        // console.log(proveedor);
        // Agregar la fila al fragmento
        $fragmento.appendChild(fila);
        }
    })
    $tbody.appendChild($fragmento)

    $table.appendChild($tbody)
}
console.log($table2, [$inputID, $inputNombre])
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
                console.log("Datos transferidos a los inputs");
            } else {
                console.error("La fila no tiene suficientes celdas.");
            }
        } else {
            console.error("No se encontró la fila.");
        }
    });
};

const agregarProducto = async (idProducto, cantidad) => {
    // Realizar la solicitud para obtener los datos de productos, categorías y proveedores
    const dataProductos = await solicitud(producto);
    const dataCategorias = await solicitud(categorias);
    const dataProveedores = await solicitud(proveedores);

    // Buscar el producto en la lista de productos
    const productoEncontrado = dataProductos.find(element => element.id == idProducto);

    if (productoEncontrado) {
        console.log(productoEncontrado);

        // Calcular valores relacionados al IVA
        const precioUnidad = parseFloat(productoEncontrado.precioVenta);
        const cantidadNum = parseInt(cantidad);
        const totalSinIva = precioUnidad * cantidadNum;
        const porcentajeIva = 19; // 19% IVA
        const valorIva = totalSinIva * (porcentajeIva / 100);
        const totalConIva = totalSinIva + valorIva;

        // Verificar si el producto ya está en la tabla
        let productoEnTabla = false;
        const filas = $tbody2.querySelectorAll('tr');

        filas.forEach(fila => {
            const celdaID = fila.querySelector('td:first-child'); // Obtiene la primera celda (ID)
            if (celdaID && celdaID.textContent == idProducto) {
                // Producto encontrado en la tabla, sumar la cantidad
                const celdaCantidad = fila.querySelector('td:nth-child(4)'); // Obtiene la celda de cantidad
                const nuevaCantidad = parseInt(celdaCantidad.textContent) + cantidadNum;
                celdaCantidad.textContent = nuevaCantidad;

                // Recalcular valores relacionados al IVA
                const nuevaTotalSinIva = precioUnidad * nuevaCantidad;
                const nuevaValorIva = nuevaTotalSinIva * (porcentajeIva / 100);
                const nuevaTotalConIva = nuevaTotalSinIva + nuevaValorIva;

                // Actualizar las celdas correspondientes
                fila.querySelector('td:nth-child(8)').textContent = nuevaTotalSinIva.toFixed(2);
                fila.querySelector('td:nth-child(9)').textContent = nuevaValorIva.toFixed(2);
                fila.querySelector('td:nth-child(10)').textContent = nuevaTotalConIva.toFixed(2);

                productoEnTabla = true;
            }
        });

        // Si el producto no está en la tabla, agregar una nueva fila
        if (!productoEnTabla) {
            // Crear un fragmento de documento
            const fragmento = document.createDocumentFragment();

            // Crear la nueva fila
            const fila = document.createElement('tr');

            // Crear celdas y asignar valores
            const celda1 = document.createElement('td');
            celda1.textContent = productoEncontrado.id;
            fila.appendChild(celda1);

            const celda2 = document.createElement('td');
            celda2.textContent = productoEncontrado.nombre;
            fila.appendChild(celda2);

            const celda3 = document.createElement('td');
            celda3.textContent = precioUnidad.toFixed(2);
            fila.appendChild(celda3);

            const celda4 = document.createElement('td');
            celda4.textContent = cantidad;
            fila.appendChild(celda4);

            const celda5 = document.createElement('td');
            const categoria = dataCategorias.find(c => c.id === productoEncontrado.categoria);
            celda5.textContent = categoria ? categoria.nombre : "Sin categoría";
            fila.appendChild(celda5);

            const celda6 = document.createElement('td');
            const proveedor = dataProveedores.find(p => p.id === productoEncontrado.proveedor);
            celda6.textContent = proveedor ? proveedor.nombre : "Sin proveedor";
            fila.appendChild(celda6);

            const celda7 = document.createElement('td');
            celda7.textContent = `${porcentajeIva}%`;
            fila.appendChild(celda7);

            const celda8 = document.createElement('td');
            celda8.textContent = totalSinIva.toFixed(2);
            fila.appendChild(celda8);

            const celda9 = document.createElement('td');
            celda9.textContent = valorIva.toFixed(2);
            fila.appendChild(celda9);

            const celda10 = document.createElement('td');
            celda10.textContent = totalConIva.toFixed(2);
            fila.appendChild(celda10);

            // Agregar la fila al fragmento
            fragmento.appendChild(fila);

            // Finalmente, agregar el fragmento al tbody
            $tbody2.appendChild(fragmento);
        }

        // Limpiar los inputs
        $cantidad.value = "";
        $inputID.value = "";
        $inputNombre.value = "";
    } else {
        alert("Producto no encontrado.");
    }
}

const removerProducto = (idProducto) => {
    // Obtener todas las filas de la tabla
    const filas = $tbody2.querySelectorAll('tr');

    let productoEliminado = false;

    // Iterar sobre las filas para encontrar el producto
    filas.forEach(fila => {
        const celdaID = fila.querySelector('td:first-child'); // Obtener la primera celda (ID)
        if (celdaID && celdaID.textContent == idProducto) {
            // Producto encontrado, eliminar la fila
            fila.remove();
            productoEliminado = true;
        }
    });

    // Verificar si se eliminó algún producto
    if (productoEliminado) {
        alert(`Producto con ID ${idProducto} eliminado de la tabla.`);
    } else {
        alert(`Producto con ID ${idProducto} no encontrado en la tabla.`);
    }
};

const confirmarCompra = async () => {
    // Validar la longitud del ID de cliente
    const idCliente = $textIdCliente.value.trim();
    if (idCliente.length <= 6) {
        alert("El ID del cliente debe tener más de 6 caracteres.");
        return; // Salir de la función si la validación falla
    }

     // Obtener el idUsuario del localStorage
     const usuarioActivo = localStorage.getItem("usuarioActivo");
     const usuario = JSON.parse(usuarioActivo);
     const idUsuario = usuario ? usuario.id : null;
 
     if (!idUsuario) {
         alert("No se pudo obtener el ID del usuario.");
         return; // Salir de la función si no se pudo obtener el idUsuario
     }

    // Realizar la solicitud para obtener los datos de productos
    const dataProductos = await solicitud(producto);

    // Variable para controlar si la compra es válida
    let compraValida = true;

    // Obtener todas las filas de la tabla
    const filas = $tbody2.querySelectorAll('tr');

    // Recorrer cada fila para verificar la cantidad
    filas.forEach(fila => {
        const celdaID = fila.querySelector('td:first-child'); // ID del producto
        const idProducto = celdaID.textContent;

        const celdaCantidad = fila.querySelector('td:nth-child(4)'); // Cantidad solicitada
        let cantidadSolicitada = parseInt(celdaCantidad.textContent);

        // Buscar el producto en la lista de productos para obtener el stock
        const productoEncontrado = dataProductos.find(element => element.id == idProducto);

        if (productoEncontrado) {
            const stockDisponible = parseInt(productoEncontrado.stock);

            // Validar si la cantidad solicitada es mayor al stock disponible
            if (cantidadSolicitada > stockDisponible) {
                alert(`La cantidad solicitada para el producto ${productoEncontrado.nombre} excede el stock disponible (${stockDisponible}). Modificando la cantidad en la tabla.`);
                
                // Modificar la cantidad en la tabla por el stock disponible
                celdaCantidad.textContent = stockDisponible;

                // Recalcular los valores relacionados al IVA
                const precioUnidad = parseFloat(fila.querySelector('td:nth-child(3)').textContent);
                const totalSinIva = precioUnidad * stockDisponible;
                const porcentajeIva = 19; // 19% IVA
                const valorIva = totalSinIva * (porcentajeIva / 100);
                const totalConIva = totalSinIva + valorIva;

                // Actualizar las celdas correspondientes
                fila.querySelector('td:nth-child(8)').textContent = totalSinIva.toFixed(2);
                fila.querySelector('td:nth-child(9)').textContent = valorIva.toFixed(2);
                fila.querySelector('td:nth-child(10)').textContent = totalConIva.toFixed(2);

                // Cambiar la compra a inválida, ya que la cantidad fue ajustada
                compraValida = false;
            }
        }
    });

    // Si la compra es válida (no se excedió el stock), proceder con la confirmación
    if (compraValida) {

        // Obtener fecha de hoy
        const fechaHoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // Calcular el total de la columna "Total con IVA"
        let totalPedido = 0;
        const filasActualizadas = $tbody2.querySelectorAll('tr');
        filasActualizadas.forEach(fila => {
            const totalConIva = parseFloat(fila.querySelector('td:nth-child(10)').textContent);
            totalPedido += totalConIva;
        });

        let valueDescripcion = $textDescripcion.value;
        let valueManoObra = $manoObra.value;
        // Crear el objeto pedido
        const pedido = {
            idCliente: idCliente,
            idUsuario: idUsuario,
            fechaPedido: fechaHoy,
            total: totalPedido.toFixed(2),
            tipoPedido: "Reparacion",
            manoObra: valueManoObra,
            fechaEntregaPedido: null,
            descripcion: valueDescripcion
        };

        // Agregar el pedido a la base de datos o sistema de pedidos
        agregarDato(pedidos, pedido);

        // Mostrar un alert de éxito
        alert('Compra realizada');

        // Actualizar el stock de los productos
        async function obtenerUltimoPedido() {
            try {
                // Realiza la solicitud para obtener todos los pedidos
                const pedidosObtenidos = await solicitud(pedidos); // `pedidosCollection` es la colección o tabla de pedidos
                console.log(pedidosObtenidos);
                
                if (pedidosObtenidos && pedidosObtenidos.length > 0) {
                    // Suponiendo que los pedidos están ordenados de manera ascendente por ID
                    // Devuelve el pedido con el ID más alto, que es el último pedido
                    return pedidosObtenidos.reduce((max, pedido) => (pedido.id > max.id ? pedido : max), pedidosObtenidos[0]);
                } else {
                    return null; // No hay pedidos en la base de datos
                }
            } catch (error) {
                console.error('Error al obtener el último pedido:', error);
                return null;
            }
        }
        
        // Actualizar el stock de los productos y crear objetos de detalles de pedido
        filasActualizadas.forEach(async fila => {
            const idProducto = fila.querySelector('td:first-child').textContent;
            const cantidadSolicitada = parseInt(fila.querySelector('td:nth-child(4)').textContent);
        
            // Encontrar el producto en la lista de productos obtenidos
            const productoEncontrado = dataProductos.find(element => element.id == idProducto);
        
            if (productoEncontrado) {
                // Crear un objeto con los datos del producto actualizados
                const productoActualizado = {
                    ...productoEncontrado, // Copiar todos los datos del producto existente
                    stock: productoEncontrado.stock - cantidadSolicitada // Actualizar el stock
                };
        
                // Actualizar el producto en la base de datos
                await actualizarDato(producto, productoActualizado);
        
                // Calcular precios y valores relacionados al IVA
                const precioSinIva = parseFloat(fila.querySelector('td:nth-child(8)').textContent);
                const precioIva = parseFloat(fila.querySelector('td:nth-child(9)').textContent);
                const precioConIva = parseFloat(fila.querySelector('td:nth-child(10)').textContent);
                const porcentajeIva = 19; // 19% IVA (puede ajustarse según sea necesario)
        
                // Obtener el id del último pedido
                const ultimoPedido = await obtenerUltimoPedido(); 
                const idPedido = ultimoPedido ? ultimoPedido.id : 1; // Incrementar el ID del pedido, o iniciar en 1 si no hay pedidos previos
        
                // Crear un objeto con los datos del detalle del pedido
                const detallePedido = {
                    idPedido: idPedido,
                    idProducto: idProducto,
                    cantidad: cantidadSolicitada,
                    precioSinIva: precioSinIva,
                    precioConIva: precioConIva,
                    precioIva: precioIva,
                    porcentajeIva: porcentajeIva
                };
        
                // Guardar el detalle del pedido en la base de datos o en la colección adecuada
                await agregarDato(detallePedidos, detallePedido); // `detallesPedido` representa donde almacenas los detalles de cada pedido
                window.location.href = "reparacionAdmin.html";
            }
        });
    } else {
        // La compra fue ajustada, no confirmar aún. Esperar a que el usuario revise los ajustes.
        alert('Por favor, revise las cantidades ajustadas en la tabla y vuelva a confirmar la compra.');
    }
};

