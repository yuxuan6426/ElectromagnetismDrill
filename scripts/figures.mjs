import { mkdir, writeFile } from "node:fs/promises";

const folder = new URL("../public/figures/", import.meta.url);
await mkdir(folder, { recursive: true });

const navy = "#24384e";
const blue = "#28649a";
const fill = "#dcecf9";
const text = (x, y, content) =>
  '<text x="' +
  x +
  '" y="' +
  y +
  '" fill="' +
  navy +
  '" font-size="16">' +
  content +
  "</text>";
const circle = (x, y, r, color = "white") =>
  '<circle cx="' +
  x +
  '" cy="' +
  y +
  '" r="' +
  r +
  '" fill="' +
  color +
  '" stroke="' +
  navy +
  '" stroke-width="2"/>';
const line = (x1, y1, x2, y2, color = navy, dashed = false) =>
  '<path d="M' +
  x1 +
  " " +
  y1 +
  "L" +
  x2 +
  " " +
  y2 +
  '" stroke="' +
  color +
  '" stroke-width="2"' +
  (dashed ? ' stroke-dasharray="6 4"' : "") +
  "/>";
const dot = (x, y) => circle(x, y, 3, navy);
const box = (x, y, w, h, color) =>
  '<rect x="' +
  x +
  '" y="' +
  y +
  '" width="' +
  w +
  '" height="' +
  h +
  '" fill="' +
  color +
  '" stroke="' +
  navy +
  '"/>';
const svg = (title, body) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 222" role="img" aria-label="' +
  title +
  '"><title>' +
  title +
  '</title><rect width="520" height="222" rx="8" fill="#fbfdff"/><g font-family="system-ui,sans-serif">' +
  body +
  "</g></svg>\n";
const save = (id, title, body) =>
  writeFile(new URL(id + ".svg", folder), svg(title, body));
const rings = (radii, colors) =>
  radii.map((r, i) => circle(179, 110, r, colors[i])).join("");
const label = (y, s) => text(302, y, s);

await Promise.all([
  save(
    "ring",
    "圆环、轴向场点和坐标",
    '<ellipse cx="154" cy="110" rx="39" ry="73" fill="none" stroke="' +
      blue +
      '" stroke-width="3"/>' +
      line(62, 110, 460, 110, navy, true) +
      line(154, 110, 154, 37, blue) +
      line(154, 37, 340, 110, blue, true) +
      dot(154, 110) +
      dot(340, 110) +
      text(145, 136, "O") +
      text(165, 73, "R") +
      text(333, 136, "P") +
      text(448, 99, "x"),
  ),
  save(
    "spheres",
    "两个同心球面的剖面",
    rings([90, 50], [fill, "white"]) +
      line(179, 110, 269, 110) +
      dot(179, 110) +
      text(213, 104, "R₁") +
      text(247, 104, "R₂") +
      label(70, "I · r &lt; R₁") +
      label(111, "II · R₁ &lt; r &lt; R₂") +
      label(151, "III · r &gt; R₂"),
  ),
  save(
    "semicircle",
    "半圆弧与两点电荷",
    line(50, 155, 480, 155) +
      '<path d="M 175 155 A 80 80 0 0 1 335 155" fill="none" stroke="' +
      blue +
      '" stroke-width="3"/>' +
      [95, 175, 255, 335].map((x) => dot(x, 155)).join("") +
      text(75, 182, "A (+q)") +
      text(168, 182, "O") +
      text(234, 182, "B (−q)") +
      text(328, 182, "D") +
      text(248, 66, "C"),
  ),
  save(
    "coaxial",
    "同轴传输线横截面",
    rings([92, 82, 40], [navy, "white", "#cbd6e1"]) +
      line(179, 110, 260, 110, blue) +
      label(88, "内导体  R₁, U₁") +
      label(132, "外导体内表面  R₂, U₂"),
  ),
  save(
    "series-plates",
    "两层介质沿板间方向串联",
    box(92, 60, 153, 88, fill) +
      box(245, 60, 183, 88, "#eff5f9") +
      box(86, 52, 6, 104, navy) +
      box(428, 52, 6, 104, navy) +
      text(151, 109, "ε₁") +
      text(323, 109, "ε₂") +
      text(151, 178, "d₁") +
      text(323, 178, "d₂") +
      text(62, 108, "+") +
      text(445, 108, "−"),
  ),
  save(
    "slab",
    "介质薄片和两侧空气间隙",
    box(92, 60, 336, 88, "white") +
      box(204, 60, 112, 88, fill) +
      box(86, 52, 6, 104, navy) +
      box(428, 52, 6, 104, navy) +
      text(116, 109, "空气") +
      text(252, 109, "ε") +
      text(346, 109, "空气") +
      text(253, 177, "t"),
  ),
  save(
    "coated-sphere",
    "金属球外的均匀介质层",
    rings([89, 49], [fill, "#cbd6e1"]) +
      dot(179, 110) +
      label(70, "金属球 · R, Q") +
      label(110, "均匀介质 · ε") +
      label(150, "外边界 · R′"),
  ),
  save(
    "series-spheres",
    "沿径向分层的球形电容器",
    rings([92, 86, 62, 33], [navy, "#eef5fa", fill, "#cbd6e1"]) +
      label(71, "内球  R₁") +
      label(109, "介质界面  r") +
      label(147, "外壳内壁  R₂"),
  ),
  save(
    "parallel-sphere",
    "由过球心平面分开的两半球介质",
    rings([92, 86], [navy, "white"]) +
      '<path d="M93 110 A86 86 0 0 1 265 110 Z" fill="' +
      fill +
      '" stroke="' +
      blue +
      '"/>' +
      circle(179, 110, 36, "#cbd6e1") +
      label(88, "上半球 · ε") +
      label(143, "下半球 · 空气"),
  ),
]);

