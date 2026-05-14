/* =====================================================================
   corpus.js
   Carga data/corpus.json, renderiza la cuadrícula de obras y gestiona
   el despliegue in-situ de cada ficha académica. Sin librerías.
   ===================================================================== */

(function () {
  "use strict";

  const esc = window.NAVE.escapeHTML;
  let corpus = [];
  let filtroGenero = "todos";

  /* ---------- Carga del JSON ---------------------------------------- */
  async function cargar() {
    const grid = document.getElementById("corpus-grid");
    const contador = document.getElementById("corpus-contador");
    const filtros = document.getElementById("barra-filtros");
    if (!grid) return;

    try {
      const r = await fetch("data/corpus.json");
      if (!r.ok) throw new Error("HTTP " + r.status);
      corpus = await r.json();
      corpus.sort((a, b) => (a.fecha || 0) - (b.fecha || 0));
    } catch (e) {
      grid.innerHTML =
        '<p class="buscador__vacio">No se ha podido cargar el corpus. ' +
        "Verifique que el sitio se sirve por HTTP.</p>";
      console.error(e);
      return;
    }

    actualizarContador(contador);
    construirFiltros(filtros);
    pintar(grid);
  }

  /* ---------- Contador dinámico ------------------------------------- */
  function actualizarContador(nodo) {
    if (!nodo) return;
    const total = corpus.length;
    const fechas = corpus.map((o) => o.fecha).filter(Boolean);
    const min = Math.min(...fechas);
    const max = Math.max(...fechas);
    const sigloMin = Math.ceil(min / 100);
    const sigloMax = Math.ceil(max / 100);
    const romano = (n) =>
      ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
       "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"][n] || n;
    nodo.innerHTML =
      `<strong>${total}</strong> obras catalogadas · ` +
      `siglos ${romano(sigloMin)}–${romano(sigloMax)}`;
  }

  /* ---------- Filtros por género ------------------------------------ */
  function construirFiltros(contenedor) {
    if (!contenedor) return;
    const generos = Array.from(new Set(corpus.map((o) => o.genero).filter(Boolean))).sort();
    const html =
      '<span class="barra-filtros__etiqueta">Género</span>' +
      `<button type="button" class="pildora activa" data-genero="todos">Todos</button>` +
      generos
        .map(
          (g) =>
            `<button type="button" class="pildora" data-genero="${esc(g)}">${esc(g)}</button>`
        )
        .join("");
    contenedor.innerHTML = html;
    contenedor.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".pildora");
      if (!btn) return;
      filtroGenero = btn.getAttribute("data-genero");
      contenedor
        .querySelectorAll(".pildora")
        .forEach((b) => b.classList.toggle("activa", b === btn));
      pintar(document.getElementById("corpus-grid"));
    });
  }

  /* ---------- Render de la cuadrícula -------------------------------- */
  function pintar(grid) {
    const lista =
      filtroGenero === "todos"
        ? corpus
        : corpus.filter((o) => o.genero === filtroGenero);

    if (!lista.length) {
      grid.innerHTML = '<p class="buscador__vacio">No hay obras para este género.</p>';
      return;
    }

    grid.innerHTML = lista.map((o, i) => plantillaTarjeta(o, i)).join("");

    grid.querySelectorAll(".obra").forEach((card) => {
      card.addEventListener("click", (ev) => {
        if (ev.target.closest(".ficha-cerrar")) {
          cerrar(card);
          return;
        }
        if (card.classList.contains("expandida")) return;
        abrir(card);
      });
    });

    // animar entrada (fade-up escalonado)
    requestAnimationFrame(() => {
      grid.querySelectorAll(".obra").forEach((c, i) => {
        c.style.animation = `fade-in-up 0.5s ease-out ${i * 0.06}s forwards`;
        c.style.opacity = "0";
      });
    });
  }

  function abrir(card) {
    // cerrar otras
    document
      .querySelectorAll(".obra.expandida")
      .forEach((o) => o !== card && cerrar(o));
    card.classList.add("expandida");
    setTimeout(() => {
      const top = card.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
  }

  function cerrar(card) {
    card.classList.remove("expandida");
  }

  /* ---------- Plantilla de tarjeta ----------------------------------- */
  function plantillaTarjeta(o, i) {
    const id = "obra-" + (o.id || i);
    const temas = (o.temas || [])
      .map((t) => `<span class="ficha-tema">${esc(t)}</span>`)
      .join("");

    const datos = [
      ["Autor", esc(o.autor)],
      ["Fecha", esc(o.fecha)],
      ["Género", esc(o.genero)],
      ["Lengua original", esc(o.lengua_original)],
      ["Primera edición", esc(o.primera_edicion)],
      ["Localización ms.", esc(o.localizacion_ms)],
      ["PDF disponible", o.pdf_disponible ? "Sí" : "No"],
    ]
      .filter(([, v]) => v && v !== "")
      .map(
        ([k, v]) => `
        <div class="ficha-dato">
          <div class="ficha-dato__etiqueta">${k}</div>
          <div class="ficha-dato__valor">${v}</div>
        </div>`
      )
      .join("");

    const temasBloque = temas
      ? `<div class="ficha-dato">
           <div class="ficha-dato__etiqueta">Temas</div>
           <div class="ficha-dato__valor">
             <div class="ficha-temas">${temas}</div>
           </div>
         </div>`
      : "";

    return `
      <article class="obra fade-up" id="${id}" data-id="${esc(o.id || "")}">
        <button type="button" class="ficha-cerrar" aria-label="Cerrar ficha">Cerrar</button>
        <div class="obra__cabecera">
          <div class="obra__autor">${esc(o.autor)}</div>
          <div class="obra__fecha">${esc(o.fecha)}</div>
        </div>
        <h3 class="obra__titulo">${esc(o.titulo)}</h3>
        <div class="obra__linea"></div>
        <div class="obra__genero">${esc(o.genero)}</div>
        <p class="obra__resumen">${esc(o.resumen)}</p>

        <div class="obra__expansion">
          <div class="obra__expansion-contenido">
            <div class="ficha-datos">
              ${datos}
              ${temasBloque}
            </div>

            <div class="ficha-relevancia">
              <div class="ficha-relevancia__etiqueta">Relevancia para la tesis</div>
              <div class="ficha-relevancia__cuerpo">${esc(o.relevancia_tesis)}</div>
            </div>

            <div class="ficha-cierre">
              <span class="ficha-cierre__diamante">◆</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  document.addEventListener("DOMContentLoaded", cargar);
})();
