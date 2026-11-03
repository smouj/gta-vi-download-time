(() => {
  const sizeInput = document.querySelector("#size-input");
  const sizeUnit = document.querySelector("#size-unit");
  const measureSpeedButton = document.querySelector("#measure-speed");
  const measureSpeedLabel = document.querySelector("#measure-speed-label");
  const detectedSpeed = document.querySelector("#detected-speed");
  const speedTestStatus = document.querySelector("#speed-test-status");
  const speedTesterCount = document.querySelector("#speed-tester-count");
  const speedTesterCountStatus = document.querySelector("#speed-tester-count-status");
  const calculatorActions = document.querySelector("#calculator-actions");
  const efficiencyValue = document.querySelector("#efficiency-value");
  const resultEfficiency = document.querySelector("#result-efficiency");
  const resultTime = document.querySelector("#result-time");
  const practicalTime = document.querySelector("#practical-time");
  const idealTime = document.querySelector("#ideal-time");
  const resultSummary = document.querySelector("#result-summary");
  const resultThroughput = document.querySelector("#result-throughput");
  const copyButton = document.querySelector("#copy-button");
  const copyLabel = document.querySelector("#copy-label");
  const copyFeedback = document.querySelector("#copy-feedback");
  const shareLink = document.querySelector("#share-link");
  const passengerInput = document.querySelector("#passenger-input");
  const originInput = document.querySelector("#origin-input");
  const socialPlatform = document.querySelector("#social-platform");
  const socialHandle = document.querySelector("#social-handle");
  const fetchAvatarButton = document.querySelector("#fetch-avatar");
  const avatarFileInput = document.querySelector("#avatar-file");
  const clearAvatarButton = document.querySelector("#clear-avatar");
  const avatarStatus = document.querySelector("#avatar-status");
  const ticketDownloadButton = document.querySelector("#download-ticket");
  const newTicketSerialButton = document.querySelector("#new-ticket-serial");
  const ticketFeedback = document.querySelector("#ticket-feedback");
  const ticketAvatar = document.querySelector("#ticket-avatar");
  const ticketBarcode = document.querySelector("#ticket-barcode");
  const ticketTime = document.querySelector("#ticket-time");
  const ticketSize = document.querySelector("#ticket-size");
  const ticketSpeed = document.querySelector("#ticket-speed");
  const ticketEfficiency = document.querySelector("#ticket-efficiency");
  const ticketSeat = document.querySelector("#ticket-seat");
  const ticketSerialLabels = [document.querySelector("#ticket-serial"), document.querySelector("#ticket-stub-serial")];
  const ticketPassengerLabels = [document.querySelector("#ticket-passenger"), document.querySelector("#ticket-stub-name")];
  const ticketOrigin = document.querySelector("#ticket-origin");

  const AVATAR_STORAGE_KEY = "gta-vi-download-time:ticket-avatar:v1";
  const SERIAL_STORAGE_KEY = "gta-vi-download-time:ticket-serial:v1";
  const AVATAR_PLACEHOLDER = "assets/avatar-placeholder.svg";
  const DEFAULT_EFFICIENCY = 85;
  const SPEED_TEST_ENDPOINT = "https://speed.cloudflare.com/__down";
  const SPEED_TEST_COUNTER_ENDPOINT = "https://counterapi.com/api/smouj.github.io/speed-test/gta-vi-download-time-users";
  const MAX_PROBE_BYTES = 25_000_000;
  const FIRST_PROBE_BYTES = 250_000;
  let currentAvatarData = "";
  let measuredSpeedMbps = 0;
  let isMeasuringSpeed = false;

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
  if (isPositive(initial.speed)) {
    const initialSpeed = Number(initial.speed) * (initial.speedUnit === "Gbps" ? 1000 : 1);
    measuredSpeedMbps = clamp(initialSpeed, 0.1, 100000);
  }
  const currentEfficiency = isPositive(initial.efficiency)
    ? clamp(Number(initial.efficiency), 50, 100)
    : DEFAULT_EFFICIENCY;
  if (measuredSpeedMbps > 0) {
    speedTestStatus.dataset.state = "success";
    speedTestStatus.textContent = `Velocidad del cálculo compartido: ${formatSpeed(measuredSpeedMbps)}. Pulsa para medir esta conexión.`;
  }

  function isPositive(value) {
    return value !== null && value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits }).format(value);
  }

  function formatSpeed(speedInMbps) {
    if (speedInMbps >= 1000) return `${formatNumber(speedInMbps / 1000, 2)} Gbps`;
    return `${formatNumber(speedInMbps, speedInMbps < 10 ? 2 : 0)} Mbps`;
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
    const speedInMbps = measuredSpeedMbps;
    const speedUnit = speedInMbps >= 1000 ? "Gbps" : "Mbps";
    const speed = speedUnit === "Gbps" ? speedInMbps / 1000 : speedInMbps;
    const efficiency = currentEfficiency;
    const sizeInGb = size * (sizeUnit.value === "TB" ? 1000 : 1);
    const idealSeconds = speedInMbps > 0 ? (sizeInGb * 8000) / speedInMbps : Number.NaN;
    const realSeconds = speedInMbps > 0 ? idealSeconds / (efficiency / 100) : Number.NaN;
    return { size, sizeInGb, sizeUnit: sizeUnit.value, speed, speedInMbps, speedUnit: speedUnit.value, efficiency, idealSeconds, realSeconds };
  }

  function createSerial() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = new Uint8Array(6);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
    const suffix = [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
    return `LEO-${String(new Date().getFullYear()).slice(-2)}-${suffix}`;
  }

  function loadSerial() {
    try {
      const saved = window.localStorage.getItem(SERIAL_STORAGE_KEY);
      if (saved && /^LEO-\d{2}-[A-Z2-9]{6}$/.test(saved)) return saved;
      const created = createSerial();
      window.localStorage.setItem(SERIAL_STORAGE_KEY, created);
      return created;
    } catch {
      return createSerial();
    }
  }

  let ticketSerial = loadSerial();

  function createBarcodePattern(serial, length) {
    let value = 2166136261;
    for (const character of serial) value = Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0;
    let bits = "";
    while (bits.length < length) {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      bits += value.toString(2).padStart(32, "0");
    }
    return bits.slice(0, length);
  }

  function drawBarcode(serial) {
    if (!ticketBarcode) return;
    ticketBarcode.replaceChildren();
    [...createBarcodePattern(serial, 20)].forEach((bit, index) => {
      const bar = document.createElement("span");
      bar.style.setProperty("--bar-width", bit === "1" ? (index % 5 === 0 ? "3px" : "2px") : "1px");
      ticketBarcode.append(bar);
    });
  }

  function syncTicket(state = getState()) {
    if (!ticketTime) return;
    const name = passengerInput.value.trim() || "Viajero/a";
    const origin = originInput.value.trim() || "Mi conexión";
    const speedLabel = state.speedInMbps > 0 ? formatSpeed(state.speedInMbps) : "Sin medir";
    ticketTime.textContent = state.speedInMbps > 0 ? formatDuration(state.realSeconds) : "Pendiente";
    ticketSize.textContent = prettySize(state.size, state.sizeUnit);
    ticketSpeed.textContent = speedLabel;
    ticketEfficiency.textContent = `${state.efficiency}%`;
    ticketSeat.textContent = `VI-${ticketSerial.slice(-3)}`;
    ticketOrigin.textContent = origin.toLocaleUpperCase("es-ES");
    ticketPassengerLabels.forEach((label) => { label.textContent = name; });
    ticketSerialLabels.forEach((label) => { label.textContent = ticketSerial; });
    if (ticketAvatar) ticketAvatar.alt = `Foto de perfil para ${name}`;
    drawBarcode(ticketSerial);
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

  let lastDisplayedTime = resultTime.textContent;
  function update() {
    const state = getState();
    const hasMeasurement = state.speedInMbps > 0;
    const effectiveMbps = state.speedInMbps * (state.efficiency / 100);
    const effectiveMBps = effectiveMbps / 8;
    const formattedEfficiency = `${state.efficiency}%`;
    const formattedSpeed = hasMeasurement ? formatSpeed(state.speedInMbps) : "sin medir";
    const formattedSize = prettySize(state.size, state.sizeUnit);
    const practical = hasMeasurement ? formatDuration(state.realSeconds) : "—";
    const ideal = hasMeasurement ? formatDuration(state.idealSeconds) : "—";

    sizeInput.value = String(state.size);
    detectedSpeed.textContent = hasMeasurement ? formattedSpeed : "Sin medir";
    measureSpeedButton.disabled = isMeasuringSpeed;
    measureSpeedLabel.textContent = isMeasuringSpeed
      ? "Midiendo tu conexión…"
      : hasMeasurement ? "Volver a medir y calcular" : "Detectar velocidad y calcular";
    efficiencyValue.value = formattedEfficiency;
    efficiencyValue.textContent = formattedEfficiency;
    resultEfficiency.textContent = formattedEfficiency;
    if (hasMeasurement && practical !== lastDisplayedTime) {
      resultTime.classList.remove("result-updated");
      void resultTime.offsetWidth;
      resultTime.classList.add("result-updated");
      window.setTimeout(() => resultTime.classList.remove("result-updated"), 400);
      lastDisplayedTime = practical;
    }
    resultTime.textContent = practical;
    practicalTime.textContent = hasMeasurement ? practical : "Pendiente";
    idealTime.textContent = ideal;
    resultSummary.textContent = hasMeasurement ? `${formattedSize} a ${formattedSpeed}` : `${formattedSize} · mide tu conexión`;
    resultThroughput.textContent = hasMeasurement
      ? `${formatNumber(effectiveMBps, effectiveMBps < 10 ? 1 : 0)} MB/s efectivos`
      : "Pendiente de medición";
    calculatorActions.hidden = !hasMeasurement;
    ticketDownloadButton.disabled = !hasMeasurement;
    if (hasMeasurement) {
      shareLink.href = createShareUrl(state);
      shareLink.setAttribute("aria-label", `Compartir cálculo de ${formatDuration(state.realSeconds)}`);
    }
    syncTicket(state);
  }

  [sizeInput, sizeUnit].forEach((control) => {
    control.addEventListener("input", update);
    control.addEventListener("change", update);
  });

  async function downloadSpeedProbe(requestedBytes, signal) {
    const url = new URL(SPEED_TEST_ENDPOINT);
    url.searchParams.set("bytes", String(requestedBytes));
    url.searchParams.set("cacheBust", `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const startedAt = performance.now();
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      referrerPolicy: "no-referrer",
      signal,
    });
    if (!response.ok) throw new Error(`El servidor de medición respondió ${response.status}.`);
    const data = await response.arrayBuffer();
    const seconds = (performance.now() - startedAt) / 1000;
    if (!data.byteLength || seconds <= 0) throw new Error("La prueba no recibió datos suficientes.");
    return { bytes: data.byteLength, seconds, mbps: (data.byteLength * 8) / seconds / 1_000_000 };
  }

  async function measureDownloadSpeed(onProgress) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const first = await downloadSpeedProbe(FIRST_PROBE_BYTES, controller.signal);
      if (navigator.connection?.saveData || first.seconds >= 0.9) return first;

      onProgress("Ajustando la medición con una descarga algo mayor…");
      const targetBytes = (mbps) => Math.min(MAX_PROBE_BYTES, Math.max(FIRST_PROBE_BYTES, Math.round(mbps * 112_500)));
      const second = await downloadSpeedProbe(targetBytes(first.mbps), controller.signal);
      if (second.seconds >= 0.65) return second;

      onProgress("Comprobando la estabilidad de la velocidad…");
      const third = await downloadSpeedProbe(targetBytes(second.mbps), controller.signal);
      return {
        bytes: second.bytes + third.bytes,
        seconds: second.seconds + third.seconds,
        mbps: ((second.bytes + third.bytes) * 8) / (second.seconds + third.seconds) / 1_000_000,
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  measureSpeedButton.addEventListener("click", async () => {
    if (isMeasuringSpeed) return;
    isMeasuringSpeed = true;
    speedTestStatus.dataset.state = "";
    speedTestStatus.textContent = "Midiendo la descarga hacia Cloudflare…";
    void updateSpeedTesterCount(true);
    update();
    try {
      const result = await measureDownloadSpeed((message) => { speedTestStatus.textContent = message; });
      measuredSpeedMbps = clamp(result.mbps, 0.1, 100_000);
      speedTestStatus.dataset.state = "success";
      speedTestStatus.textContent = `Velocidad medida: ${formatSpeed(measuredSpeedMbps)}. El resultado puede variar según la red y el servidor del juego.`;
      update();
    } catch (error) {
      speedTestStatus.dataset.state = "error";
      speedTestStatus.textContent = error.name === "AbortError"
        ? "La medición superó los 30 segundos. Revisa la conexión y vuelve a intentarlo."
        : `No se pudo medir la velocidad. ${error.message || "Revisa la conexión y vuelve a intentarlo."}`;
    } finally {
      isMeasuringSpeed = false;
      update();
    }
  });

  let speedCounterRequestVersion = 0;
  async function updateSpeedTesterCount(increment = false) {
    const requestVersion = ++speedCounterRequestVersion;
    const url = new URL(SPEED_TEST_COUNTER_ENDPOINT);
    url.searchParams.set("unique", "true");
    if (!increment) url.searchParams.set("readOnly", "true");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(url, {
        cache: "no-store",
        credentials: "omit",
        mode: "cors",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`CounterAPI respondió ${response.status}.`);
      const payload = await response.json();
      const count = Number(payload.value);
      if (!Number.isFinite(count) || count < 0) throw new Error("La respuesta no contiene un total válido.");
      if (requestVersion !== speedCounterRequestVersion) return;
      speedTesterCount.textContent = formatNumber(Math.floor(count));
      speedTesterCountStatus.dataset.state = "success";
      speedTesterCountStatus.textContent = "Total global actualizado.";
    } catch {
      if (requestVersion !== speedCounterRequestVersion) return;
      speedTesterCount.textContent = "—";
      speedTesterCountStatus.dataset.state = "error";
      speedTesterCountStatus.textContent = increment
        ? "No se pudo actualizar el contador ahora; la medición de velocidad continúa."
        : "El contador global no está disponible ahora.";
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function saveAvatar(dataUrl, message) {
    currentAvatarData = dataUrl;
    ticketAvatar.src = dataUrl;
    try {
      window.localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
      avatarStatus.textContent = message;
    } catch {
      avatarStatus.textContent = "Foto activa; el navegador no permitió guardarla en su almacenamiento local.";
    }
  }

  function imageToAvatarDataUrl(image) {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error("La imagen no tiene un tamaño válido.");
    const side = 420;
    const crop = Math.min(width, height);
    const sourceX = (width - crop) / 2;
    const sourceY = (height - crop) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo procesar la imagen.");
    context.fillStyle = "#17151d";
    context.fillRect(0, 0, side, side);
    context.drawImage(image, sourceX, sourceY, crop, crop, 0, 0, side, side);
    return canvas.toDataURL("image/jpeg", 0.86);
  }

  function parseSocialProfile(rawValue) {
    let provider = socialPlatform.value;
    let username = rawValue.trim();
    let isProfileUrl = false;
    if (!username) throw new Error("Escribe un usuario o pega el enlace de su perfil.");

    if (/^(https?:\/\/|www\.|(x\.com|twitter\.com|instagram\.com)\/)/i.test(username)) {
      const profileUrl = new URL(username.startsWith("http") ? username : `https://${username}`);
      const host = profileUrl.hostname.toLowerCase().replace(/^www\./, "");
      if (host === "instagram.com") provider = "instagram";
      else if (host === "x.com" || host === "twitter.com") provider = "x";
      else throw new Error("Usa un enlace de perfil de X o Instagram.");
      isProfileUrl = true;
      username = profileUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    username = username.replace(/^@/, "").replace(/\/$/, "");
    const reservedRoutes = provider === "instagram"
      ? ["p", "reel", "reels", "stories", "explore", "direct", "accounts"]
      : ["home", "search", "explore", "i", "intent", "compose", "settings", "messages", "notifications", "hashtag"];
    if (isProfileUrl && reservedRoutes.includes(username.toLowerCase())) {
      throw new Error("Pega el enlace principal del perfil, no el de una publicación o sección.");
    }
    const valid = provider === "instagram" ? /^[A-Za-z0-9._]{1,30}$/ : /^[A-Za-z0-9_]{1,15}$/;
    if (!valid.test(username)) throw new Error("Ese usuario no parece válido para la red elegida.");
    socialPlatform.value = provider;
    return { provider, username };
  }

  try {
    const cachedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (cachedAvatar?.startsWith("data:image/")) {
      currentAvatarData = cachedAvatar;
      ticketAvatar.src = cachedAvatar;
      avatarStatus.textContent = "Foto recuperada de este navegador.";
    }
  } catch {
    avatarStatus.textContent = "La foto solo estará disponible durante esta sesión.";
  }

  fetchAvatarButton.addEventListener("click", () => {
    let profile;
    try {
      profile = parseSocialProfile(socialHandle.value);
    } catch (error) {
      avatarStatus.textContent = error.message;
      socialHandle.focus();
      return;
    }

    const remoteUrl = `https://unavatar.io/${profile.provider}/${encodeURIComponent(profile.username)}?fallback=false`;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.referrerPolicy = "no-referrer";
    fetchAvatarButton.disabled = true;
    avatarStatus.textContent = `Buscando la foto pública de @${profile.username}…`;
    const timeout = window.setTimeout(() => {
      image.onload = null;
      image.onerror = null;
      image.src = "";
      fetchAvatarButton.disabled = false;
      avatarStatus.textContent = "La búsqueda tardó demasiado. Prueba otra vez o sube la foto.";
    }, 12000);
    image.onload = () => {
      window.clearTimeout(timeout);
      try {
        const dataUrl = imageToAvatarDataUrl(image);
        saveAvatar(dataUrl, "Foto guardada solo en este navegador.");
      } catch {
        avatarStatus.textContent = "No se pudo guardar la respuesta de la red. Sube una imagen para descargar el billete con foto.";
      }
      fetchAvatarButton.disabled = false;
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      fetchAvatarButton.disabled = false;
      avatarStatus.textContent = "No se encontró una foto pública. Comprueba el usuario o sube una imagen.";
    };
    image.src = remoteUrl;
  });

  avatarFileInput.addEventListener("change", async () => {
    const file = avatarFileInput.files?.[0];
    avatarFileInput.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      avatarStatus.textContent = "Elige un archivo de imagen.";
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      avatarStatus.textContent = "La foto debe pesar menos de 12 MB.";
      return;
    }
    avatarStatus.textContent = "Preparando la foto en este navegador…";
    try {
      const bitmap = await createImageBitmap(file);
      const dataUrl = imageToAvatarDataUrl(bitmap);
      bitmap.close?.();
      saveAvatar(dataUrl, "Foto guardada solo en este navegador.");
    } catch {
      avatarStatus.textContent = "No se pudo abrir esa imagen. Prueba con JPG, PNG o WebP.";
    }
  });

  clearAvatarButton.addEventListener("click", () => {
    currentAvatarData = "";
    ticketAvatar.src = AVATAR_PLACEHOLDER;
    try { window.localStorage.removeItem(AVATAR_STORAGE_KEY); } catch { /* La foto solo vivía en memoria. */ }
    avatarStatus.textContent = "Foto eliminada de este navegador.";
  });

  passengerInput.addEventListener("input", () => syncTicket());
  originInput.addEventListener("input", () => syncTicket());

  newTicketSerialButton.addEventListener("click", () => {
    ticketSerial = createSerial();
    try { window.localStorage.setItem(SERIAL_STORAGE_KEY, ticketSerial); } catch { /* El número sigue activo en esta sesión. */ }
    syncTicket();
    ticketFeedback.textContent = "Se ha creado un nuevo número de serie.";
    window.setTimeout(() => { ticketFeedback.textContent = ""; }, 3000);
  });

  function loadCanvasImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = source;
      if (image.complete && image.naturalWidth) resolve(image);
    });
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  async function createTicketPng() {
    const state = getState();
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 960;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar el billete.");

    const [logo, mark, avatar] = await Promise.all([
      loadCanvasImage("assets/gta-vi-logo.png"),
      loadCanvasImage("assets/vi-tropical-mark.png"),
      loadCanvasImage(currentAvatarData || AVATAR_PLACEHOLDER),
    ]);

    const x = 42;
    const y = 42;
    const width = 1516;
    const height = 876;
    const stubWidth = 322;
    const splitX = x + width - stubWidth;
    roundedRect(context, x, y, width, height, 34);
    context.save();
    context.clip();
    const background = context.createLinearGradient(x, y, splitX, y + height);
    background.addColorStop(0, "#11131b");
    background.addColorStop(1, "#1b1a27");
    context.fillStyle = background;
    context.fillRect(x, y, width, height);

    context.save();
    context.globalAlpha = 0.13;
    context.globalCompositeOperation = "screen";
    context.drawImage(mark, splitX - 670, y + 130, 600, 455);
    context.restore();

    context.fillStyle = "#f2edf0";
    context.fillRect(splitX, y, stubWidth, height);
    context.restore();

    context.strokeStyle = "rgba(255,255,255,.15)";
    context.lineWidth = 2;
    roundedRect(context, x, y, width, height, 34);
    context.stroke();
    context.save();
    context.setLineDash([10, 12]);
    context.strokeStyle = "rgba(30,24,33,.52)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(splitX, y + 12);
    context.lineTo(splitX, y + height - 12);
    context.stroke();
    context.restore();

    const name = passengerInput.value.trim() || "Viajero/a";
    const origin = originInput.value.trim() || "Mi conexión";
    const speed = formatSpeed(state.speedInMbps);
    const time = formatDuration(state.realSeconds);
    const drawLabel = (text, px, py, color = "#8d8993", size = 16) => {
      context.fillStyle = color;
      context.font = `700 ${size}px Arial, sans-serif`;
      context.letterSpacing = "2px";
      context.fillText(text.toLocaleUpperCase("es-ES"), px, py);
      context.letterSpacing = "0px";
    };
    const drawValue = (text, px, py, color = "#f7f5f3", size = 26, maxWidth = 500) => {
      context.fillStyle = color;
      context.font = `700 ${size}px Arial, sans-serif`;
      context.fillText(text, px, py, maxWidth);
    };

    context.drawImage(logo, x + 52, y + 38, 172, 132);
    drawLabel("LEONIDA DOWNLOAD AIR", x + 258, y + 66, "#ff9ccf", 16);
    drawValue("PASE DE EMBARQUE", x + 258, y + 112, "#f7f5f3", 34, 600);
    drawLabel("NÚMERO DE SERIE", splitX - 290, y + 61, "#8d8993", 12);
    drawValue(ticketSerial, splitX - 290, y + 99, "#7be6e8", 20, 255);
    context.strokeStyle = "rgba(255,255,255,.12)";
    context.beginPath();
    context.moveTo(x + 52, y + 183);
    context.lineTo(splitX - 52, y + 183);
    context.stroke();

    const rowY = y + 285;
    drawLabel("ORIGEN", x + 58, rowY, "#85818b", 14);
    drawValue(origin.toLocaleUpperCase("es-ES"), x + 58, rowY + 58, "#f7f5f3", 34, 365);
    drawLabel("TU CONEXIÓN", x + 58, rowY + 92, "#85818b", 12);

    const routeMidX = x + 545;
    context.strokeStyle = "rgba(255,156,207,.66)";
    context.lineWidth = 2;
    context.setLineDash([9, 9]);
    context.beginPath();
    context.moveTo(x + 410, rowY + 46);
    context.lineTo(routeMidX + 58, rowY + 46);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#ff9ccf";
    context.beginPath();
    context.moveTo(routeMidX + 76, rowY + 46);
    context.lineTo(routeMidX + 58, rowY + 35);
    context.lineTo(routeMidX + 58, rowY + 57);
    context.closePath();
    context.fill();

    drawLabel("DESTINO", x + 700, rowY, "#85818b", 14);
    drawValue("LEONIDA", x + 700, rowY + 58, "#ff9ccf", 42, 380);
    drawLabel("VICE CITY · USA", x + 700, rowY + 92, "#85818b", 12);
    context.strokeStyle = "rgba(255,255,255,.12)";
    context.beginPath();
    context.moveTo(x + 52, y + 442);
    context.lineTo(splitX - 52, y + 442);
    context.stroke();

    drawLabel("PASAJERO", x + 58, y + 499, "#85818b", 13);
    drawValue(name.toLocaleUpperCase("es-ES"), x + 58, y + 548, "#f7f5f3", 25, 525);
    drawLabel("TIEMPO DE VIAJE", x + 642, y + 499, "#85818b", 13);
    drawValue(time, x + 642, y + 550, "#ff9ccf", 38, 470);

    const details = [
      ["TAMAÑO", prettySize(state.size, state.sizeUnit)],
      ["VELOCIDAD", speed],
      ["RENDIMIENTO", `${state.efficiency}%`],
      ["ASIENTO", `VI-${ticketSerial.slice(-3)}`],
    ];
    details.forEach(([label, value], index) => {
      const detailX = x + 58 + index * 258;
      drawLabel(label, detailX, y + 640, "#85818b", 11);
      drawValue(value, detailX, y + 681, "#f1eef2", 20, 225);
    });
    context.strokeStyle = "rgba(255,255,255,.12)";
    context.beginPath();
    context.moveTo(x + 52, y + 730);
    context.lineTo(splitX - 52, y + 730);
    context.stroke();
    drawLabel("RUTA VI · DESCARGA ESTIMADA", x + 58, y + 788, "#77737d", 11);
    drawLabel("PROYECTO NO OFICIAL · MARCAS DE SUS TITULARES", splitX - 426, y + 788, "#77737d", 11);

    const avatarX = splitX + stubWidth / 2;
    const avatarY = y + 300;
    context.save();
    context.beginPath();
    context.arc(avatarX, avatarY, 93, 0, Math.PI * 2);
    context.clip();
    context.drawImage(avatar, avatarX - 93, avatarY - 93, 186, 186);
    context.restore();
    context.strokeStyle = "#fff";
    context.lineWidth = 8;
    context.beginPath();
    context.arc(avatarX, avatarY, 97, 0, Math.PI * 2);
    context.stroke();

    context.textAlign = "center";
    drawLabel("PASAJERO", avatarX, y + 440, "#77727b", 12);
    drawValue(name.toLocaleUpperCase("es-ES"), avatarX, y + 478, "#17151c", 19, stubWidth - 46);
    const barcodeTop = y + 550;
    let barX = splitX + 76;
    [...createBarcodePattern(ticketSerial, 52)].forEach((bit, index) => {
      const barWidth = bit === "1" ? (index % 5 === 0 ? 4 : 3) : 1.5;
      context.fillStyle = "#211d25";
      context.fillRect(barX, barcodeTop, barWidth, 72);
      barX += barWidth + 2;
    });
    drawValue(ticketSerial, avatarX, y + 677, "#312b34", 17, stubWidth - 50);
    drawLabel("PASE DIGITAL · SOLO RECUERDO", avatarX, y + 727, "#77727b", 9);
    context.textAlign = "start";

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo generar el archivo PNG.")), "image/png");
    });
  }

  ticketDownloadButton.addEventListener("click", async () => {
    ticketDownloadButton.disabled = true;
    ticketFeedback.textContent = "Preparando tu billete…";
    try {
      const blob = await createTicketPng();
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `billete-leonida-${ticketSerial.toLowerCase()}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      ticketFeedback.textContent = "Billete descargado en formato PNG.";
    } catch (error) {
      ticketFeedback.textContent = error.message || "No se pudo descargar el billete.";
    }
    ticketDownloadButton.disabled = false;
    window.setTimeout(() => { ticketFeedback.textContent = ""; }, 4000);
  });

  copyButton.addEventListener("click", async () => {
    const state = getState();
    const text = `GTA VI: estimación de descarga de ${prettySize(state.size, state.sizeUnit)} en ${formatDuration(state.realSeconds)} con ${formatSpeed(state.speedInMbps)} (${state.efficiency}% de rendimiento). ${createShareUrl(state)}`;
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

  void updateSpeedTesterCount();
  update();

  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");
  const heroMark = document.querySelector(".hero-vi-mark");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let framePending = false;
  const updateScrollEffects = () => {
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    document.documentElement.style.setProperty("--scroll-progress", String(scrollProgress));
    if (!reduceMotion.matches && hero) {
      const heroProgress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      heroImage?.style.setProperty("--parallax-y", `${-heroProgress * 28}px`);
      heroMark?.style.setProperty("--mark-parallax-y", `${-heroProgress * 18}px`);
    }
    framePending = false;
  };
  const requestScrollUpdate = () => {
    if (!framePending) {
      window.requestAnimationFrame(updateScrollEffects);
      framePending = true;
    }
  };
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  updateScrollEffects();

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const revealItems = [...document.querySelectorAll(".trust-item, .ticket-form, .boarding-pass, .wallpaper-card, .method-step, .size-note, .interest-link")];
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${(index % 3) * 65}ms`);
    });
    document.documentElement.classList.add("reveal-motion");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }
})();

