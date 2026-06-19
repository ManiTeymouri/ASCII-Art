// ====== DOM Elements ======
const upload = document.getElementById("upload");
const dropZone = document.getElementById("dropZone");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");
const asciiElement = document.getElementById("ascii");
const previewImage = document.getElementById("previewImage");
const placeholder = document.getElementById("placeholder");
const loading = document.getElementById("loading");
const fileNameDisplay = document.getElementById("fileNameDisplay");

// Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const tabImage = document.getElementById("tabImage");
const tabAscii = document.getElementById("tabAscii");

// Controls
const widthSlider = document.getElementById("widthSlider");
const ratioSlider = document.getElementById("ratioSlider");
const contrastSlider = document.getElementById("contrastSlider");
const brightnessSlider = document.getElementById("brightnessSlider");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const qualitySelect = document.getElementById("qualitySelect");
const colorModeCheck = document.getElementById("colorMode");
const invertModeCheck = document.getElementById("invertMode");
const themeToggle = document.getElementById("themeToggle");
const rotateBtns = document.querySelectorAll(".rotate-btn");

// Color Picker
const textColorPicker = document.getElementById("textColorPicker");
const textColorHex = document.getElementById("textColorHex");
const colorPreview = document.getElementById("colorPreview");
const resetColorBtn = document.getElementById("resetColorBtn");
const colorPresets = document.querySelectorAll(".color-preset");

// Buttons & Info
const processBtn = document.getElementById("processBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadSvgBtn = document.getElementById("downloadSvgBtn");
const downloadPngBtn = document.getElementById("downloadPngBtn");
const downloadHtmlBtn = document.getElementById("downloadHtmlBtn");
const clearBtn = document.getElementById("clearBtn");
const dimensionsEl = document.getElementById("dimensions");
const charCountEl = document.getElementById("charCount");
const processingTimeEl = document.getElementById("processingTime");
const widthValue = document.getElementById("widthValue");
const ratioValue = document.getElementById("ratioValue");
const contrastValue = document.getElementById("contrastValue");
const brightnessValue = document.getElementById("brightnessValue");

// ====== ASCII Characters - FULL ======
const ASCII_CHARS = [
  " ",
  ".",
  ",",
  ":",
  ";",
  "!",
  "?",
  "+",
  "-",
  "=",
  "*",
  "/",
  "\\",
  "|",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "<",
  ">",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
  "%",
  "&",
  "@",
  "$",
];

// ====== State ======
let darkMode = true;
let currentRotation = 0;
let currentImage = null;
let currentImageFile = null;
let currentAscii = "";
let currentAsciiData = [];
let currentWidth = 0;
let currentHeight = 0;
let isProcessing = false;
let currentTab = "image";
let customTextColor = "#e6edf3";

// ====== Theme ======
themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("light-mode", !darkMode);
  themeToggle.textContent = darkMode ? "🌙" : "☀️";

  const defaultColor = darkMode ? "#e6edf3" : "#1f2328";
  if (
    !textColorPicker.value ||
    textColorPicker.value === "#e6edf3" ||
    textColorPicker.value === "#1f2328"
  ) {
    textColorPicker.value = defaultColor;
    textColorHex.value = defaultColor;
    colorPreview.style.backgroundColor = defaultColor;
    customTextColor = defaultColor;
  }

  if (currentAsciiData.length > 0) {
    renderImageTab();
    updateAsciiColors();
  }
});

// ====== Update Labels ======
widthSlider.addEventListener("input", () => {
  widthValue.textContent = widthSlider.value;
});

ratioSlider.addEventListener("input", () => {
  ratioValue.textContent = ratioSlider.value;
});

contrastSlider.addEventListener("input", () => {
  contrastValue.textContent = contrastSlider.value;
});

brightnessSlider.addEventListener("input", () => {
  brightnessValue.textContent = brightnessSlider.value;
});

// ====== Color Picker ======
textColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  customTextColor = color;
  textColorHex.value = color;
  colorPreview.style.backgroundColor = color;

  if (currentAsciiData.length > 0) {
    renderImageTab();
    updateAsciiColors();
  }
});

