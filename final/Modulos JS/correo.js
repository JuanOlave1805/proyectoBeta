function validateEmail(input) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = input.value.trim();
    const isValid = emailPattern.test(value);

    let span = input.nextElementSibling;
    if (!span || span.tagName !== 'SPAN') {
        span = document.createElement('span');
        span.style.fontSize = '12px';
        input.parentNode.insertBefore(span, input.nextSibling);
    }

    if (value.length === 0) {
        input.style.border = '2px solid red';
        span.textContent = 'Este campo no puede estar vacío';
        span.style.color = 'red';
        span.style.display = 'block';
        return false; // Retorna falso si el campo está vacío
    } else if (isValid) {
        input.style.border = '2px solid green';
        span.style.display = 'none';
        return true; // Retorna verdadero si es un correo válido
    } else {
        input.style.border = '2px solid red';
        span.textContent = 'Ingrese un correo electrónico válido';
        span.style.color = 'red';
        span.style.display = 'block';
        return false; // Retorna falso si no es un correo válido
    }
}


export default validateEmail;
