function validateTextInput(input) {
    // Eliminar todos los <span> dentro del contenedor del formulario
    const form = input.closest('form'); // Encuentra el contenedor del formulario
    if (form) {
        const spans = form.querySelectorAll('span');
        spans.forEach(span => span.remove());
    }

    // Remover cualquier carácter que no sea letra o espacio
    input.value = input.value.replace(/[^A-Za-z\s]/g, '');

    const value = input.value;
    const isValid = /^[A-Za-z\s]+$/.test(value); // Solo letras y espacios

    // Crear un nuevo span solo si es necesario
    let span = document.createElement('span');
    span.style.fontSize = '12px';
    span.style.display = 'none'; // Inicialmente oculto
    input.parentNode.insertBefore(span, input.nextSibling);

    if (value.length === 0) {
        // Si el valor está vacío
        input.style.border = '2px solid red'; // Borde rojo
        span.textContent = 'Este campo no puede estar vacío'; // Mensaje de error
        span.style.color = 'red';
        span.style.display = 'inline'; // Mostrar el span
    } else if (value.length > 2 && isValid) {
        // Si el valor tiene más de 2 caracteres y es válido
        input.style.border = '2px solid green'; // Borde verde
        span.style.display = 'none'; // Ocultar el span
    } else {
        // Si el valor no cumple con los criterios
        input.style.border = '2px solid red'; // Borde rojo
        span.textContent = 'Debe contener al menos 3 caracteres, solo letras y espacios'; // Mensaje de error
        span.style.color = 'red';
        span.style.display = 'inline'; // Mostrar el span
    }
}

export default validateTextInput;