textColorHex.addEventListener("input", (e) => {
  let color = e.target.value.trim();
  if (color && !color.startsWith("#")) {
    color = "#" + color;
  }
  if (/^#[0-9a-f]{6}$/i.test(color) || /^#[0-9a-f]{3}$/i.test(color)) {
    customTextColor = color;
    textColorPicker.value = color;
    colorPreview.style.backgroundColor = color;

    if (currentAsciiData.length > 0) {
      renderImageTab();
      updateAsciiColors();
    }
  }
});

resetColorBtn.addEventListener("click", () => {
  const defaultColor = darkMode ? "#e6edf3" : "#1f2328";
  customTextColor = defaultColor;
  textColorPicker.value = defaultColor;
  textColorHex.value = defaultColor;
  colorPreview.style.backgroundColor = defaultColor;

  if (currentAsciiData.length > 0) {
    renderImageTab();
    updateAsciiColors();
  }
});

colorPresets.forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.style.backgroundColor;
    let hexColor = color;
    if (color.includes("rgb")) {
      const rgb = color.match(/\d+/g);
      if (rgb) {
        hexColor =
          "#" +
          rgb.map((c) => parseInt(c).toString(16).padStart(2, "0")).join("");
      }
    }
    customTextColor = hexColor;
    textColorPicker.value = hexColor;
    textColorHex.value = hexColor;
    colorPreview.style.backgroundColor = hexColor;

    if (currentAsciiData.length > 0) {
      renderImageTab();
      updateAsciiColors();
    }
  });
});

// ====== Tabs ======
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tabName = btn.dataset.tab;
    currentTab = tabName;

    tabContents.forEach((content) => content.classList.remove("active"));

    if (tabName === "image") {
      tabImage.classList.add("active");
      renderImageTab();
    } else {
      tabAscii.classList.add("active");
    }
  });
});

// ====== Rotate Buttons ======
rotateBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    rotateBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentRotation = parseInt(btn.dataset.degrees);
    if (currentImage) {
      processImage();
    }
  });
});

document
  .querySelector('.rotate-btn[data-degrees="0"]')
  ?.classList.add("active");

