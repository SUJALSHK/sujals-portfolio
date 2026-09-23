import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = ["index.html", "404.html", "projects/index.html", "projects/all/index.html"];
const requiredFiles = [
  ...htmlFiles,
  "assets/css/main.css",
  "assets/css/projects.css",
  "assets/icons/favicon.svg",
  "assets/js/main.js",
  "assets/js/projects-data.js",
  "assets/js/projects-gallery.js",
  "assets/documents/sujal-shakya-resume.docx",
  "robots.txt",
  "sitemap.xml",
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function localReference(reference) {
  return (
    reference &&
    !reference.startsWith("#") &&
    !reference.startsWith("/") &&
    !/^(https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(reference)
  );
}

for (const file of requiredFiles) {
  if (!existsSync(join(projectRoot, file))) fail(`Missing required file: ${file}`);
}

for (const htmlFile of htmlFiles) {
  const absolutePath = join(projectRoot, htmlFile);
  if (!existsSync(absolutePath)) continue;

  const html = readFileSync(absolutePath, "utf8");
  if (!/^<!doctype html>/i.test(html.trimStart())) fail(`${htmlFile}: missing HTML5 doctype`);
  if (!/<html\s+lang="en"/i.test(html)) fail(`${htmlFile}: missing lang attribute`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${htmlFile}: missing page title`);
  if (htmlFile !== "404.html" && !/<meta\s+name="description"/i.test(html)) {
    fail(`${htmlFile}: missing meta description`);
  }

  const references = [
    ...html.matchAll(/(?:src|href)="([^"]+)"/g),
  ].map((match) => match[1].split(/[?#]/)[0]);

  for (const reference of references) {
    if (!localReference(reference)) continue;
    const target = normalize(join(dirname(absolutePath), decodeURIComponent(reference)));
    if (!target.startsWith(projectRoot) || !existsSync(target)) {
      fail(`${htmlFile}: broken local reference ${reference}`);
    }
  }

  if (/cdn\.tailwindcss\.com|unpkg\.com\/react(?:@|\/)|unpkg\.com\/react-dom/i.test(html)) {
    fail(`${htmlFile}: development CDN dependency found`);
  }
}

const dataSource = readFileSync(join(projectRoot, "assets/js/projects-data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(dataSource, context, { filename: "projects-data.js" });
const projects = context.window.portfolioProjects;

if (!Array.isArray(projects) || projects.length === 0) {
  fail("projects-data.js: no projects exported");
} else {
  for (const project of projects) {
    if (!project.title || !project.description || !project.image) {
      fail("projects-data.js: every project needs a title, description, and image");
      continue;
    }

    if (!existsSync(join(projectRoot, project.image))) {
      fail(`projects-data.js: missing image for ${project.title}: ${project.image}`);
    }

    for (const [field, value] of Object.entries({
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
    })) {
      if (value === "#") fail(`projects-data.js: placeholder ${field} for ${project.title}`);
    }
  }
}

const mainCss = readFileSync(join(projectRoot, "assets/css/main.css"), "utf8");
if (/\*[^}]*outline:\s*none/i.test(mainCss) || /\*\s*{[^}]*outline:\s*none/i.test(mainCss)) {
  fail("main.css: global focus outline suppression found");
}

function textFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if ([".git", "dist", "node_modules", "private"].includes(entry)) continue;
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) files.push(...textFiles(path));
    else if ([".html", ".css", ".js", ".mjs", ".json", ".md", ".txt", ".xml", ".yml", ".yaml"].includes(extname(path))) files.push(path);
  }
  return files;
}

const secretPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
];

for (const file of textFiles(projectRoot)) {
  const content = readFileSync(file, "utf8");
  if (secretPatterns.some((pattern) => pattern.test(content))) {
    fail(`Potential secret found in ${file.slice(projectRoot.length + 1)}`);
  }
  if (/private\//.test(content) && !file.endsWith("validate.mjs")) {
    fail(`Public source references private/ in ${file.slice(projectRoot.length + 1)}`);
  }
}

if (errors.length > 0) {
  console.error("Validation failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validation passed: ${htmlFiles.length} pages and ${projects.length} projects checked.`);
