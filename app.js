'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

// Manejador del evento click del botón
btnCambiar.addEventListener('click', () => { 
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? 'Haz sido troleado por JavaScript'
        : 'Bienvenido a la aplicación de ejemplo';

    subtitulo.textContent = alt
        ? '¡Sorpresa! Este es un mensaje alternativo.'
        : 'Esta es una aplicación sencilla para demostrar manipulación del DOM.';

    titulo.dataset.alt = alt ? '0' : '1';
    setEstado('Textos actualizados');
});