// Sample each physical branch separately so jumps in field are never smoothed.
async function plot(
  id,
  title,
  xLabel,
  yLabel,
  [xmin, xmax],
  [ymin, ymax],
  branches,
) {
  const X = (x) => 57 + ((x - xmin) / (xmax - xmin)) * 415;
  const Y = (y) => 183 - ((y - ymin) / (ymax - ymin)) * 150;
  const axisY = Y(Math.max(ymin, 0));
  const paths = branches.map(([a, b, f]) => {
    const points = Array.from({ length: 81 }, (_, i) => {
      const x = a + ((b - a) * i) / 80;
      return X(x).toFixed(2) + "," + Y(f(x)).toFixed(2);
    });
    return (
      '<polyline points="' +
      points.join(" ") +
      '" fill="none" stroke="' +
      blue +
      '" stroke-width="2.8"/>'
    );
  });
  const seams = branches
    .slice(1)
    .map(([x]) => line(X(x), 32, X(x), 183, "#b2c6d7", true));
  await save(
    id,
    title,
    line(57, 28, 57, 184) +
      line(57, axisY, 481, axisY) +
      text(62, 22, yLabel) +
      text(442, 208, xLabel) +
      seams.join("") +
      paths.join(""),
  );
}

await Promise.all([
  plot(
    "ring-field",
    "带正电圆环的归一化轴向场",
    "x/R",
    "Eₓ R²/(kq)",
    [-3, 3],
    [-0.42, 0.42],
    [[-3, 3, (x) => x / (1 + x * x) ** 1.5]],
  ),
  plot(
    "spheres-field",
    "两球面电荷相反时的归一化场强",
    "r/R₁",
    "Eᵣ R₁²/(kQ₁)",
    [0, 4],
    [0, 1.1],
    [
      [0, 1, () => 0],
      [1, 2, (x) => 1 / x ** 2],
      [2, 4, () => 0],
    ],
  ),
  plot(
    "cylinder-field",
    "带正电圆筒面的归一化径向场",
    "r/R",
    "2πε₀ R Eᵣ/λ",
    [0, 4],
    [0, 1.1],
    [
      [0, 1, () => 0],
      [1, 4, (x) => 1 / x],
    ],
  ),
  plot(
    "spheres-potential",
    "两球面电势示例，Q₁=Q₂，R₂=2R₁",
    "r/R₁",
    "U R₁/(kQ₁)",
    [0, 5],
    [0, 1.6],
    [
      [0, 1, () => 1.5],
      [1, 2, (x) => 1 / x + 0.5],
      [2, 5, (x) => 2 / x],
    ],
  ),
  plot(
    "coated-potential",
    "介质包覆球电势示例，ε=3，R′=2R",
    "r/R",
    "U R/(kQ)",
    [0, 5],
    [0, 0.75],
    [
      [0, 1, () => 2 / 3],
      [1, 2, (x) => 0.5 + (1 / x - 0.5) / 3],
      [2, 5, (x) => 1 / x],
    ],
  ),
]);
