/*
 * datos.js – Datos embebidos como variables globales.
 * Permite que el sitio funcione abriendo los ficheros HTML directamente
 * desde el sistema de archivos (sin servidor local), donde fetch() no
 * está disponible por restricciones de seguridad del navegador.
 * En GitHub Pages o cualquier servidor HTTP se usa fetch() preferentemente.
 */

var CORPUS_DATA = [
  {
    "id": "brant-narrenschiff-1494",
    "titulo": "Das Narrenschiff (La nave de los locos)",
    "autor": "Sebastian Brant",
    "fecha": 1494,
    "genero": "Poema alegórico",
    "lengua_original": "Alemán bajo",
    "primera_edicion": "Basilea, Johann Bergmann von Olpe, 1494",
    "localizacion_ms": "N/A – impreso",
    "temas": ["nave", "necedad", "sátira moral", "desfile de necios", "viaje"],
    "resumen": "Obra fundacional del género. Cataloga ciento doce tipos de necios que embarcan rumbo a Narragonien (tierra de los necios). Obra paradigmática que cristaliza la metáfora de la nave como contenedor de la insensatez humana.",
    "relevancia_tesis": "Obra fundacional del corpus. Su recepción en la Península Ibérica es el eje central de la investigación.",
    "pdf_disponible": false,
    "imagen_url": ""
  },
  {
    "id": "erasmo-elogio-locura-1511",
    "titulo": "Elogio de la locura (Moriae Encomium)",
    "autor": "Erasmo de Rotterdam",
    "fecha": 1511,
    "genero": "Prosa satírica",
    "lengua_original": "Latín",
    "primera_edicion": "París, Gilles de Gourmont, 1511",
    "localizacion_ms": "N/A – impreso",
    "temas": ["locura", "necedad", "sátira moral", "Erasmo", "homo viator"],
    "resumen": "La Locura toma la palabra y en un elogio paradójico recorre todos los estamentos sociales. Texto bisagra entre la tradición erasmista y la recepción española del motivo.",
    "relevancia_tesis": "Eje del humanismo cómico que nutre las manifestaciones hispánicas del corpus.",
    "pdf_disponible": false,
    "imagen_url": ""
  },
  {
    "id": "lope-locos-valencia",
    "titulo": "Los locos de Valencia",
    "autor": "Lope de Vega",
    "fecha": 1590,
    "genero": "Comedia",
    "lengua_original": "Castellano",
    "primera_edicion": "Madrid, ca. 1618",
    "localizacion_ms": "Biblioteca Nacional de España",
    "temas": ["hospital", "encierro", "locura", "loco fingido", "nave anclada"],
    "resumen": "El hospital de locos de Valencia como escenario dramático. La 'nave' se petrifica en institución: los locos ya no viajan, son encerrados, clasificados y exhibidos.",
    "relevancia_tesis": "Paradigma de la 'nave anclada': transición del viaje alegórico al encierro disciplinario. Analizada en el capítulo 4.6.",
    "pdf_disponible": false,
    "imagen_url": ""
  }
];

var GENEROS_DATA = [
  "Sátira moral",
  "Poema de cancionero",
  "Comedia",
  "Entremés",
  "Novela picaresca",
  "Prosa moral",
  "Teatro alegórico",
  "Diálogo humanista",
  "Espejo de príncipes",
  "Tragicomedia",
  "Poema alegórico",
  "Prosa satírica"
];

var TEMAS_DATA = [
  "nave",
  "necedad",
  "locura",
  "viaje",
  "errancia",
  "bufón",
  "hospital",
  "encierro",
  "sátira moral",
  "inversión carnavalesca",
  "homo viator",
  "Brant",
  "Erasmo",
  "nave anclada",
  "desfile de necios",
  "loco fingido",
  "espejo de príncipes",
  "picaresca"
];
