# GTA VI Download Time

Calculadora web gratuita en español para estimar cuánto tardaría una descarga según el tamaño del juego y la velocidad de Internet. Funciona en GitHub Pages, sin instalación ni cuenta.

<p align="center">
  <a href="https://github.com/smouj/gta-vi-download-time/actions/workflows/pages.yml"><img alt="Estado de GitHub Pages" src="https://github.com/smouj/gta-vi-download-time/actions/workflows/pages.yml/badge.svg"></a>
  <a href="https://smouj.github.io/gta-vi-download-time/"><img alt="Abrir aplicación" src="https://img.shields.io/badge/GitHub%20Pages-abrir%20app-222?logo=githubpages"></a>
  <img alt="HTML, CSS y JavaScript" src="https://img.shields.io/badge/HTML-CSS%20%2B%20JavaScript-ec4899">
  <a href="LICENSE"><img alt="Licencia MIT del código" src="https://img.shields.io/github/license/smouj/gta-vi-download-time"></a>
</p>

## Abrir la calculadora

**[Ir a GTA VI Download Time ↗](https://smouj.github.io/gta-vi-download-time/)**

## Funciones

- Estima el tiempo de descarga con tamaño editable, unidades GB/TB y velocidades Mbps/Gbps.
- Ajusta el rendimiento de la conexión para aproximar la velocidad sostenida.
- Comparte un enlace con los valores del cálculo.
- Genera y descarga un pase de embarque PNG hacia Leonida, con tiempo estimado, número de serie, origen y datos de conexión.
- Permite subir una foto, guardada en el almacenamiento local del navegador, o buscar un avatar público de X/Instagram al solicitarlo.
- Incluye fondos y enlaces a la información oficial y a las fuentes del tamaño de referencia.
- Añade movimiento parallax, microanimaciones y apariciones al desplazarse; respeta la preferencia de movimiento reducido.
- No usa analítica ni envía los datos del cálculo a un servidor.

## Cómo se calcula

`segundos = (tamaño en GB × 8.000) ÷ velocidad efectiva en Mbps`

Se usa GB decimal (`1 GB = 1.000.000.000 bytes`). La velocidad efectiva es la velocidad indicada multiplicada por el rendimiento elegido. El resultado es orientativo y no incluye instalación, descompresión, actualizaciones ni variaciones de red.

## Tamaño de referencia

El valor inicial de 210 GB procede de un [reporte de GamesRadar](https://www.gamesradar.com/games/grand-theft-auto/gta-6-is-a-210gb-download-says-playstation-store-sleuth/), no de una confirmación de Rockstar. El campo es editable para actualizarlo si cambia la información disponible.

## Privacidad de fotos

- El nombre, el origen, la velocidad y el tamaño se usan en la página y al generar el billete; no se guardan ni se envían.
- Una foto subida se recorta y comprime en el navegador. Se guarda en el almacenamiento local de ese dispositivo para reutilizarla; se elimina con **Quitar foto** o al borrar los datos del sitio.
- Si se pulsa **Detectar foto**, el nombre de usuario se consulta mediante [Unavatar](https://unavatar.io/docs), un servicio externo que busca avatares públicos de X o Instagram. Esa consulta puede revelar al servicio qué perfil se está buscando y depende de la disponibilidad y los límites de Unavatar.
- El PNG del billete se genera en el navegador. No se sube al repositorio ni a un servidor.

## Créditos y marcas

Este es un proyecto independiente, humorístico y no oficial. No está afiliado, patrocinado ni respaldado por Rockstar Games o Take-Two Interactive. GTA VI, sus logotipos, personajes y arte pertenecen a sus respectivos titulares; este proyecto no reclama derechos ni licencia sobre ellos.

Los fondos de la galería se cargan desde la [página oficial de Rockstar Games](https://www.rockstargames.com/VI/media/artwork-wallpapers). Los archivos de marca incluidos en `assets/` no forman parte de la licencia MIT del código.

## Desarrollo local

Abre `index.html` o sirve esta carpeta con un servidor estático. No hay dependencias ni paso de compilación. Para que las fotos se guarden de manera uniforme, es preferible abrirla desde GitHub Pages o un servidor local.

## Licencia

El código del proyecto se distribuye bajo MIT; consulta [LICENSE](LICENSE). Las marcas y el arte de GTA VI no están cubiertos por esa licencia.