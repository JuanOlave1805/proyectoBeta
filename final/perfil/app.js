
// dom
const dom = document;
const $inputID = dom.querySelector("#identificacion");
const $inputNombre = dom.querySelector("#nombre");
const $inputApellido = dom.querySelector("#apellido");
const $inputEdad = dom.querySelector("#edad");
const $inputCorreo = dom.querySelector("#correo");
const $inputTelefono = dom.querySelector("#telefono");


// Eventos
document.addEventListener("DOMContentLoaded", function() {
    validarSesion();
    listar();
});

document.getElementById('menuIcon').addEventListener('click', function() {
    const botonera = document.getElementById('botonera');
    botonera.classList.toggle('active');
});

document.getElementById('cerrar').addEventListener('click', function() {
    cerrarSesion();
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
const cerrarSesion = () => {
    // Eliminar el usuario activo del localStorage
    localStorage.removeItem("usuarioActivo");

    // Redirigir al login
    window.location.href = "../../index.html";
};

const listar = () => {
    // Obtener el usuario almacenado en localStorage
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const usuario = JSON.parse(usuarioActivo);

    if (!usuarioActivo) {
        console.error("No se encontró ningún usuario en localStorage.");
        return;
    }

    // Asignar los valores del usuario guardado a los inputs
    $inputID.value = usuario.id;
    $inputNombre.value = usuario.nombre;
    $inputApellido.value = usuario.apellido;
    $inputEdad.value = usuario.edad;
    $inputCorreo.value = usuario.correo;
    $inputTelefono.value = usuario.telefono;

    console.log("Datos del usuario cargados en los inputs");
};


