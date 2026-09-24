const fs = require("node:fs/promises");
const path = require("node:path");
const prettier = require("prettier");

// Formata apenas os arquivos do site. A cópia do protótipo permanece intacta.
async function formatFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (["node_modules", "prototipo", ".git"].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await formatFiles(file);
    } else if (/\.(html|css|js|cjs|json)$/.test(entry.name)) {
      const options = await prettier.resolveConfig(file);
      const content = await fs.readFile(file, "utf8");
      await fs.writeFile(file, await prettier.format(content, { ...options, filepath: file }));
    }
  }
}

formatFiles(path.resolve(__dirname, "..")).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
