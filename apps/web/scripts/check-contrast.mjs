import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const globalsPath = path.join(__dirname, "..", "app", "globals.css");

function parseRgbTriplet(value) {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const rgb = parts.map((part) => Number(part));
  if (rgb.some((number) => Number.isNaN(number))) return null;
  return rgb;
}

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(rgbA, rgbB) {
  const L1 = relativeLuminance(rgbA);
  const L2 = relativeLuminance(rgbB);
  const [lighter, darker] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

function extractRootBlock(css, { insideDarkMedia } = { insideDarkMedia: false }) {
  if (!insideDarkMedia) {
    const match = css.match(/:root\s*\{([\s\S]*?)\n\}/);
    return match?.[1] ?? "";
  }

  const match = css.match(
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?:root\s*\{([\s\S]*?)\n\s*\}[\s\S]*?\n\}/,
  );
  return match?.[1] ?? "";
}

function parseVars(block) {
  const vars = new Map();
  for (const line of block.split("\n")) {
    const match = line.match(/^\s*(--[a-zA-Z0-9-]+):\s*([^;]+);/);
    if (!match) continue;
    vars.set(match[1], match[2].trim());
  }
  return vars;
}

function formatRatio(ratio) {
  return ratio.toFixed(2) + ":1";
}

const css = await readFile(globalsPath, "utf8");

const lightVars = parseVars(extractRootBlock(css, { insideDarkMedia: false }));
const darkVars = parseVars(extractRootBlock(css, { insideDarkMedia: true }));

const checks = [
  {
    name: "Body text (primary) on canvas",
    fg: "--text-primary",
    bg: "--canvas",
    min: 4.5,
  },
  {
    name: "Body text (secondary) on canvas",
    fg: "--text-secondary",
    bg: "--canvas",
    min: 4.5,
  },
  {
    name: "Primary text on surface",
    fg: "--text-primary",
    bg: "--surface",
    min: 4.5,
  },
  {
    name: "Secondary text on surface",
    fg: "--text-secondary",
    bg: "--surface",
    min: 4.5,
  },
];

function run(mode, vars) {
  const failures = [];
  for (const check of checks) {
    const fg = parseRgbTriplet(vars.get(check.fg) ?? "");
    const bg = parseRgbTriplet(vars.get(check.bg) ?? "");
    if (!fg || !bg) {
      failures.push(
        `${check.name} (${mode}) skipped (missing RGB vars: ${check.fg}, ${check.bg})`,
      );
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    if (ratio < check.min) {
      failures.push(
        `${check.name} (${mode}) ${formatRatio(ratio)} < ${check.min}:1 (fg ${fg.join(
          " ",
        )} / bg ${bg.join(" ")})`,
      );
    }
  }
  return failures;
}

const failures = [...run("light", lightVars), ...run("dark", darkVars)];

if (failures.length) {
  console.error("Contrast checks failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("Contrast checks passed (RGB semantic tokens):");
for (const mode of ["light", "dark"]) {
  const vars = mode === "light" ? lightVars : darkVars;
  const primary = parseRgbTriplet(vars.get("--text-primary") ?? "");
  const secondary = parseRgbTriplet(vars.get("--text-secondary") ?? "");
  const canvas = parseRgbTriplet(vars.get("--canvas") ?? "");
  if (!primary || !secondary || !canvas) continue;
  console.log(
    `- ${mode}: primary ${formatRatio(contrastRatio(primary, canvas))}, secondary ${formatRatio(
      contrastRatio(secondary, canvas),
    )}`,
  );
}
