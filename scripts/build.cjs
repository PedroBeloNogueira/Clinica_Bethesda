const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "prototipo/index.html"), "utf8");
const script = source.match(/<script>\s*(const G=[\s\S]*?)<\/script>/)[1];
const css = source.match(/<style>([\s\S]*?)<\/style>/)[1];
const elements = new Map();
function element(id) {
  if (!elements.has(id))
    elements.set(id, {
      innerHTML: "",
      addEventListener() {},
      querySelectorAll() {
        return [];
      },
    });
  return elements.get(id);
}
const context = vm.createContext({
  document: {
    title: "",
    getElementById: element,
    querySelectorAll() {
      return [];
    },
  },
});
vm.runInContext(script.slice(0, script.indexOf("function route()")), context);
const pages = vm.runInContext("P", context);
const categories = vm.runInContext("Object.keys(CAT)", context);
const units = vm.runInContext("S", context);
const destinations = [
  ["index.html", null],
  ...Object.keys(pages)
    .filter((k) => k !== "unidade")
    .map((k) => [k + ".html", k]),
  ...categories.map((k) => ["servicos/" + k + ".html", "servicos", k]),
  ...units.map((k) => ["unidade/" + k + ".html", "unidade", k]),
];
function links(html, base) {
  return html
    .replace(/href="#\/([^"\s]+)"/g, (_, route) => `href="${base}${route}.html"`)
    .replace(
      /href="#([^"\s]*)"/g,
      (_, anchor) => `href="${base}index.html${anchor ? "#" + anchor : ""}"`,
    );
}
const prefix = script.slice(0, script.indexOf('document.getElementById("ugrid")'));
// Apenas os dados e a busca são necessários no navegador; as páginas já são HTML.
const helpers =
  script.slice(script.indexOf("const N="), script.indexOf("const D=")) +
  '\nconst btn=(t,h)=>`<a class="btn btn-wa" href="${h||G}" target="_blank" rel="noopener">${t}</a>`;\n' +
  script.slice(script.indexOf("function initSv("), script.indexOf("function route()"));
const homeEvents = script.slice(script.indexOf("let sel="), script.indexOf("/* FOTOS:"));
const commonEvents = script.slice(script.indexOf("const tt="));
const runtime =
  `"use strict";\nconst BASE=document.body.dataset.base;\n${prefix}\n${helpers}\nif(document.getElementById("go")){${homeEvents}}\nif(document.getElementById("q"))initSv(document.body.dataset.category);\n${commonEvents}\nfunction legacyRoute(){if(location.hash.startsWith("#/")){const route=location.hash.slice(2);const routes=${JSON.stringify(destinations.filter((x) => x[1]).map((x) => x[0].replace(".html", "")))};if(routes.includes(route))location.replace(BASE+route+".html");}}\naddEventListener("hashchange",legacyRoute);legacyRoute();\n`.replaceAll(
    'href="#/unidade/${k}"',
    'href="${BASE}unidade/${k}.html"',
  );
fs.mkdirSync(path.join(root, "assets"), { recursive: true });
fs.writeFileSync(path.join(root, "assets/styles.css"), css);
fs.writeFileSync(path.join(root, "assets/site.js"), runtime);
const themeScript = source.match(/<script>(try\{[\s\S]*?)<\/script>/)[1];
fs.writeFileSync(
  path.join(root, "assets/theme.js"),
  "// Aplica o tema salvo antes de exibir a página.\n" + themeScript,
);
const images = new Map();
fs.mkdirSync(path.join(root, "assets/images"), { recursive: true });
for (const [file, type, arg] of destinations) {
  const base = file.includes("/") ? "../" : "./";
  let html = source
    .replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="${base}assets/styles.css">`)
    .replace(
      /<script>\s*const G=[\s\S]*?<\/script>/,
      `<script src="${base}assets/site.js" defer></script>`,
    );
  if (type) {
    let content = pages[type](arg);
    if (type === "servicos") {
      vm.runInContext(`initSv(${JSON.stringify(arg || "")})`, context);
      content = content
        .replace(
          '<div class="chips" id="cf"></div>',
          `<div class="chips" id="cf">${element("cf").innerHTML}</div>`,
        )
        .replace(
          '<div class="grid" id="res"></div>',
          `<div class="grid" id="res">${element("res").innerHTML}</div>`,
        );
    }
    html = html
      .replace(/<main id="inicio">[\s\S]*?<\/main>/, "")
      .replace(
        '<main id="page" class="pg" hidden></main>',
        `<main id="page" class="pg">${content}</main>`,
      );
    const title = content.match(/<h1>(.*?)<\/h1>/)[1];
    const description = content.match(/<p class="lead">(.*?)<\/p>/)[1];
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${title} | Clínica Bethesda</title>`)
      .replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${description.replaceAll('"', "&quot;")}">`,
      );
  } else {
    html = html
      .replace(
        '<div class="grid" id="ugrid"></div>',
        `<div class="grid" id="ugrid">${element("ugrid").innerHTML}</div>`,
      )
      .replace('<main id="page" class="pg" hidden></main>', "")
      .replace('id="go" href="#"', 'id="go" href="https://wa.link/9vzwi5"');
  }
  html = links(html, base).replace(
    "<body>",
    `<body data-base="${base}" data-category="${arg && type === "servicos" ? arg : ""}">`,
  );
  html = html.replace(
    /<script>try\{[\s\S]*?<\/script>/,
    `<script src="${base}assets/theme.js"></script>`,
  );
  html = html.replace(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g, (_, data) => {
    if (!images.has(data)) {
      const filename =
        images.size === 0
          ? "favicon.svg"
          : images.size === 1
            ? "logo.svg"
            : `logo-${images.size}.svg`;
      images.set(data, filename);
      fs.writeFileSync(path.join(root, "assets/images", filename), Buffer.from(data, "base64"));
    }
    return `${base}assets/images/${images.get(data)}`;
  });
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), html);
}
require("node:child_process").execFileSync(process.execPath, [path.join(__dirname, "format.cjs")], {
  stdio: "inherit",
});
console.log(
  `Generated and formatted ${destinations.length} pages, preserving the original styles.`,
);
