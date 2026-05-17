const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const membersDir = path.join(rootDir, "img", "member");
const outputFile = path.join(rootDir, "assets", "js", "members.js");
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
    data[key] = value.replace(/^["']|["']$/g, "");
  }

  return data;
}

function findMemberImage(dir) {
  const files = fs.readdirSync(dir);
  const preferred = files.find((file) => imageExtensions.includes(path.extname(file).toLowerCase()) && path.basename(file, path.extname(file)) === "image");
  if (preferred) return preferred;
  return files.find((file) => imageExtensions.includes(path.extname(file).toLowerCase()));
}

function buildMembers() {
  const members = fs.readdirSync(membersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const memberDir = path.join(membersDir, entry.name);
      const descPath = path.join(memberDir, "desc.yaml");
      const image = findMemberImage(memberDir);

      if (!fs.existsSync(descPath) || !image) return null;

      const desc = parseYaml(fs.readFileSync(descPath, "utf8"));
      return {
        id: entry.name,
        name: desc.name || entry.name,
        role: desc.role || "",
        intro: desc.intro || desc.description || "",
        order: Number.parseInt(desc.order || "999", 10),
        image: `./img/member/${entry.name}/${image}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "ja"));

  const js = `window.GY_MEMBERS = ${JSON.stringify(members, null, 2)};\n`;
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, js);
  console.log(`Generated ${path.relative(rootDir, outputFile)} (${members.length} members)`);
}

buildMembers();
