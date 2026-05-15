/* =====================================================================
   navegacion.js
   Navegación, menú móvil, página activa, observador de animaciones,
   navbar reactiva al scroll.
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- Utilidad global compartida ---------------------------- */
  window.NAVE = window.NAVE || {};

  window.NAVE.escapeHTML = function (str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  window.NAVE.slug = function (str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  /* ---------- Marcar enlace activo en la nav ------------------------ */
  function marcarActivo() {
    const aqui = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const destino = link.getAttribute("data-nav");
      if (destino === aqui) link.classList.add("activo");
    });
  }

  /* ---------- Navbar reactiva al scroll ----------------------------- */
  function navbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    const aplicar = () => {
      if (window.scrollY > 80) navbar.classList.add("solida");
      else navbar.classList.remove("solida");
    };
    aplicar();
    window.addEventListener("scroll", aplicar, { passive: true });
  }

  /* ---------- Menú móvil -------------------------------------------- */
  function menuMovil() {
    const navbar = document.querySelector(".navbar");
    const boton = document.querySelector(".navbar__hamburguesa");
    const menu = document.querySelector(".menu-movil");
    if (!boton || !menu) return;

    const alternar = () => {
      const abierto = menu.classList.toggle("abierto");
      navbar.classList.toggle("menu-abierto", abierto);
      document.body.style.overflow = abierto ? "hidden" : "";
    };

    boton.addEventListener("click", alternar);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", alternar));
  }

  /* ---------- Observer para animaciones de entrada ------------------ */
  function observador() {
    const elementos = document.querySelectorAll(
      ".cortina, .cortina-stagger, .fade-up, .titulo-seccion, .timeline"
    );

    // Respeto a prefers-reduced-motion: revelamos todo sin animación diferida
    const reducirMovimiento =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducirMovimiento || !("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            io.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    elementos.forEach((el) => io.observe(el));

    // Activación inmediata de los elementos ya visibles en el primer render:
    // el IntersectionObserver puede tardar uno o dos frames en disparar la
    // primera entrada, y eso deja el hero (clip-path + opacity:0) en blanco.
    // Recorremos los elementos y, si su rect ya intersecta el viewport,
    // les añadimos .visible y los desregistramos del observer.
    requestAnimationFrame(() => {
      elementos.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visibleAhora =
          rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom > 0;
        if (visibleAhora) {
          el.classList.add("visible");
          io.unobserve(el);
        }
      });
    });
  }

  /* ---------- Año dinámico en el footer ----------------------------- */
  function anioFooter() {
    const nodos = document.querySelectorAll("[data-anio]");
    const anio = new Date().getFullYear();
    nodos.forEach((nodo) => {
      nodo.textContent = anio;
    });
  }

  /* ---------- Boot --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    marcarActivo();
    navbarScroll();
    menuMovil();
    observador();
    anioFooter();
  });
})();
