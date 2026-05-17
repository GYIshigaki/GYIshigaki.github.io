const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const itemsDir = path.join(rootDir, "img", "item");
const outputFile = path.join(rootDir, "assets", "js", "items.js");
const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif"];

function parseYaml(source) {
  const data = {};
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (rawValue === "|") {
      const block = [];
      index += 1;

      while (index < lines.length && (/^\s/.test(lines[index]) || !lines[index].trim())) {
        block.push(lines[index].replace(/^  /, ""));
        index += 1;
      }

      index -= 1;
      data[key] = block.join("\n").trim();
      continue;
    }

    const value = rawValue.trim();
    if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return data;
}

function findItemImage(dir) {
  const files = fs.readdirSync(dir);
  const preferred = files.find((file) => imageExtensions.includes(path.extname(file).toLowerCase()) && path.basename(file, path.extname(file)) === "image");
  if (preferred) return preferred;
  return files.find((file) => imageExtensions.includes(path.extname(file).toLowerCase()));
}

const items = fs.readdirSync(itemsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const itemDir = path.join(itemsDir, entry.name);
    const descPath = path.join(itemDir, "desc.yaml");
    const image = findItemImage(itemDir);
    if (!fs.existsSync(descPath) || !image) return null;
    const desc = parseYaml(fs.readFileSync(descPath, "utf8"));
    return {
      id: entry.name,
      name: desc.name || entry.name,
      label: desc.label || "",
      intro: desc.intro || desc.description || "",
      featured: Boolean(desc.featured),
      order: Number.parseInt(desc.order || "999", 10),
      image: `./img/item/${entry.name}/${image}`,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "ja"));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `window.GY_ITEMS = ${JSON.stringify(items, null, 2)};\n`);
console.log(`Generated ${path.relative(rootDir, outputFile)} (${items.length} items)`);
