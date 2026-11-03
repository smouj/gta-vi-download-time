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

- Detecta la velocidad de descarga con un solo botón y calcula la estimación al momento.
- Muestra un contador global aproximado de usuarios únicos que han pulsado el botón de medición.
- Permite cambiar el tamaño estimado del juego y elegir GB o TB.
- Aplica un 85% de la velocidad medida para aproximar las variaciones habituales de una descarga sostenida.
- Comparte un enlace con los valores del cálculo.
- Genera y descarga un pase de embarque PNG hacia Leonida, con tiempo estimado, número de serie, origen y datos de conexión.
- Permite subir una foto, guardada en el almacenamiento local del navegador, o buscar un avatar público de X/Instagram al solicitarlo.
- Incluye fondos y enlaces a la información oficial y a las fuentes del tamaño de referencia.
- Añade movimiento parallax, microanimaciones y apariciones al desplazarse; respeta la preferencia de movimiento reducido.
- No inicia la prueba de velocidad hasta pulsar el botón. La prueba descarga hasta unos 51 MB desde [Cloudflare Speed Test](https://speed.cloudflare.com/); Cloudflare recibe las solicitudes y la dirección IP necesaria para servirlas.
- El total de usuarios únicos aproximados se consulta e incrementa a través de [CounterAPI](https://counterapi.com/). Su servicio indica que transforma las direcciones IP y los datos del navegador en hashes; el contador no verifica identidades y puede diferir del número real de personas.
- El cálculo, el nombre, el origen y el billete se procesan en el navegador. La web no envía esos datos a un servidor ni usa analítica propia.

## Cómo se calcula

`segundos estimados = (tamaño en GB × 8.000) ÷ (velocidad medida en Mbps × 0,85)`

Se usa GB decimal (`1 GB = 1.000.000.000 bytes`). La estimación usa el 85% de la velocidad medida para dejar margen a variaciones de red y del servidor. El resultado es orientativo: el servidor de descarga del juego puede ofrecer otro rendimiento y el cálculo no incluye instalación, descompresión ni actualizaciones.

## Tamaño de referencia

El valor inicial de 210 GB procede de un [reporte de GamesRadar](https://www.gamesradar.com/games/grand-theft-auto/gta-6-is-a-210gb-download-says-playstation-store-sleuth/), no de una confirmación de Rockstar. El campo es editable para actualizarlo si cambia la información disponible.

## Privacidad y datos

- El nombre, el origen, la velocidad y el tamaño se usan en la página y al generar el billete; no se guardan ni se envían desde esta web.
- La medición solo comienza al pulsar el botón. Envía solicitudes de descarga a Cloudflare Speed Test; Cloudflare recibe la dirección IP y los datos técnicos necesarios para atender la solicitud. La prueba no envía el tamaño del juego, el nombre, el origen ni el billete.
- El contador consulta el total al cargar la página y registra un evento único al pulsar el botón. CounterAPI recibe estas solicitudes; su documentación declara anonimizar la IP y los datos del navegador mediante hashes. El tamaño del juego, la velocidad medida, el nombre, el origen y el billete no se envían al contador.
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

