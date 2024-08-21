export default function numeros(event, elemento) {
    // Eliminar todos los <span> dentro del contenedor del formulario
    const form = elemento.closest('form'); // Encuentra el contenedor del formulario
    if (form) {
        const spans = form.querySelectorAll('span');
        spans.forEach(span => span.remove());
    }

    let valor = elemento.value;
    let expresion = /^\d$/;

    // Verificar si el span ya existe, si no, crearlo
    let span = elemento.nextElementSibling;
    if (!span || span.tagName !== 'SPAN') {
        span = document.createElement('span');
        span.style.fontSize = '12px';
        elemento.parentNode.insertBefore(span, elemento.nextSibling);
    }

    // Manejo del evento keypress
    if (event.type === 'keypress') {
        if (!expresion.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
            span.textContent = 'Solo se permiten números.';
            span.style.color = 'red';
            span.style.display = 'block';
            return;
        }

        if (valor.length >= 10 && expresion.test(event.key)) {
            event.preventDefault();
            span.textContent = 'Máximo 10 dígitos permitidos.';
            span.style.color = 'red';
            span.style.display = 'block';
        }
    }

    // Manejo del evento keyup
    if (event.type === 'keyup') {
        valor = valor.replace(/\D/g, '');

        if (valor.length < 7) {
            elemento.style.border = '2px solid red';
            span.textContent = 'Mínimo 7 dígitos.';
            span.style.color = 'red';
            span.style.display = 'block';
        } else if (valor.length <= 10) {
            elemento.style.border = '2px solid green';
            span.style.display = 'none';
        }

        elemento.value = valor;
    }
}




export function numerosEdad(event, elemento) {
    // Eliminar todos los <span> dentro del contenedor del formulario
    const form = elemento.closest('form'); // Encuentra el contenedor del formulario
    if (form) {
        const spans = form.querySelectorAll('span');
        spans.forEach(span => span.remove());
    }

    let valor = elemento.value;
    let expresion = /^\d$/;

    // Verificar si el span ya existe, si no, crearlo
    let span = elemento.nextElementSibling;
    if (!span || span.tagName !== 'SPAN') {
        span = document.createElement('span');
        span.style.fontSize = '12px';
        elemento.parentNode.insertBefore(span, elemento.nextSibling);
    }

    // Manejo del evento keypress
    if (event.type === 'keypress') {
        if (!expresion.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
            span.textContent = 'Solo se permiten números.';
            span.style.color = 'red';
            span.style.display = 'inline';
            return;
        }

        if (valor.length >= 2 && expresion.test(event.key)) {
            event.preventDefault();
            span.textContent = 'Máximo 2 dígitos permitidos.';
            span.style.color = 'red';
            span.style.display = 'inline';
        }
    }

    // Manejo del evento keyup
    if (event.type === 'keyup') {
        valor = valor.replace(/\D/g, '');

        if (valor.length < 1) {
            elemento.style.border = '2px solid red';
            span.textContent = 'Debe contener al menos 1 dígito.';
            span.style.color = 'red';
            span.style.display = 'inline';
        } else if (valor.length <= 2) {
            elemento.style.border = '2px solid green';
            span.style.display = 'none';
        }

        elemento.value = valor;
    }
}




export function numerosValores(event, elemento) {
    // Eliminar todos los <span> dentro del contenedor del formulario
    const form = elemento.closest('form'); // Encuentra el contenedor del formulario
    if (form) {
        const spans = form.querySelectorAll('span');
        spans.forEach(span => span.remove());
    }

    let valor = elemento.value;
    let expresion = /^\d$/;

    // Verificar si el span ya existe, si no, crearlo
    let span = elemento.nextElementSibling;
    if (!span || span.tagName !== 'SPAN') {
        span = document.createElement('span');
        span.style.fontSize = '12px';
        elemento.parentNode.insertBefore(span, elemento.nextSibling);
    }

    // Manejo del evento keypress
    if (event.type === 'keypress') {
        if (!expresion.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
            span.textContent = 'Solo se permiten números.';
            span.style.color = 'red';
            span.style.display = 'inline';
            return;
        }

        if (valor.length >= 10 && expresion.test(event.key)) {
            elemento.style.border = '2px solid red';
            span.textContent = 'Máximo 10 dígitos permitidos.';
            span.style.color = 'red';
            span.style.display = 'inline';
            event.preventDefault();
        } else if (valor.length < 3) {
            elemento.style.border = '2px solid red';
            span.textContent = 'Debe contener al menos 3 dígitos.';
            span.style.color = 'red';
            span.style.display = 'inline';
        } else {
            span.style.display = 'none';
            elemento.style.border = '2px solid green';
        }
    }
}




export function numerosStock(event, elemento) {
    // Eliminar todos los <span> dentro del contenedor del formulario
    const form = elemento.closest('form'); // Encuentra el contenedor del formulario
    if (form) {
        const spans = form.querySelectorAll('span');
        spans.forEach(span => span.remove());
    }

    let valor = elemento.value;
    let expresion = /^\d+$/; // Solo permite números

    // Verificar si el span ya existe, si no, crearlo
    let span = elemento.nextElementSibling;
    if (!span || span.tagName !== 'SPAN') {
        span = document.createElement('span');
        span.style.fontSize = '12px';
        elemento.parentNode.insertBefore(span, elemento.nextSibling);
    }

    // Filtrar caracteres no numéricos
    if (!expresion.test(valor)) {
        elemento.value = valor.replace(/\D/g, '');
        span.textContent = 'Solo se permiten números.';
        span.style.color = 'red';
        span.style.display = 'inline';
    }

    // Validación en tiempo real
    if (elemento.value === '1' || elemento.value.length > 10) {
        elemento.style.border = '2px solid red';
        span.textContent = 'El valor debe ser mayor que 1 y menor o igual a 10 dígitos.';
        span.style.color = 'red';
        span.style.display = 'inline';
    } else if (elemento.value.length === 0) {
        elemento.style.border = ''; // Sin borde si el input está vacío
        span.style.display = 'none';
    } else {
        elemento.style.border = '2px solid green';
        span.style.display = 'none';
    }
}

