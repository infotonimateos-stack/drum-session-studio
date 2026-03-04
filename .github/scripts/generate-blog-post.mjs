#!/usr/bin/env node
/**
 * Weekly blog post generator for Toni Mateos - Drum Session Studio
 * Called by GitHub Actions on a weekly schedule.
 * Uses Claude API to generate bilingual (ES/EN) blog articles about drum recording.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY not set");
  process.exit(1);
}

// --- Paths ---
const ROOT = process.cwd();
const BLOG_POSTS_PATH = join(ROOT, "src/data/blogPosts.ts");
const ES_PATH = join(ROOT, "src/i18n/locales/es-ES/common.json");
const EN_PATH = join(ROOT, "src/i18n/locales/en-GB/common.json");
const SITEMAP_PATH = join(ROOT, "public/sitemap.xml");

// --- Read current state ---
const blogPostsContent = readFileSync(BLOG_POSTS_PATH, "utf-8");
const esJson = JSON.parse(readFileSync(ES_PATH, "utf-8"));
const enJson = JSON.parse(readFileSync(EN_PATH, "utf-8"));
const sitemapContent = readFileSync(SITEMAP_PATH, "utf-8");

// --- Determine next post number ---
const postMatches = blogPostsContent.match(/blog\.post(\d+)\./g) || [];
const postNumbers = postMatches.map((m) => parseInt(m.match(/\d+/)[0]));
const nextPostNum = Math.max(...postNumbers) + 1;

// --- Calculate publish date (next week) ---
const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 7);
const dateStr = nextDate.toISOString().split("T")[0];

// --- Existing topics to avoid repetition ---
const existingSlugs = blogPostsContent.match(/slug: "([^"]+)"/g)?.map((s) => s.replace(/slug: "|"/g, "")) || [];

console.log(`Generating blog post #${nextPostNum} (publish date: ${dateStr})`);
console.log(`Existing posts: ${existingSlugs.length}`);

// --- Call Claude API ---
const prompt = `Eres el redactor del blog de Toni Mateos (tonimateos.com), baterista profesional con 35 años de carrera que ha grabado con Alejandro Sanz, Juanes, John Legend, Sergio Dalma, Antonio Orozco, etc. Su estudio en Barcelona cuenta con previos Neve 1073, API 512c, DAD AX32 y micrófonos de alta gama.

Genera el artículo de blog número ${nextPostNum}, bilingüe ES/EN.

TEMAS YA CUBIERTOS (NO repetir):
${existingSlugs.map((s) => `- ${s}`).join("\n")}

Elige un tema SEO relevante sobre grabación de baterías, producción musical, técnica de estudio, o experiencias profesionales que NO esté en la lista anterior.

El artículo debe:
- Tener al menos 1500 palabras en cada idioma
- Estar escrito en primera persona como Toni Mateos
- Incluir keywords SEO naturales
- Usar formato markdown con headers (##), listas, y párrafos
- Ser informativo, profesional pero cercano

DEVUELVE SOLO JSON puro (sin backticks, sin markdown wrapping):
{
  "slug": "slug-en-espanol-con-guiones",
  "slugEn": "english-slug-with-dashes",
  "tags": ["tag1", "tag2", "tag3"],
  "es": {
    "title": "Título en español (60-70 chars, con keyword principal)",
    "description": "Meta description en español (150-160 chars)",
    "content": "Contenido completo en markdown..."
  },
  "en": {
    "title": "English title (60-70 chars, with main keyword)",
    "description": "English meta description (150-160 chars)",
    "content": "Full markdown content..."
  }
}`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) {
  const errorText = await response.text();
  console.error(`Claude API error (${response.status}):`, errorText);
  process.exit(1);
}

const claudeResult = await response.json();
const textContent = claudeResult.content[0].text;

// Parse the JSON response (handle possible backtick wrapping)
const cleanJson = textContent
  .replace(/^```json\n?/, "")
  .replace(/\n?```$/, "")
  .trim();

let article;
try {
  article = JSON.parse(cleanJson);
} catch (e) {
  console.error("Failed to parse Claude response as JSON:");
  console.error(cleanJson.substring(0, 500));
  process.exit(1);
}

console.log(`Article generated: "${article.es.title}"`);
console.log(`Slug ES: ${article.slug}`);
console.log(`Slug EN: ${article.slugEn}`);

// --- Update blogPosts.ts ---
const newEntry = `  {
    slug: "${article.slug}",
    slugEn: "${article.slugEn}",
    titleKey: "blog.post${nextPostNum}.title",
    descriptionKey: "blog.post${nextPostNum}.description",
    contentKey: "blog.post${nextPostNum}.content",
    date: "${dateStr}",
    imageUrl: "/lovable-uploads/55fddddd-e10a-4c7d-9852-36db51337402.webp",
    tags: ${JSON.stringify(article.tags)},
  },`;

const updatedBlogPosts = blogPostsContent.replace(
  /\];\n\nexport const getBlogPostBySlug/,
  `${newEntry}\n];\n\nexport const getBlogPostBySlug`
);
writeFileSync(BLOG_POSTS_PATH, updatedBlogPosts);
console.log("Updated blogPosts.ts");

// --- Update ES translations ---
esJson.blog[`post${nextPostNum}`] = {
  title: article.es.title,
  description: article.es.description,
  content: article.es.content,
};
writeFileSync(ES_PATH, JSON.stringify(esJson, null, 2) + "\n");
console.log("Updated es-ES/common.json");

// --- Update EN translations ---
enJson.blog[`post${nextPostNum}`] = {
  title: article.en.title,
  description: article.en.description,
  content: article.en.content,
};
writeFileSync(EN_PATH, JSON.stringify(enJson, null, 2) + "\n");
console.log("Updated en-GB/common.json");

// --- Update sitemap.xml ---
const sitemapEntry = `  <url>
    <loc>https://tonimateos.com/blog-grabacion-bateria/${article.slug}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://tonimateos.com/blog-grabacion-bateria/${article.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://tonimateos.com/en/drum-recording-blog/${article.slugEn}"/>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

const updatedSitemap = sitemapContent.replace(
  "</urlset>",
  `${sitemapEntry}</urlset>`
);
writeFileSync(SITEMAP_PATH, updatedSitemap);
console.log("Updated sitemap.xml");

console.log(`\nBlog post #${nextPostNum} generated successfully!`);
