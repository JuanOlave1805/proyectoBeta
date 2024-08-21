const validar = (form) => {
  const elems = document.querySelectorAll(`${form} [required]`);
  let bandera = true;

  elems.forEach(element => {
      // Verificar si el span ya existe, si no, crearlo
      let span = element.nextElementSibling;
      if (!span || span.tagName !== 'SPAN') {
          span = document.createElement('span');
          span.style.fontSize = '12px';
          span.style.display = 'none'; // Inicialmente oculto

          // Encontrar el contenedor padre del input (div.form-group)
          const parentDiv = element.closest('.form-group');
          if (parentDiv) {
              parentDiv.parentNode.insertBefore(span, parentDiv.nextSibling);
          } else {
              element.parentNode.insertBefore(span, element.parentNode.nextSibling);
          }
      }

      if (element.type === 'checkbox') {
          // Validar el checkbox
          if (!element.checked) {
              element.classList.add("error");
              span.textContent = "Debe aceptar los términos y condiciones"; // Mostrar mensaje de error
              span.style.color = 'red';
              span.style.display = 'block'; // Asegurarse de que el span se muestre como un bloque
              bandera = false;
          } else {
              element.classList.remove("error");
              span.style.display = 'none'; // Ocultar el span si el checkbox está marcado
          }
      } else if (element.tagName === 'SELECT') {
          // Validar los campos de selección
          if (element.value.trim() === "") {
              element.classList.add("error");
              element.style.border = '2px solid red'; // Borde rojo cuando no se selecciona una opción
              span.textContent = "Debe seleccionar una opción"; // Mostrar mensaje de error
              span.style.color = 'red';
              span.style.display = 'block'; // Asegurarse de que el span se muestre como un bloque
              bandera = false;
          } else {
              element.classList.remove("error");
              element.style.border = '2px solid green'; // Borde verde cuando se ha seleccionado una opción
              span.style.display = 'none'; // Ocultar el span si se ha seleccionado una opción
          }
      } else if (element.value.trim() === "") {
          // Validar los campos de texto
          element.classList.add("error");
          element.style.border = '2px solid red'; // Poner borde rojo
          span.textContent = "El campo está vacío"; // Mostrar mensaje de error
          span.style.color = 'red';
          span.style.display = 'block'; // Asegurarse de que el span se muestre como un bloque
          bandera = false;
      } else {
          element.classList.remove("error");
          element.style.border = ''; // Quitar borde rojo
          span.style.display = 'none'; // Ocultar el span si el input no está vacío
      }
  });

  return bandera;
};

export default validar;


