# GTA VI Download Time

Calculadora estática en español para estimar cuánto tardaría una descarga de GTA VI según el tamaño del juego, la velocidad de Internet y el rendimiento sostenido de la conexión.

**Abrir la calculadora en GitHub Pages:** [GTA VI Download Time ↗](https://smouj.github.io/gta-vi-download-time/)

## Qué incluye

- Cálculo inmediato en el navegador, sin cuenta ni instalación.
- Tamaño y unidades editables. El valor inicial de 210 GB es una estimación no oficial y no está confirmado por Rockstar Games.
- Velocidades en Mbps o Gbps, con accesos rápidos a conexiones habituales.
- Ajuste de rendimiento real para aproximar la diferencia entre la velocidad contratada y la sostenida.
- Enlace compartible con los valores del cálculo en la URL.
- Fondos oficiales enlazados desde la galería de Rockstar Games; las imágenes no se incluyen ni se redistribuyen en este repositorio.

## Ejecutar localmente

Abre `index.html` directamente o sirve esta carpeta con cualquier servidor estático. No hay paquetes, compilación ni servicios externos necesarios para el cálculo.

## Fórmula

`segundos = (tamaño en GB × 8.000) ÷ velocidad efectiva en Mbps`

Se usa GB decimal (`1 GB = 1.000.000.000 bytes`). La velocidad efectiva es la velocidad indicada multiplicada por el porcentaje de rendimiento seleccionado. El resultado es una estimación: no contempla las variaciones de red, la instalación, la descompresión ni las actualizaciones.

## Datos y fuentes

La referencia provisional de 210 GB se basa en una estimación publicada por [GamesRadar](https://www.gamesradar.com/games/grand-theft-auto/gta-6-is-a-210gb-download-says-playstation-store-sleuth/). Rockstar Games no había confirmado el tamaño final al actualizar esta página el 3 de noviembre de 2026. El valor es editable para que los usuarios puedan actualizarlo cuando la plataforma anuncie el tamaño definitivo.

Las imágenes se cargan desde la [galería oficial de arte y fondos de GTA VI](https://www.rockstargames.com/VI/media/artwork-wallpapers). GTA VI, sus personajes y sus imágenes son propiedad de Rockstar Games / Take-Two Interactive. Este proyecto independiente no está afiliado ni respaldado por ellas.

## Publicación

El flujo de GitHub Actions en `.github/workflows/pages.yml` publica los archivos estáticos del repositorio en GitHub Pages cuando se envían cambios a `main`. En la configuración del repositorio, Pages debe tener como fuente **GitHub Actions**.

## Licencia

El código de este proyecto se distribuye bajo MIT. La marca y el arte de GTA VI no forman parte de esa licencia.

