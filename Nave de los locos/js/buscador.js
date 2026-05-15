/* =====================================================================
   buscador.js
   Buscador avanzado del corpus: filtros acordeón (género, período,
   temas, lengua) + búsqueda libre. 100% client-side, tiempo real.
   ===================================================================== */

(function () {
  "use strict";

  const esc = window.NAVE.escapeHTML;

  let corpus = [];
  const estado = {
    texto: "",
    generos: new Set(),
    periodos: new Set(),
    temas: new Set(),
    lenguas: new Set(),
  };

  const PERIODOS = [
    { id: "xv", etiqueta: "Siglo XV (1400–1499)", min: 1400, max: 1499 },
    { id: "xvi", etiqueta: "Siglo XVI (1500–1599)", min: 1500, max: 1599 },
    { id: "xvii", etiqueta: "Siglo XVII (1600–1699)", min: 1600, max: 1699 },
  ];

  /* ---------- Carga del JSON ---------------------------------------- */
  async function cargar() {
    const resultados = document.getElementById("resultados");
    if (!resultados) return;

    try {
      const r = await fetch("data/corpus.json");
      corpus = await r.json();
      corpus.sort((a, b) => (a.fecha || 0) - (b.fecha || 0));
    } catch (e) {
      resultados.innerHTML =
        '<p class="buscador__vacio">No se ha podido cargar el corpus.</p>';
      return;
    }

    construirPanel();
    enlazarEventos();
    filtrarYPintar();
  }

  /* ---------- Construcción de los filtros --------------------------- */
  function construirPanel() {
    const generos = Array.from(new Set(corpus.map((o) => o.genero).filter(Boolean))).sort();
    const lenguas = Array.from(new Set(corpus.map((o) => o.lengua_original).filter(Boolean))).sort();
    const temas = Array.from(new Set(corpus.flatMap((o) => o.temas || []))).sort();

    document.getElementById("panel-generos").innerHTML = generos
      .map((g) => check("genero", g, g))
      .join("");

    document.getElementById("panel-periodos").innerHTML = PERIODOS
      .map((p) => check("periodo", p.id, p.etiqueta))
      .join("");

    document.getElementById("panel-temas").innerHTML = temas
      .map((t) => check("tema", t, t))
      .join("");

    document.getElementById("panel-lenguas").innerHTML = lenguas
      .map((l) => check("lengua", l, l))
      .join("");
  }

  function check(grupo, valor, etiqueta) {
    return `
      <label class="check">
        <input type="checkbox" data-grupo="${grupo}" value="${esc(valor)}">
        <span class="check__caja"></span>
        <span>${esc(etiqueta)}</span>
      </label>`;
  }

  /* ---------- Eventos ----------------------------------------------- */
  function enlazarEventos() {
    // Acordeón
    document.querySelectorAll(".buscador__seccion-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.classList.toggle("abierto");
      });
    });

    // Checkboxes
    document.querySelectorAll('.buscador__panel input[type="checkbox"]').forEach((inp) => {
      inp.addEventListener("change", () => {
        const g = inp.dataset.grupo;
        const v = inp.value;
        const set =
          g === "genero" ? estado.generos :
          g === "periodo" ? estado.periodos :
          g === "tema" ? estado.temas :
          g === "lengua" ? estado.lenguas : null;
        if (!set) return;
        if (inp.checked) set.add(v); else set.delete(v);
        filtrarYPintar();
      });
    });

    // Búsqueda libre
    const input = document.getElementById("busqueda-libre");
    if (input) {
      input.addEventListener("input", () => {
        estado.texto = input.value.trim().toLowerCase();
        filtrarYPintar();
      });
    }

    // Reset
    const reset = document.getElementById("reset-filtros");
    if (reset) {
      reset.addEventListener("click", () => {
        estado.texto = "";
        estado.generos.clear();
        estado.periodos.clear();
        estado.temas.clear();
        estado.lenguas.clear();
        document
          .querySelectorAll('.buscador__panel input[type="checkbox"]')
          .forEach((i) => (i.checked = false));
        if (input) input.value = "";
        filtrarYPintar();
      });
    }
  }

  /* ---------- Lógica de filtrado ------------------------------------ */
  function coincide(obra) {
    if (estado.generos.size && !estado.generos.has(obra.genero)) return false;
    if (estado.lenguas.size && !estado.lenguas.has(obra.lengua_original)) return false;

    if (estado.periodos.size) {
      const enAlguno = Array.from(estado.periodos).some((id) => {
        const p = PERIODOS.find((x) => x.id === id);
        return p && obra.fecha >= p.min && obra.fecha <= p.max;
      });
      if (!enAlguno) return false;
    }

    if (estado.temas.size) {
      const obraTemas = new Set(obra.temas || []);
      const algunoCoincide = Array.from(estado.temas).some((t) => obraTemas.has(t));
      if (!algunoCoincide) return false;
    }

    if (estado.texto) {
      const t = estado.texto;
      const heno = [
        obra.titulo, obra.autor, obra.genero, obra.lengua_original,
        obra.primera_edicion, obra.resumen, obra.relevancia_tesis,
        (obra.temas || []).join(" "),
      ].join(" ").toLowerCase();
      if (!heno.includes(t)) return false;
    }

    return true;
  }

  function filtrarYPintar() {
    const filtrado = corpus.filter(coincide);
    const lista = document.getElementById("resultados");
    const contador = document.getElementById("contador-resultados");

    if (contador) {
      contador.innerHTML =
        `<strong>${filtrado.length}</strong> ` +
        (filtrado.length === 1 ? "obra encontrada" : "obras encontradas") +
        ` · de ${corpus.length} en el corpus`;
    }

    if (!filtrado.length) {
      lista.innerHTML =
        '<p class="buscador__vacio">Ningún resultado para esta combinación de filtros.</p>';
      return;
    }

    lista.innerHTML = filtrado.map((o, i) => filaResultado(o, i)).join("");

    // Engancha los botones de "copiar enlace" (delegación)
    lista.querySelectorAll(".copiar-enlace").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const id = btn.getAttribute("data-id");
        copiarEnlace(btn, id);
      });
    });

    // Si la URL trae ancla, desplazarse al resultado correspondiente
    const ancla = window.location.hash.slice(1);
    if (ancla) {
      const fila = document.getElementById(ancla);
      if (fila) {
        setTimeout(() => {
          fila.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      }
    }
  }

  /* ---------- Copiar enlace permanente ------------------------------ */
  async function copiarEnlace(btn, id) {
    if (!id) return;
    const url =
      window.location.origin + window.location.pathname + "#" + id;
    const textoNodo = btn.querySelector(".copiar-enlace__texto");
    const original = textoNodo ? textoNodo.textContent : "";
    const restaurar = () => {
      btn.classList.remove("copiado");
      if (textoNodo) textoNodo.textContent = original;
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      btn.classList.add("copiado");
      if (textoNodo) textoNodo.textContent = "Enlace copiado";
      setTimeout(restaurar, 2200);
    } catch (e) {
      if (textoNodo) textoNodo.textContent = "No se pudo copiar";
      setTimeout(restaurar, 2200);
    }
  }

  function filaResultado(o, i) {
    const delay = (i * 0.05).toFixed(2);
    const idAttr = esc(o.id || "");
    return `
      <article class="resultado" id="${idAttr}"
               style="animation-delay:${delay}s">
        <div class="resultado__fecha">${esc(o.fecha)}</div>
        <div class="resultado__cuerpo">
          <div class="resultado__autor">${esc(o.autor)}</div>
          <h3 class="resultado__titulo">
            <a href="corpus.html#${idAttr}">${esc(o.titulo)}</a>
          </h3>
          <p class="resultado__resumen">${esc(o.resumen)}</p>
          <button type="button"
                  class="copiar-enlace copiar-enlace--resultado"
                  data-id="${idAttr}"
                  aria-label="Copiar enlace permanente a este resultado">
            <span class="copiar-enlace__icono">#</span>
            <span class="copiar-enlace__texto">Copiar enlace</span>
          </button>
        </div>
        <div class="resultado__genero">${esc(o.genero)}</div>
      </article>`;
  }

  document.addEventListener("DOMContentLoaded", cargar);
})();
