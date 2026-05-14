# La nave de los locos

Exposición digital sobre las figuraciones de la locura en el Siglo de Oro
hispánico. Investigación doctoral de Alexandre García Macovio, Universidad de
Valladolid, 2025.

---

## Concepto

El sitio se concibe como una **exposición digital de museo**: el usuario no
consulta una base de datos, recorre una muestra permanente. Cada obra es una
pieza de la exposición; cada página, una sala.

Referencias estéticas: plataformas del MoMA y la BnF, revistas académicas de
diseño tipo *Lapham's Quarterly*.

## Estructura

```
nave-de-los-locos/
├── index.html        Portada con hero, "tres ideas" y acceso rápido
├── corpus.html       Catálogo completo del corpus (despliegue in-situ)
├── buscar.html       Buscador avanzado con filtros y búsqueda libre
├── contexto.html     Marco histórico: Brant, Erasmo, Bosco, recepción hispánica
├── acerca.html       Dossier de la investigación
├── css/
│   └── estilos.css   Hoja de estilo única (variables CSS, animaciones, responsive)
├── js/
│   ├── navegacion.js Navbar reactiva, menú móvil, observador de animaciones
│   ├── corpus.js     Carga del JSON, render de fichas, expansión in-situ
│   └── buscador.js   Filtros acordeón + búsqueda libre en tiempo real
└── data/
    ├── corpus.json   Las obras del corpus
    ├── generos.json  Vocabulario controlado de géneros
    └── temas.json    Vocabulario controlado de temas
```

## Identidad visual

- **Tipografías**: Cormorant Garamond (titulares, italic activado), Libre
  Baskerville (cuerpo, line-height 1.9), Inconsolata (metadatos, etiquetas).
- **Paleta**: blanco puro, blanco marfil `#f7f5f0`, azul abismo `#0a1628`,
  oro antiguo `#b8860b`, gris editorial `#6b6b6b`, bermellón puntual
  `#c0392b`.
- **Animaciones**: clip-path en cortina, sombra dramática al hover, línea
  dorada que crece al entrar en viewport, navbar transparente → sólida al
  scroll, expansión `max-height` para las fichas.

## Datos

El archivo `data/corpus.json` sigue el esquema:

```json
{
  "id":               "identificador-slug",
  "titulo":           "Título completo de la obra",
  "autor":            "Autor",
  "fecha":            1494,
  "genero":           "Poema alegórico",
  "lengua_original":  "Alemán bajo",
  "primera_edicion":  "Basilea, Bergmann von Olpe, 1494",
  "localizacion_ms":  "N/A – impreso",
  "temas":            ["nave", "necedad", "sátira moral"],
  "resumen":          "Texto breve descriptivo.",
  "relevancia_tesis": "Función en la argumentación de la tesis.",
  "pdf_disponible":   false,
  "imagen_url":       ""
}
```

Las tres obras de ejemplo ya incluidas:

1. **Das Narrenschiff** — Sebastian Brant, 1494
2. **Elogio de la locura** (*Moriae Encomium*) — Erasmo de Rotterdam, 1511
3. **Los locos de Valencia** — Lope de Vega, c. 1590

## Uso local

Sitio 100% HTML/CSS/JavaScript vanilla. Para el desarrollo local:

```bash
# Cualquier servidor estático sirve. Ejemplos:
python3 -m http.server 8000
# o
npx serve .
```

Y abrir `http://localhost:8000`. *No basta con abrir el archivo directamente
con doble clic*: la carga de `data/corpus.json` requiere HTTP por la política
CORS de los navegadores.

## Despliegue

Compatible con **GitHub Pages**: subir el contenido al repositorio y activar
Pages sobre la rama principal. No hay paso de build.

## Licencia

© 2025 Alexandre García Macovio · Todos los derechos reservados.
