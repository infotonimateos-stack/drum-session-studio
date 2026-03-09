#!/usr/bin/env node
/**
 * Post-build script: generates index.html copies for all SPA routes
 * so GitHub Pages serves them with 200 instead of 404.
 *
 * Skips directories that already have an index.html (e.g. redirect pages in public/).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DIST = join(process.cwd(), "dist");
const indexHtml = readFileSync(join(DIST, "index.html"), "utf-8");

// Spanish routes (no prefix)
const esTabPaths = [
  "grabacion-baterias-online",
  "baterista-online",
  "estudio-grabacion-baterias",
  "descarga-muestra-bateria-online",
  "tutorial-mezcla-grabacion-bateria",
  "faq-grabacion-bateria-online",
  "contacto-baterista-remoto",
];

const esStepPaths = [
  "elegir-bateria-online",
  "microfonos-grabacion-bateria",
  "previos-grabacion-bateria",
  "interfaz-grabacion-bateria",
  "produccion-grabacion-bateria",
  "video-grabacion-bateria",
  "tomas-grabacion-bateria",
  "entrega-grabacion-bateria-online",
  "extras-grabacion-bateria",
];

const esStandalone = [
  "success",
  "aviso-legal",
  "politica-privacidad",
  "politica-cookies",
  "ampliar-pedido",
  "blog-grabacion-bateria",
];

// English routes (en/ prefix)
const enTabPaths = [
  "en/remote-custom-drum-tracks",
  "en/remote-drummer",
  "en/drums-recording-studio",
  "en/download-remote-drum-sample",
  "en/drum-mixing-recording-tutorial",
  "en/online-drum-recording-faq",
  "en/contact-remote-drummer",
];

const enStepPaths = [
  "en/choose-remote-drum-kit",
  "en/drum-recording-microphones",
  "en/drum-recording-preamps",
  "en/drum-recording-interface",
  "en/drum-recording-production",
  "en/drum-recording-video",
  "en/drum-recording-takes",
  "en/remote-drum-recording-delivery",
  "en/drum-recording-extras",
];

const enStandalone = [
  "en/success",
  "en/aviso-legal",
  "en/politica-privacidad",
  "en/politica-cookies",
  "en/ampliar-pedido",
  "en/drum-recording-blog",
];

const allRoutes = [
  ...esTabPaths,
  ...esStepPaths,
  ...esStandalone,
  ...enTabPaths,
  ...enStepPaths,
  ...enStandalone,
];

// Also generate pages for blog post slugs
const blogPostsPath = join(process.cwd(), "src/data/blogPosts.ts");
if (existsSync(blogPostsPath)) {
  const blogContent = readFileSync(blogPostsPath, "utf-8");
  const slugMatches = blogContent.match(/slug: "([^"]+)"/g) || [];
  const slugEnMatches = blogContent.match(/slugEn: "([^"]+)"/g) || [];

  for (const match of slugMatches) {
    const slug = match.replace(/slug: "|"/g, "");
    allRoutes.push(`blog-grabacion-bateria/${slug}`);
  }
  for (const match of slugEnMatches) {
    const slug = match.replace(/slugEn: "|"/g, "");
    allRoutes.push(`en/drum-recording-blog/${slug}`);
  }
}

let created = 0;
let skipped = 0;

for (const route of allRoutes) {
  const dir = join(DIST, route);
  const file = join(dir, "index.html");

  if (existsSync(file)) {
    skipped++;
    continue;
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(file, indexHtml);
  created++;
}

console.log(`SPA pages: ${created} created, ${skipped} skipped (already exist)`);
