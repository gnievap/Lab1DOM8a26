'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const buildCard = ({title, text, tags}) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = tags;
    article.innerHTML = `
        <h3 class="card-title"></h3>
        <p class="card-text"></p>
        <div class="card-actions">
            <button class="btn small" type="button" data-action="like">👍 Like</button>
            <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
            <span class="badge" aria-label="likes">0</span>
        </div>
    `;
    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;
    return article;
};


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

// Manejador del evento mouseover de los artículos
const listaArticulos =$('#listaArticulos');

listaArticulos.addEventListener('mouseover', (e) => { 
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.add('is-highlight');
});

// Manejador del evento mouseout de los artículos
listaArticulos.addEventListener('mouseout', (e) => { 
     const card = e.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-highlight');
});

// Agregar elementos al DOM de forma dinámica
const btnAgregarCard = $('#btnAgregarCard');
const listaArticulosDiv = $('#listaArticulos');

btnAgregarCard.addEventListener('click', () => { 
    const article = buildCard({
        title: 'Nueva Card',
        text: 'Esta card fue agregada dinámicamente al hacer clic en el botón.',
        tags: 'nueva, dinamica'
    });
        

    listaArticulosDiv.append(article);
    setEstado('Nueva card agregada');
});

// Eliminar cards al hacer clic en el botón eliminar
const btnLimpiar = $('#btnLimpiar');

btnLimpiar.addEventListener('click', () => { 
    const cards = $$('#listaArticulos .card'); 
    let removed = 0;
    cards.forEach(card => { 
        if (card.dataset.seed === 'true') return;
        card.remove();
        removed++;
    });
    setEstado(`Se eliminaron ${removed} cards`);
});