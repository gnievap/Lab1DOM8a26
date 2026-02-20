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

// const likeButtons = document.querySelectorAll(
//     '#listaArticulos button[data-action="like"]');

const listaArticulos3 = $('#listaArticulos');

listaArticulos3.addEventListener('click', (e) => {
    // ¿Se hizo clic en un botón de like?
    const btn = e.target.closest('button[data-action="like"]');
    if (!btn) return; // No es un botón de like, salir
    const card = btn.closest('.card');
    if (!card) return; // No se encontró la card, salir
    hacerLike(card);
});

// likeButtons.forEach(btn => {
//     btn.addEventListener('click', () => {
//         const card = btn.closest('.card');
//         hacerLike(card);
        
//     });
// });

const hacerLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;
    badge.textContent = currentLikes + 1;
    setEstado('Like agregado');
};

// Filtrar cards
const filtro = $('#filtro');

const filterState = {q: '', tag: ''};

// Unir título y texto de cada card
// Y va a buscar  lo que el usuario escribió en el filtro

const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? '';
    const haystack = (title + ' ' + text).toLowerCase();
    return haystack.includes(q);
};

const matchTag = (card, tag) => {
    if (!tag) return true; // Si no hay tag, coinciden todas las cards
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q 
            ? matchText(card, filterState.q) 
            : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });
    const parts =[];
    if (filterState.q) parts.push(`Texto: "${filterState.q}"`);
    if (filterState.tag) parts.push(`Tag: "${filterState.tag}"`);
    setEstado(parts.length  
        ? `Filtros aplicados (${parts.join(', ')})` 
        : 'Filtro vacío');
};

// Evento input: filtrar mientras se escribe en la caja de texto
filtro.addEventListener('input', ()=>{
    // q: lo que el usuario escribe en el input
    const q = filtro.value.trim().toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const ok = q === '' ? true : matchText(card, q);
        card.hidden = !ok;
    });

    setEstado( q === '' ? 'Filtro vacío' : `Filtro texto: "${q}"`);

});

// Filtrar por tags
const chips = $('#chips');
chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return; // No se hizo clic en una chip, salir

    const tag = (chip.dataset.tag || '').toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const tags = (card.dataset.tags || '').toLowerCase();
        card.hidden = !tags.includes(tag);
    });
    setEstado(`Filtro por tag: "${tag}"`);
});