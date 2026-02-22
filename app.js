// ===== REFERENCIAS A ELEMENTOS HTML =====
// document.getElementById busca un elemento por su id
const formulario = document.getElementById("formulario-tarea");
const entradaTarea = document.getElementById("entrada-tarea");
const listaTareas = document.getElementById("lista-tareas");
const mensajeVacio = document.getElementById("mensaje-vacio");
const btnTema = document.getElementById("btn-tema");

// ===== DATOS =====
// Cargamos las tareas guardadas en el navegador (o un array vacío si no hay)
// localStorage guarda datos aunque cierres el navegador
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// ===== FUNCIONES =====

// Guarda las tareas en el navegador para que no se pierdan
function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Muestra u oculta el mensaje "No hay tareas"
function actualizarMensajeVacio() {
  if (tareas.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

// Controla si se deben animar las tareas al renderizar
// false al inicio para que las tareas guardadas no se animen
let animarEntrada = false;

// Dibuja TODAS las tareas en la pantalla
function renderizarTareas() {
  // Vaciamos la lista antes de redibujar
  listaTareas.innerHTML = "";

  // Recorremos cada tarea del array
  tareas.forEach(function (tarea, indice) {
    // Creamos un elemento <li> para cada tarea
    const li = document.createElement("li");
    li.className = "tarea";

    // Solo animamos si no es la carga inicial
    if (!animarEntrada) {
      li.style.animation = "none";
    }
    if (tarea.completada) {
      li.classList.add("completada");
    }

    // Checkbox para marcar como completada
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;
    checkbox.addEventListener("change", function () {
      toggleCompletada(indice);
    });

    // Texto de la tarea
    const texto = document.createElement("span");
    texto.textContent = tarea.texto;

    // Botón para borrar
    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn-borrar";
    btnBorrar.textContent = "\u00D7"; // Símbolo ×
    btnBorrar.addEventListener("click", function () {
      borrarTarea(indice);
    });

    // Añadimos los elementos al <li>
    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(btnBorrar);

    // Añadimos el <li> a la lista
    listaTareas.appendChild(li);
  });

  actualizarMensajeVacio();
}

// Añade una tarea nueva al array
function agregarTarea(texto) {
  tareas.push({
    texto: texto,       // El texto que escribió el usuario
    completada: false,  // Empieza sin completar
  });
  guardarTareas();
  renderizarTareas();
}

// Cambia una tarea entre completada/no completada
function toggleCompletada(indice) {
  tareas[indice].completada = !tareas[indice].completada;
  guardarTareas();
  renderizarTareas();
}

// Elimina una tarea con animación de salida
function borrarTarea(indice) {
  // Buscamos el elemento <li> correspondiente en la lista
  const elementos = listaTareas.children;
  const li = elementos[indice];

  // Añadimos la clase que activa la animación de salida
  li.classList.add("saliendo");

  // Esperamos a que la animación termine (300ms) antes de borrar
  li.addEventListener("animationend", function () {
    tareas.splice(indice, 1); // Ahora sí eliminamos del array
    guardarTareas();
    renderizarTareas();
  });
}

// ===== MODO OSCURO =====

// Alterna entre modo claro y oscuro
function toggleTema() {
  // classList.toggle añade la clase si no está, o la quita si ya está
  document.body.classList.toggle("oscuro");

  // Actualizamos el texto del botón según el modo activo
  const esOscuro = document.body.classList.contains("oscuro");
  btnTema.textContent = esOscuro ? "Sol" : "Luna";

  // Guardamos la preferencia en localStorage
  localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
}

// Cargamos el tema guardado (si existe)
function cargarTema() {
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    document.body.classList.add("oscuro");
    btnTema.textContent = "Sol";
  }
}

// ===== EVENTOS =====

// Clic en el botón de tema
btnTema.addEventListener("click", toggleTema);

// Cuando el usuario envía el formulario (clic en Añadir o tecla Enter)
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Evita que la página se recargue (comportamiento por defecto)

  const texto = entradaTarea.value.trim(); // trim() quita espacios al inicio y final
  if (texto !== "") {
    agregarTarea(texto);
    entradaTarea.value = ""; // Limpia el campo de texto
    entradaTarea.focus();    // Devuelve el cursor al campo
  }
});

// ===== INICIO =====
cargarTema();        // Aplicamos el tema guardado
renderizarTareas();  // Dibujamos las tareas que ya existían (sin animación)
animarEntrada = true; // A partir de ahora, las nuevas tareas sí se animan
