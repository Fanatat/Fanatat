// Общие примитивы для обложки и схем: цвета, плавность, узлы, линии, импульсы.
// Каждая сцена задаёт window.SCENE = {w, h, duration, fps, still} и window.renderAt(t);
// render.py вызывает renderAt для каждого кадра и снимает canvas.

const C = {
  bg: "#0D1117",
  panel: "#161B22",
  panelHi: "#0F2A2E",
  border: "#30363D",
  line: "#2A3038",
  text: "#E6EDF3",
  label: "#C9D1D9",
  muted: "#8B949E",
  accent: "#39C5CF",
  blue: "#58A6FF",
  green: "#3FB950",
  greenHi: "#12301B",
};

const FONT = "Inter, 'DejaVu Sans', sans-serif";
const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, t) => { const k = clamp((t - a) / (b - a)); return k * k * (3 - 2 * k); };
const easeInOut = k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mix(c1, c2, k) {
  const a = hex(c1), b = hex(c2);
  return "rgb(" + a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)))).join(",") + ")";
}
function rgba(c, alpha) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${clamp(alpha)})`; }

// Уровень подсветки узла: вспышка при приходе импульса, затем спокойное «послесвечение»
// до общего угасания в конце цикла (fadeFrom..fadeTo), чтобы последний кадр совпал с первым.
function level(t, on, fadeFrom, fadeTo, rest = 0.4) {
  if (t < on) return 0;
  const rise = smooth(on, on + 0.3, t);
  const settle = smooth(on + 0.5, on + 1.4, t);
  return lerp(rise, rest, settle) * (1 - smooth(fadeFrom, fadeTo, t));
}

function setupCanvas() {
  const { w, h } = window.SCENE;
  const cv = document.getElementById("c");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  return ctx;
}

function clear(ctx) {
  const { w, h } = window.SCENE;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Узел схемы. n = {x, y, w, h, label}; a — уровень подсветки 0..1; tone — цвет акцента.
function drawNode(ctx, n, a, tone = C.accent, opts = {}) {
  const x = n.x - n.w / 2, y = n.y - n.h / 2;
  ctx.save();
  if (a > 0.01) {
    ctx.shadowColor = rgba(tone, 0.55 * a);
    ctx.shadowBlur = 22 * a;
  }
  roundRect(ctx, x, y, n.w, n.h, 10);
  ctx.fillStyle = mix(C.panel, tone === C.green ? C.greenHi : C.panelHi, a);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = mix(C.border, tone, a);
  ctx.stroke();
  ctx.restore();
  if (n.label) {
    ctx.fillStyle = mix(C.label, "#FFFFFF", a);
    ctx.font = `500 ${n.size || 20}px ${FONT}`;
    ctx.textAlign = opts.align || "center";
    ctx.textBaseline = "middle";
    const lx = opts.align === "left" ? x + (opts.pad || 16) : n.x;
    ctx.fillText(n.label, lx, n.y + (opts.dy || 0));
  }
}

// Путь — кубическая кривая Безье; point(u) для импульсов.
function bez(p0, p1, p2, p3) {
  return {
    p: [p0, p1, p2, p3],
    point(u) {
      const v = 1 - u;
      return [
        v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
      ];
    },
  };
}
function straight(a, b) {
  return bez(a, [lerp(a[0], b[0], 1 / 3), lerp(a[1], b[1], 1 / 3)], [lerp(a[0], b[0], 2 / 3), lerp(a[1], b[1], 2 / 3)], b);
}
// Горизонтальный изгиб между узлами на разной высоте.
function curve(a, b) {
  const mx = (a[0] + b[0]) / 2;
  return bez(a, [mx, a[1]], [mx, b[1]], b);
}

// Линия: базовый тонкий штрих + «пройденная» подсветка (lit 0..1).
function drawEdge(ctx, e, lit = 0, tone = C.accent) {
  const [p0, p1, p2, p3] = e.p;
  ctx.save();
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(...p0);
  ctx.bezierCurveTo(...p1, ...p2, ...p3);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = C.line;
  ctx.stroke();
  if (lit > 0.01) {
    ctx.strokeStyle = rgba(tone, 0.45 * lit);
    ctx.stroke();
  }
  ctx.restore();
}

// Световой импульс, бегущий по линии в окне времени [t0, t1].
function drawPulse(ctx, e, t, t0, t1, tone = C.accent) {
  if (t < t0 || t > t1 + 0.25) return;
  const head = easeInOut(clamp((t - t0) / (t1 - t0)));
  const fade = 1 - smooth(t1, t1 + 0.25, t);
  ctx.save();
  for (let i = 12; i >= 0; i--) {
    const u = head - i * 0.022;
    if (u < 0) continue;
    const [x, y] = e.point(u);
    const k = 1 - i / 13;
    ctx.beginPath();
    ctx.arc(x, y, lerp(1.2, 4, k), 0, Math.PI * 2);
    ctx.fillStyle = rgba(tone, 0.85 * k * k * fade);
    if (i === 0) { ctx.shadowColor = rgba(tone, 0.9 * fade); ctx.shadowBlur = 14; }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

// Подсветка пройденной линии: появляется после импульса, гаснет в конце цикла.
function edgeLit(t, t1, fadeFrom, fadeTo) {
  return smooth(t1 - 0.1, t1 + 0.3, t) * (1 - smooth(fadeFrom, fadeTo, t));
}

// Значок-галочка в круге; k — доля прорисовки 0..1, alpha — прозрачность.
function drawCheck(ctx, x, y, r, k, alpha, tone = C.green) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = tone;
  ctx.shadowColor = rgba(tone, 0.6);
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
  const pts = [[x - r * 0.45, y + r * 0.02], [x - r * 0.1, y + r * 0.36], [x + r * 0.5, y - r * 0.32]];
  const l1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
  const l2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
  const len = (l1 + l2) * clamp(k);
  ctx.beginPath();
  ctx.moveTo(...pts[0]);
  if (len <= l1) {
    ctx.lineTo(lerp(pts[0][0], pts[1][0], len / l1), lerp(pts[0][1], pts[1][1], len / l1));
  } else {
    ctx.lineTo(...pts[1]);
    const q = (len - l1) / l2;
    ctx.lineTo(lerp(pts[1][0], pts[2][0], q), lerp(pts[1][1], pts[2][1], q));
  }
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

// Дуга ожидания (проверка идёт).
function drawSpinner(ctx, x, y, r, t, alpha, tone = C.accent) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = rgba(tone, 0.25);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = tone;
  const a0 = t * 7;
  ctx.beginPath(); ctx.arc(x, y, r, a0, a0 + Math.PI * 0.9); ctx.stroke();
  ctx.restore();
}

function text(ctx, s, x, y, { size = 20, weight = 400, color = C.text, align = "left", font = FONT, base = "alphabetic", alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = clamp(alpha);
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(s, x, y);
  ctx.restore();
}

// Загрузка шрифтов до первого кадра: render.py ждёт window.ready.
window.ready = Promise.all([
  new FontFace("Inter", "url(fonts/Inter.ttf)", { weight: "100 900" }).load(),
  new FontFace("JetBrains Mono", "url(fonts/JetBrainsMono.ttf)", { weight: "100 800" }).load(),
]).then(fs => { fs.forEach(f => document.fonts.add(f)); return true; });