// ====== Generate File Name ======
function generateFileName(originalName, quality) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hours}-${minutes}-${seconds}`;

  const nameWithoutExt = originalName
    ? originalName.replace(/\.[^/.]+$/, "")
    : "image";

  const qualityNames = {
    720: "HD",
    1080: "FHD",
    1440: "2K",
    2160: "4K",
    4320: "8K",
  };
  const qualityName = qualityNames[quality] || quality;

  return `${dateStr}_${timeStr}_${nameWithoutExt}_${qualityName}`;
}

// ====== Image Processing ======

function rotateImageData(imageData, degrees) {
  if (degrees === 0) return imageData;

  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;

  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const newWidth = Math.floor(Math.abs(width * cos) + Math.abs(height * sin));
  const newHeight = Math.floor(Math.abs(width * sin) + Math.abs(height * cos));

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;
  const tempCtx = tempCanvas.getContext("2d");

  const output = tempCtx.createImageData(newWidth, newHeight);
  const dst = output.data;

  const cx = width / 2;
  const cy = height / 2;
  const ncx = newWidth / 2;
  const ncy = newHeight / 2;

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const dx = x - ncx;
      const dy = y - ncy;

      const sx = Math.round(dx * cos + dy * sin + cx);
      const sy = Math.round(-dx * sin + dy * cos + cy);

      const dstIdx = (y * newWidth + x) * 4;

      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const srcIdx = (sy * width + sx) * 4;
        dst[dstIdx] = src[srcIdx];
        dst[dstIdx + 1] = src[srcIdx + 1];
        dst[dstIdx + 2] = src[srcIdx + 2];
        dst[dstIdx + 3] = src[srcIdx + 3];
      } else {
        dst[dstIdx] = 0;
        dst[dstIdx + 1] = 0;
        dst[dstIdx + 2] = 0;
        dst[dstIdx + 3] = 255;
      }
    }
  }

  return {
    data: dst,
    width: newWidth,
    height: newHeight,
  };
}

function denoiseImageLight(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const output = new Uint8ClampedArray(src);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const centerIndex = (y * width + x) * 4 + c;
        const center = src[centerIndex];

        let sum = 0;
        let count = 0;
        let diffSum = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            if (ky === 0 && kx === 0) continue;
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
            const val = src[pixelIndex];
            sum += val;
            count++;
            diffSum += Math.abs(val - center);
          }
        }

        const avg = sum / count;
        const avgDiff = diffSum / count;

        if (avgDiff > 30) {
          const blend = 0.4;
          output[centerIndex] = Math.round(center * (1 - blend) + avg * blend);
        } else {
          output[centerIndex] = center;
        }
      }
    }
  }

  return {
    data: output,
    width: width,
    height: height,
  };
}

function sharpenImageAdaptive(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const output = new Uint8ClampedArray(src);

  const laplacian = [0, -1, 0, -1, 4, -1, 0, -1, 0];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const centerIndex = (y * width + x) * 4 + c;
        const center = src[centerIndex];

        let laplacianVal = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const weight = laplacian[(ky + 1) * 3 + (kx + 1)];
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
            laplacianVal += src[pixelIndex] * weight;
          }
        }

        const absLaplacian = Math.abs(laplacianVal);
        if (absLaplacian > 20) {
          const strength = Math.min(0.3, absLaplacian / 200);
          const sharpened = center + laplacianVal * strength;
          output[centerIndex] = Math.max(0, Math.min(255, sharpened));
        } else {
          output[centerIndex] = center;
        }
      }
    }
  }

  return {
    data: output,
    width: width,
    height: height,
  };
}

function unsharpMask(imageData, amount = 0.2, radius = 1) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const output = new Uint8ClampedArray(src);

  const blurred = new Uint8ClampedArray(src);
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let count = 0;
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += src[pixelIndex];
            count++;
          }
        }
        const target = (y * width + x) * 4 + c;
        blurred[target] = Math.round(sum / count);
      }
    }
  }

  for (let i = 0; i < src.length; i++) {
    const diff = src[i] - blurred[i];
    output[i] = Math.max(0, Math.min(255, src[i] + amount * diff));
  }

  return {
    data: output,
    width: width,
    height: height,
  };
}

function applyBrightness(imageData, brightnessPercent) {
  const src = imageData.data;
  const output = new Uint8ClampedArray(src);
  const factor = brightnessPercent / 100;

  for (let i = 0; i < src.length; i++) {
    output[i] = Math.max(0, Math.min(255, Math.round(src[i] * factor)));
  }

  return {
    data: output,
    width: imageData.width,
    height: imageData.height,
  };
}

function convertImageToAscii(
  img,
  width,
  ratio,
  contrast,
  brightness,
  colorMode,
  invert,
  rotation,
) {
  const height = Math.floor(img.height * (width / img.width) * ratio);

  const maxHeight = 450;
  let finalWidth = width;
  let finalHeight = height;

  if (height > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = Math.floor(width * (maxHeight / height));
  }

  const processingWidth = Math.min(600, finalWidth * 1.2);
  const processingHeight = Math.floor(
    processingWidth * (finalHeight / finalWidth),
  );

  canvas.width = Math.floor(processingWidth);
  canvas.height = Math.floor(processingHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (rotation !== 0) {
    const rotated = rotateImageData(imageData, rotation);
    imageData = {
      data: rotated.data,
      width: rotated.width,
      height: rotated.height,
    };
  }

  let result = denoiseImageLight(imageData);
  imageData = {
    data: result.data,
    width: result.width,
    height: result.height,
  };

  result = sharpenImageAdaptive(imageData);
  imageData = {
    data: result.data,
    width: result.width,
    height: result.height,
  };

  result = unsharpMask(imageData, 0.15, 1);
  imageData = {
    data: result.data,
    width: result.width,
    height: result.height,
  };

  result = applyBrightness(imageData, brightness);
  imageData = {
    data: result.data,
    width: result.width,
    height: result.height,
  };

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = finalWidth;
  tempCanvas.height = finalHeight;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = "high";

  const resizedImageData = tempCtx.createImageData(finalWidth, finalHeight);
  const srcPixels = imageData.data;
  const dstPixels = resizedImageData.data;

  const scaleX = imageData.width / finalWidth;
  const scaleY = imageData.height / finalHeight;

  for (let y = 0; y < finalHeight; y++) {
    for (let x = 0; x < finalWidth; x++) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      const srcIndex = (srcY * imageData.width + srcX) * 4;
      const dstIndex = (y * finalWidth + x) * 4;

      dstPixels[dstIndex] = srcPixels[srcIndex];
      dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
      dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
      dstPixels[dstIndex + 3] = 255;
    }
  }

  const finalImageData = {
    data: dstPixels,
    width: finalWidth,
    height: finalHeight,
  };

  const pixels = finalImageData.data;
  let ascii = "";
  let asciiData = [];

  let minGray = 255;
  let maxGray = 0;
  const grays = [];

  for (let y = 0; y < finalHeight; y++) {
    for (let x = 0; x < finalWidth; x++) {
      const index = (y * finalWidth + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;

      grays.push(gray);
      if (gray < minGray) minGray = gray;
      if (gray > maxGray) maxGray = gray;
    }
  }

  const range = maxGray - minGray;
  const hasRange = range > 0;

  let grayIndex = 0;
  for (let y = 0; y < finalHeight; y++) {
    for (let x = 0; x < finalWidth; x++) {
      const index = (y * finalWidth + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];

      let gray = grays[grayIndex++];

      if (contrast !== 0) {
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        gray = factor * (gray - 128) + 128;
      }

      if (hasRange) {
        gray = ((gray - minGray) / range) * 255;
      }

      gray = Math.max(0, Math.min(255, gray));

      if (invert) {
        gray = 255 - gray;
      }

      const normalized = gray / 255;
      const charIndex = Math.floor(normalized * (ASCII_CHARS.length - 1));
      const char = ASCII_CHARS[charIndex];

      asciiData.push({
        char: char,
        r: r,
        g: g,
        b: b,
        gray: gray,
      });

      if (colorMode) {
        let rColor = Math.floor(r * 0.95);
        let gColor = Math.floor(g * 0.95);
        let bColor = Math.floor(b * 0.95);

        if (invert) {
          rColor = 255 - rColor;
          gColor = 255 - gColor;
          bColor = 255 - bColor;
        }

        ascii += `<span class="color-char" style="color:rgb(${rColor},${gColor},${bColor});">${char}</span>`;
      } else {
        ascii += `<span class="color-char" style="color:${customTextColor};">${char}</span>`;
      }
    }
    ascii += "\n";
  }

  return { ascii, width: finalWidth, height: finalHeight, asciiData };
}

// ====== Update ASCII Colors ======
function updateAsciiColors() {
  if (!currentAscii || !currentAsciiData) return;

  const colorMode = colorModeCheck.checked;

  if (!colorMode && currentAsciiData.length > 0) {
    let newAscii = "";
    let index = 0;
    for (let y = 0; y < currentHeight; y++) {
      for (let x = 0; x < currentWidth; x++) {
        const data = currentAsciiData[index++];
        if (!data) continue;
        newAscii += `<span class="color-char" style="color:${customTextColor};">${data.char}</span>`;
      }
      newAscii += "\n";
    }
    asciiElement.innerHTML = newAscii;
  }
}

// ====== Render Image Tab ======
function renderImageTab() {
  if (!currentAsciiData || currentAsciiData.length === 0) return;

  const charSize = 8;
  const lineHeight = charSize * 1.15;
  const width = currentWidth;
  const height = currentHeight;

  imageCanvas.width = width * charSize;
  imageCanvas.height = height * lineHeight;

  const bgColor = darkMode ? "#0d1117" : "#ffffff";
  imageCtx.fillStyle = bgColor;
  imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

  imageCtx.font = `${charSize}px "Courier New", "Consolas", monospace`;
  imageCtx.textBaseline = "top";
  imageCtx.textAlign = "left";

  const colorMode = colorModeCheck.checked;
  const invert = invertModeCheck.checked;
  const brightness = parseInt(brightnessSlider.value);
  const brightnessFactor = brightness / 100;

  let index = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const data = currentAsciiData[index++];
      if (!data) continue;

      let color;
      if (colorMode) {
        let r = Math.min(255, Math.floor(data.r * brightnessFactor));
        let g = Math.min(255, Math.floor(data.g * brightnessFactor));
        let b = Math.min(255, Math.floor(data.b * brightnessFactor));

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        color = `rgb(${r},${g},${b})`;
      } else {
        color = customTextColor;
      }

      imageCtx.fillStyle = color;
      imageCtx.fillText(data.char, x * charSize, y * lineHeight);
    }
  }
}

// ====== Display ASCII ======
function displayAscii(ascii, width, height, processingTime) {
  currentAscii = ascii;

  if (typeof ascii === "string" && ascii.includes("<span")) {
    asciiElement.innerHTML = ascii;
  } else {
    asciiElement.textContent = ascii;
  }

  asciiElement.style.whiteSpace = "pre";
  asciiElement.style.wordWrap = "normal";
  asciiElement.style.wordBreak = "normal";
  asciiElement.style.overflowWrap = "normal";
  asciiElement.style.direction = "ltr";
  asciiElement.style.textAlign = "left";

  dimensionsEl.textContent = `${width} × ${height}`;
  const charCount = ascii.replace(/\n/g, "").replace(/<[^>]*>/g, "").length;
  charCountEl.textContent = charCount.toLocaleString();

  if (processingTime) {
    processingTimeEl.textContent = `⏱️ ${processingTime.toFixed(2)}ms`;
  }

  renderImageTab();

  if (currentTab === "image") {
    tabImage.classList.add("active");
    tabAscii.classList.remove("active");
  }

  loading.classList.remove("active");
}

// ====== Download Functions ======

// ====== Download PNG ======
function downloadPNG(
  asciiData,
  width,
  height,
  colorMode,
  invert,
  brightness,
  quality,
  fileName,
) {
  const targetWidth = parseInt(quality);
  const targetHeight = Math.floor(targetWidth * (height / width));

  const charSize = Math.floor(targetWidth / width);
  const lineHeight = charSize * 1.15;

  const finalWidth = width * charSize;
  const finalHeight = height * lineHeight;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = finalWidth;
  tempCanvas.height = finalHeight;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = "high";

  const bgColor = darkMode ? "#0d1117" : "#ffffff";
  tempCtx.fillStyle = bgColor;
  tempCtx.fillRect(0, 0, finalWidth, finalHeight);

  tempCtx.font = `${charSize}px "Courier New", "Consolas", monospace`;
  tempCtx.textBaseline = "top";
  tempCtx.textAlign = "left";

  const brightnessFactor = brightness / 100;

  let index = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const data = asciiData[index++];
      if (!data) continue;

      let color;
      if (colorMode) {
        let r = Math.min(255, Math.floor(data.r * brightnessFactor));
        let g = Math.min(255, Math.floor(data.g * brightnessFactor));
        let b = Math.min(255, Math.floor(data.b * brightnessFactor));

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        color = `rgb(${r},${g},${b})`;
      } else {
        color = customTextColor;
      }

      tempCtx.fillStyle = color;
      tempCtx.fillText(data.char, x * charSize, y * lineHeight);
    }
  }

  try {
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error creating PNG:", error);
    alert(
      "Error creating PNG. The image may be too large. Please reduce quality.",
    );
  }
}

// ====== Download SVG ======
function downloadSVG(
  asciiData,
  width,
  height,
  colorMode,
  invert,
  brightness,
  fileName,
) {
  const charWidth = 8;
  const charHeight = 10;
  const padding = 10;

  const svgWidth = width * charWidth + padding * 2;
  const svgHeight = height * charHeight + padding * 2;

  const bgColor = darkMode ? "#0d1117" : "#ffffff";

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:${bgColor};">\n`;
  svgContent += `<style>text { font-family: "Courier New", monospace; font-size: ${charHeight}px; }</style>\n`;

  const brightnessFactor = brightness / 100;

  let index = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const data = asciiData[index++];
      if (!data) continue;

      const posX = x * charWidth + padding;
      const posY = y * charHeight + padding + charHeight;

      let color;
      if (colorMode) {
        let r = Math.min(255, Math.floor(data.r * brightnessFactor));
        let g = Math.min(255, Math.floor(data.g * brightnessFactor));
        let b = Math.min(255, Math.floor(data.b * brightnessFactor));

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        color = `rgb(${r},${g},${b})`;
      } else {
        color = customTextColor;
      }

      svgContent += `<text x="${posX}" y="${posY}" fill="${color}">${data.char}</text>\n`;
    }
  }

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ====== Download HTML ======
function downloadHTML(
  asciiData,
  width,
  height,
  colorMode,
  invert,
  brightness,
  quality,
  fileName,
) {
  const fontSize = parseInt(fontSizeSelect.value);

  let asciiHTML = "";
  const brightnessFactor = brightness / 100;
  let index = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const data = asciiData[index++];
      if (!data) continue;

      let color;
      if (colorMode) {
        let r = Math.min(255, Math.floor(data.r * brightnessFactor));
        let g = Math.min(255, Math.floor(data.g * brightnessFactor));
        let b = Math.min(255, Math.floor(data.b * brightnessFactor));

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        color = `rgb(${r},${g},${b})`;
      } else {
        let gray = Math.min(255, Math.floor(data.gray * brightnessFactor));
        if (invert) {
          gray = 255 - gray;
        }
        color = customTextColor;
      }

      let char = data.char;
      if (char === "&") char = "&amp;";
      else if (char === "<") char = "&lt;";
      else if (char === ">") char = "&gt;";
      else if (char === '"') char = "&quot;";

      asciiHTML += `<span style="color:${color};">${char}</span>`;
    }
    asciiHTML += "\n";
  }

  const bgColor = darkMode ? "#0d1117" : "#ffffff";
  const textColor = darkMode ? "#e6edf3" : "#1f2328";

  const qualityNames = {
    720: "HD",
    1080: "FHD",
    1440: "2K",
    2160: "4K",
    4320: "8K",
  };
  const qualityName = qualityNames[quality] || quality;

  const htmlContent = `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ASCII Art - ${fileName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: ${bgColor};
      color: ${textColor};
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .container {
      max-width: 1400px;
      width: 100%;
      margin: auto;
      text-align: center;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #58a6ff, #f0883e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .info {
      margin-bottom: 20px;
      color: ${textColor};
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .info span {
      opacity: 1;
      font-weight: 600;
    }

    .ascii-container {
      background: ${bgColor};
      border-radius: 12px;
      border: 1px solid ${darkMode ? "#30363d" : "#d0d7de"};
      padding: 20px;
      overflow: auto;
      max-height: 80vh;
      text-align: left;
      direction: ltr;
      box-shadow: ${darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.1)"};
    }

    .ascii-art {
      font-family: "Courier New", "Consolas", monospace;
      font-size: ${fontSize}px;
      line-height: ${fontSize * 1.15}px;
      white-space: pre;
      letter-spacing: 0px;
      font-variant-ligatures: none;
      font-feature-settings: "liga" 0;
      -webkit-font-smoothing: none;
      -moz-osx-font-smoothing: none;
      text-rendering: geometricPrecision;
      color: ${textColor};
    }

    .ascii-art span {
      display: inline;
      font-family: inherit !important;
      letter-spacing: 0px !important;
    }

    .footer {
      margin-top: 30px;
      color: ${textColor};
      opacity: 0.5;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .ascii-art {
        font-size: ${Math.max(2, fontSize - 1)}px;
        line-height: ${Math.max(2, fontSize - 1) * 1.15}px;
      }
      h1 {
        font-size: 1.3rem;
      }
      .container {
        padding: 10px;
      }
    }

    @media (max-width: 480px) {
      .ascii-art {
        font-size: ${Math.max(1, fontSize - 2)}px;
        line-height: ${Math.max(1, fontSize - 2) * 1.15}px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 ASCII Art</h1>
    <div class="info">
      Dimensions: <span>${width} × ${height}</span> &nbsp;|&nbsp;
      Characters: <span>${asciiData.length.toLocaleString()}</span> &nbsp;|&nbsp;
      Quality: <span>${qualityName}</span> &nbsp;|&nbsp;
      Mode: <span>${colorMode ? "Color" : "Monochrome"}</span>
    </div>
    <div class="ascii-container">
      <pre class="ascii-art">${asciiHTML}</pre>
    </div>
    <div class="footer">
      Generated by ASCII Art Pro • ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ====== Process Image ======

async function processImage() {
  if (!currentImage || isProcessing) return;

  isProcessing = true;
  loading.classList.add("active");
  processBtn.disabled = true;

  const startTime = performance.now();

  await new Promise((resolve) => setTimeout(resolve, 50));

  const width = parseInt(widthSlider.value);
  const ratio = parseFloat(ratioSlider.value);
  const contrast = parseInt(contrastSlider.value);
  const brightness = parseInt(brightnessSlider.value);
  const colorMode = colorModeCheck.checked;
  const invert = invertModeCheck.checked;
  const rotation = currentRotation;

  try {
    const {
      ascii,
      width: outWidth,
      height: outHeight,
      asciiData,
    } = convertImageToAscii(
      currentImage,
      width,
      ratio,
      contrast,
      brightness,
      colorMode,
      invert,
      rotation,
    );

    currentAsciiData = asciiData;
    currentWidth = outWidth;
    currentHeight = outHeight;

    const endTime = performance.now();

    const fontSize = parseInt(fontSizeSelect.value);
    asciiElement.style.fontSize = fontSize + "px";
    asciiElement.style.lineHeight = fontSize * 1.15 + "px";
    asciiElement.style.letterSpacing = "0px";

    if (currentImageFile) {
      const quality = qualitySelect.value;
      const name = generateFileName(currentImageFile.name, quality);
      fileNameDisplay.textContent = name;
    }

    displayAscii(ascii, outWidth, outHeight, endTime - startTime);
  } catch (error) {
    console.error("Error processing image:", error);
    alert("Error processing image. Please try again.");
    loading.classList.remove("active");
  } finally {
    isProcessing = false;
    processBtn.disabled = false;
  }
}

// ====== Handle Image Upload ======

function handleImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  currentImageFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    placeholder.style.display = "none";
  };
  reader.readAsDataURL(file);

  const img = new Image();
  img.onload = () => {
    currentImage = img;
    processImage();
    URL.revokeObjectURL(img.src);
  };

  img.onerror = () => {
    alert("Error loading image. Please try another file.");
  };

  img.src = URL.createObjectURL(file);
}

// ====== Event Listeners ======

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImage(file);
  }
  upload.value = "";
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleImage(files[0]);
  }
});

processBtn.addEventListener("click", processImage);

widthSlider.addEventListener("change", processImage);
ratioSlider.addEventListener("change", processImage);
contrastSlider.addEventListener("change", processImage);
brightnessSlider.addEventListener("change", processImage);

fontSizeSelect.addEventListener("change", () => {
  if (currentAscii) {
    const size = parseInt(fontSizeSelect.value);
    asciiElement.style.fontSize = size + "px";
    asciiElement.style.lineHeight = size * 1.15 + "px";
  }
});

colorModeCheck.addEventListener("change", processImage);
invertModeCheck.addEventListener("change", processImage);

// ====== Copy ======
copyBtn.addEventListener("click", async () => {
  if (!currentAscii) {
    alert("No text to copy.");
    return;
  }

  try {
    const plainText = currentAscii.replace(/<[^>]*>/g, "");
    await navigator.clipboard.writeText(plainText);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => {
      copyBtn.textContent = "📋 Copy";
    }, 2000);
  } catch (err) {
    const textarea = document.createElement("textarea");
    textarea.value = currentAscii.replace(/<[^>]*>/g, "");
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copied!");
  }
});

// ====== Download TXT ======
downloadBtn.addEventListener("click", () => {
  if (!currentAscii) {
    alert("No text to download.");
    return;
  }

  const plainText = currentAscii.replace(/<[^>]*>/g, "");
  const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const quality = qualitySelect.value;
  const fileName = currentImageFile
    ? generateFileName(currentImageFile.name, quality)
    : "ascii-art";
  a.download = `${fileName}.txt`;

  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ====== Download SVG ======
downloadSvgBtn.addEventListener("click", () => {
  if (!currentAsciiData || currentAsciiData.length === 0) {
    alert("No data to download. Please upload an image first.");
    return;
  }

  const colorMode = colorModeCheck.checked;
  const invert = invertModeCheck.checked;
  const brightness = parseInt(brightnessSlider.value);
  const quality = qualitySelect.value;
  const fileName = currentImageFile
    ? generateFileName(currentImageFile.name, quality)
    : "ascii-art";

  downloadSVG(
    currentAsciiData,
    currentWidth,
    currentHeight,
    colorMode,
    invert,
    brightness,
    fileName,
  );
});

// ====== Download PNG ======
downloadPngBtn.addEventListener("click", () => {
  if (!currentAsciiData || currentAsciiData.length === 0) {
    alert("No data to download. Please upload an image first.");
    return;
  }

  const colorMode = colorModeCheck.checked;
  const invert = invertModeCheck.checked;
  const brightness = parseInt(brightnessSlider.value);
  const quality = qualitySelect.value;
  const fileName = currentImageFile
    ? generateFileName(currentImageFile.name, quality)
    : "ascii-art";

  downloadPNG(
    currentAsciiData,
    currentWidth,
    currentHeight,
    colorMode,
    invert,
    brightness,
    quality,
    fileName,
  );
});

// ====== Download HTML ======
downloadHtmlBtn.addEventListener("click", () => {
  if (!currentAsciiData || currentAsciiData.length === 0) {
    alert("No data to download. Please upload an image first.");
    return;
  }

  const colorMode = colorModeCheck.checked;
  const invert = invertModeCheck.checked;
  const brightness = parseInt(brightnessSlider.value);
  const quality = qualitySelect.value;
  const fileName = currentImageFile
    ? generateFileName(currentImageFile.name, quality)
    : "ascii-art";

  downloadHTML(
    currentAsciiData,
    currentWidth,
    currentHeight,
    colorMode,
    invert,
    brightness,
    quality,
    fileName,
  );
});

// ====== Clear ======
clearBtn.addEventListener("click", () => {
  currentImage = null;
  currentImageFile = null;
  currentAscii = "";
  currentAsciiData = [];
  currentWidth = 0;
  currentHeight = 0;

  asciiElement.textContent = "📤 Upload an image to generate ASCII art...";
  asciiElement.innerHTML = "";

  imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  previewImage.style.display = "none";
  placeholder.style.display = "block";
  previewImage.src = "";
  dimensionsEl.textContent = "-";
  charCountEl.textContent = "-";
  processingTimeEl.textContent = "";
  fileNameDisplay.textContent = "-";
  upload.value = "";
  loading.classList.remove("active");

  currentRotation = 0;
  rotateBtns.forEach((b) => b.classList.remove("active"));
  document
    .querySelector('.rotate-btn[data-degrees="0"]')
    ?.classList.add("active");
});

// ====== Keyboard Shortcuts ======
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "C") {
    e.preventDefault();
    copyBtn.click();
  }
  if (e.ctrlKey && e.shiftKey && e.key === "D") {
    e.preventDefault();
    downloadBtn.click();
  }
  if (e.key === "Enter" && e.ctrlKey) {
    e.preventDefault();
    processBtn.click();
  }
  if (e.key === "r" || e.key === "R") {
    e.preventDefault();
    const nextRotation = (currentRotation + 90) % 360;
    rotateBtns.forEach((b) => {
      b.classList.remove("active");
      if (parseInt(b.dataset.degrees) === nextRotation) {
        b.classList.add("active");
      }
    });
    currentRotation = nextRotation;
    if (currentImage) processImage();
  }
});

console.log("🎨 ASCII Art Pro loaded successfully!");
console.log(
  "📝 Using " + ASCII_CHARS.length + " characters including A-Z and 0-9",
);
console.log("🎨 Custom text color available!");
console.log("🌐 Download HTML feature added!");
console.log("⌨️ Shortcuts:");
console.log("  Ctrl+Shift+C = Copy");
console.log("  Ctrl+Shift+D = Download TXT");
console.log("  Ctrl+Enter = Process");
console.log("  R = Rotate 90°");
