import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "dist");
const publicEntries = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "assets",
  "projects",
];

if (dirname(outputDirectory) !== projectRoot) {
  throw new Error("Refusing to clean an output directory outside the project root.");
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const entry of publicEntries) {
  cpSync(join(projectRoot, entry), join(outputDirectory, entry), {
    recursive: true,
  });
}

writeFileSync(join(outputDirectory, ".nojekyll"), "");
console.log(`Built production site in ${outputDirectory}`);
