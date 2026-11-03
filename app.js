(() => {
  const sizeInput = document.querySelector("#size-input");
  const sizeUnit = document.querySelector("#size-unit");
  const speedInput = document.querySelector("#speed-input");
  const speedUnit = document.querySelector("#speed-unit");
  const efficiencyInput = document.querySelector("#efficiency-input");
  const efficiencyValue = document.querySelector("#efficiency-value");
  const resultEfficiency = document.querySelector("#result-efficiency");
  const resultTime = document.querySelector("#result-time");
  const practicalTime = document.querySelector("#practical-time");
  const idealTime = document.querySelector("#ideal-time");
  const resultSummary = document.querySelector("#result-summary");
  const resultThroughput = document.querySelector("#result-throughput");
  const presetButtons = [...document.querySelectorAll("[data-speed]")];
  const copyButton = document.querySelector("#copy-button");
  const copyLabel = document.querySelector("#copy-label");
  const copyFeedback = document.querySelector("#copy-feedback");
  const shareLink = document.querySelector("#share-link");

  const params = new URLSearchParams(window.location.search);
  const initial = {
    size: params.get("size"),
    sizeUnit: params.get("sizeUnit"),
    speed: params.get("speed"),
    speedUnit: params.get("speedUnit"),
    efficiency: params.get("efficiency"),
  };

  if (isPositive(initial.size)) sizeInput.value = clamp(Number(initial.size), 1, 100000);
  if (["GB", "TB"].includes(initial.sizeUnit)) sizeUnit.value = initial.sizeUnit;
  if (isPositive(initial.speed)) speedInput.value = clamp(Number(initial.speed), 1, 100000);
  if (["Mbps", "Gbps"].includes(initial.speedUnit)) speedUnit.value = initial.speedUnit;
  if (isPositive(initial.efficiency)) efficiencyInput.value = clamp(Number(initial.efficiency), 50, 100);

  function isPositive(value) {
    return value !== null && value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits }).format(value);
  }

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "—";
    const totalMinutes = Math.ceil(seconds / 60);
    if (totalMinutes < 1) return "menos de 1 min";
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days) parts.push(`${days} ${days === 1 ? "día" : "días"}`);
    if (hours) parts.push(`${hours} h`);
    if (minutes || parts.length === 0) parts.push(`${minutes} min`);
    return parts.join(" ");
  }

  function prettySize(size, unit) {
    return `${formatNumber(Number(size), Number.isInteger(Number(size)) ? 0 : 2)} ${unit}`;
  }

  function getState() {
    const size = clamp(Number(sizeInput.value) || 1, 1, 100000);
    const speed = clamp(Number(speedInput.value) || 1, 1, 100000);
    const efficiency = clamp(Number(efficiencyInput.value) || 85, 50, 100);
    const sizeInGb = size * (sizeUnit.value === "TB" ? 1000 : 1);
    const speedInMbps = speed * (speedUnit.value === "Gbps" ? 1000 : 1);
    const idealSeconds = (sizeInGb * 8000) / speedInMbps;
    const realSeconds = idealSeconds / (efficiency / 100);
    return { size, sizeInGb, sizeUnit: sizeUnit.value, speed, speedInMbps, speedUnit: speedUnit.value, efficiency, idealSeconds, realSeconds };
  }

  function createShareUrl(state) {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({
      size: String(state.size),
      sizeUnit: state.sizeUnit,
      speed: String(state.speed),
      speedUnit: state.speedUnit,
      efficiency: String(state.efficiency),
    }).toString();
    url.hash = "calculadora";
    return url.toString();
  }

  function update() {
    const state = getState();
    const effectiveMbps = state.speedInMbps * (state.efficiency / 100);
    const effectiveMBps = effectiveMbps / 8;
    const formattedEfficiency = `${state.efficiency}%`;
    const formattedSpeed = `${formatNumber(state.speed, state.speedUnit === "Gbps" ? 2 : 0)} ${state.speedUnit}`;
    const formattedSize = prettySize(state.size, state.sizeUnit);
    const practical = formatDuration(state.realSeconds);
    const ideal = formatDuration(state.idealSeconds);

    sizeInput.value = String(state.size);
    speedInput.value = String(state.speed);
    efficiencyInput.value = String(state.efficiency);
    efficiencyValue.value = formattedEfficiency;
    efficiencyValue.textContent = formattedEfficiency;
    resultEfficiency.textContent = formattedEfficiency;
    resultTime.textContent = practical;
    practicalTime.textContent = practical;
    idealTime.textContent = ideal;
    resultSummary.textContent = `${formattedSize} a ${formattedSpeed}`;
    resultThroughput.textContent = `${formatNumber(effectiveMBps, effectiveMBps < 10 ? 1 : 0)} MB/s efectivos`;
    shareLink.href = createShareUrl(state);
    shareLink.setAttribute("aria-label", `Compartir cálculo de ${practical}`);

    presetButtons.forEach((button) => {
      const isSelected = Number(button.dataset.speed) === state.speed && button.dataset.unit === state.speedUnit;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  [sizeInput, sizeUnit, speedInput, speedUnit, efficiencyInput].forEach((control) => {
    control.addEventListener("input", update);
    control.addEventListener("change", update);
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      speedInput.value = button.dataset.speed;
      speedUnit.value = button.dataset.unit;
      update();
      speedInput.focus({ preventScroll: true });
    });
  });

  copyButton.addEventListener("click", async () => {
    const state = getState();
    const text = `GTA VI: estimación de descarga de ${prettySize(state.size, state.sizeUnit)} en ${formatDuration(state.realSeconds)} con ${formatNumber(state.speed, state.speedUnit === "Gbps" ? 2 : 0)} ${state.speedUnit} (${state.efficiency}% de rendimiento). ${createShareUrl(state)}`;
    try {
      await navigator.clipboard.writeText(text);
      copyLabel.textContent = "Copiado";
      copyFeedback.textContent = "Resultado y enlace copiados al portapapeles.";
    } catch {
      copyFeedback.textContent = "No se pudo copiar automáticamente. Usa “Compartir cálculo” para copiar el enlace.";
    }
    window.setTimeout(() => {
      copyLabel.textContent = "Copiar resultado";
      copyFeedback.textContent = "";
    }, 3000);
  });

  shareLink.addEventListener("click", async (event) => {
    event.preventDefault();
    const state = getState();
    const url = createShareUrl(state);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi estimación de descarga de GTA VI", text: `Calculé ${formatDuration(state.realSeconds)} para descargar GTA VI.`, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      copyFeedback.textContent = "Enlace de este cálculo copiado.";
      window.setTimeout(() => { copyFeedback.textContent = ""; }, 3000);
    } catch {
      window.history.replaceState({}, "", url);
      copyFeedback.textContent = "El enlace con tu cálculo está listo en la barra de direcciones.";
      window.setTimeout(() => { copyFeedback.textContent = ""; }, 4000);
    }
  });

  update();

  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (hero && heroImage && !reduceMotion.matches) {
    let framePending = false;
    const updateParallax = () => {
      const heroProgress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      heroImage.style.setProperty("--parallax-y", `${-heroProgress * 28}px`);
      framePending = false;
    };
    const requestParallaxUpdate = () => {
      if (!framePending) {
        window.requestAnimationFrame(updateParallax);
        framePending = true;
      }
    };
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate, { passive: true });
    updateParallax();
  }
})();

