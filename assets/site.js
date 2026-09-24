"use strict";
const BASE = document.body.dataset.base;
const G = "https://wa.link/9vzwi5",
  M = "5596981253776",
  S = ["matriz", "tea", "ambulatorial", "reabilitar", "ocupacional", "pedra-branca", "laranjal"];
const U = [
  [
    "Bethesda Matriz",
    "Consultas, exames e especialidades",
    "Av. Anhanguera, 1478A, Buritizal, Macapá",
    "5596981253776",
    "(96) 98125-3776",
  ],
  [
    "Bethesda TEA",
    "Terapias e desenvolvimento infantil",
    "Av. Anhanguera, 1478A, Buritizal, Macapá",
    null,
    "",
  ],
  [
    "Bethesda Ambulatorial",
    "Curativos, medicação e Home Care",
    "Av. Clodóvio Coelho, 1601, Buritizal, Macapá",
    "5596999120037",
    "(96) 99912-0037",
  ],
  [
    "Bethesda Reabilitar",
    "Fisioterapia, Pilates e estética",
    "R. Hildemar Maia, 2554, Buritizal, Macapá",
    "5596981410090",
    "(96) 98141-0090",
  ],
  [
    "Bethesda Ocupacional",
    "Saúde do trabalhador e empresas",
    "Av. Anhanguera, 1508, Buritizal, Macapá",
    "5596981410090",
    "(96) 98141-0090",
  ],
  [
    "Bethesda Pedra Branca",
    "Consultas e exames",
    "R. Francisco Brás, 275, Centro, Pedra Branca do Amapari",
    "5596984145366",
    "(96) 98414-5366",
  ],
  [
    "Bethesda Laranjal do Jari",
    "Atendimento no sul do Amapá",
    "Av. Tancredo Neves, 2235, Agreste, Laranjal do Jari",
    null,
    "",
  ],
];

const N = (x) =>
  x
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const wl = (n, t) => `https://wa.me/${n}?text=${encodeURIComponent(t)}`;
const uw = (i) => (U[i][3] ? wl(U[i][3], "Olá! Gostaria de agendar na " + U[i][0] + ".") : G);
const mp = (i) =>
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(U[i][2] + " AP");
const CAT = {
  c: "Consultas e especialidades",
  m: "Saúde mental",
  t: "TEA e desenvolvimento",
  r: "Reabilitação e bem-estar",
  e: "Exames e diagnóstico",
  a: "Ambulatório e cuidado em casa",
  o: "Saúde ocupacional",
};
const L = (c, u, x) => x.split(",").map((n) => [n, c, u]);
const SV = [
  ...L(
    "c",
    "matriz",
    "Clínica Geral,Cardiologia,Dermatologia,Ginecologia,Infectologia,Neurologia,Ortopedia,Pediatria,Pneumologia",
  ),
  ["Nutrição", "c", "matriz,tea"],
  ["Psicologia", "m", "matriz,tea"],
  ["Psiquiatria", "m", "matriz,tea"],
  ...L(
    "t",
    "tea",
    "Fonoaudiologia,Terapia Ocupacional,Psicomotricidade,Psicopedagogia,Musicoterapia,Neuropsicologia",
  ),
  ["Fisioterapia", "r", "tea,reabilitar"],
  ["Estética", "r", "ambulatorial,reabilitar"],
  ...L(
    "r",
    "reabilitar",
    "Reabilitação Motora,Pilates,Massoterapia,Reflexologia,Aluguel de equipamentos hospitalares",
  ),
  ["Raio-X", "e", "matriz,pedra-branca"],
  ["Ultrassonografia", "e", "pedra-branca,ocupacional"],
  ["Eletrocardiograma", "e", "ocupacional,pedra-branca"],
  ["Espirometria", "e", "ocupacional,pedra-branca"],
  ["Audiometria", "e", "ocupacional,pedra-branca"],
  ...L(
    "e",
    "ocupacional",
    "Acuidade Visual,Eletroencefalograma,Holter,MAPA,Teste Ergométrico,Oftalmológico,Exames Laboratoriais",
  ),
  ...L(
    "a",
    "ambulatorial",
    "Curativos de média e alta complexidade,Aplicação de medicamentos,Ozonioterapia,Laserterapia,Ambulância,Home Care 24h",
  ),
  ...L("o", "ocupacional", "Médico Ocupacional,Programas Ocupacionais,E-Social"),
];

const btn = (t, h) =>
  `<a class="btn btn-wa" href="${h || G}" target="_blank" rel="noopener">${t}</a>`;
function initSv(a) {
  let c = CAT[a] ? a : "",
    q = "";
  const r = document.getElementById("res"),
    f = document.getElementById("cf");
  f.innerHTML = [["", "Todos"], ...Object.entries(CAT)]
    .map(
      (x) => `<button class="chip" data-c="${x[0]}" aria-pressed="${x[0] == c}">${x[1]}</button>`,
    )
    .join("");
  const draw = () => {
    const h = SV.filter((x) => (!c || x[1] == c) && N(x[0] + " " + CAT[x[1]]).includes(N(q))).map(
      (x) => {
        const us = x[2].split(",");
        return `<div class="unit"><h3>${x[0]}</h3><p style="margin:0;color:var(--muted)">${CAT[x[1]]}</p><address>Onde: ${us.map((k) => `<a href="${BASE}unidade/${k}.html">${U[S.indexOf(k)][0].replace("Bethesda ", "")}</a>`).join(", ")}</address><div class="row">${btn("Agendar", uw(S.indexOf(us[0])))}</div></div>`;
      },
    );
    r.innerHTML =
      h.join("") || `<p>Não encontramos esse serviço. Chame no WhatsApp e ajudamos você.</p>`;
  };
  document.getElementById("q").oninput = (e) => {
    q = e.target.value;
    draw();
  };
  f.onclick = (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    c = b.dataset.c;
    f.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x == b));
    draw();
  };
  draw();
}

if (document.getElementById("go")) {
  let sel = "";
  const go = document.getElementById("go");
  function upd() {
    go.href = sel
      ? `https://wa.me/${M}?text=${encodeURIComponent("Olá! Gostaria de agendar: " + sel + ".")}`
      : G;
  }
  document.getElementById("chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const on = b.getAttribute("aria-pressed") === "true";
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    if (!on) {
      b.setAttribute("aria-pressed", "true");
      sel = b.textContent;
    } else sel = "";
    upd();
  });
  upd();
}
if (document.getElementById("q")) initSv(document.body.dataset.category);
const tt = document.querySelector(".tt"),
  rt = document.documentElement;
function lab() {
  const d = rt.dataset.theme === "dark",
    l = d ? "Ativar tema claro" : "Ativar tema escuro";
  tt.setAttribute("aria-label", l);
  tt.title = l;
  const m = document.querySelector("meta[name=theme-color]");
  if (m) m.content = d ? "#17211D" : "#FFFFFF";
}
tt.onclick = () => {
  const d = rt.dataset.theme !== "dark";
  rt.classList.add("tt-anim");
  rt.dataset.theme = d ? "dark" : "light";
  try {
    localStorage.setItem("bethesda-theme", d ? "dark" : "light");
  } catch (e) {}
  lab();
  setTimeout(() => rt.classList.remove("tt-anim"), 300);
};
lab();
const mb = document.querySelector(".mb"),
  nv = document.getElementById("nv");
mb.onclick = () => {
  const o = nv.classList.toggle("open");
  mb.setAttribute("aria-expanded", o);
};
nv.onclick = (e) => {
  if (e.target.closest("a")) {
    nv.classList.remove("open");
    mb.setAttribute("aria-expanded", false);
  }
};

function legacyRoute() {
  if (location.hash.startsWith("#/")) {
    const route = location.hash.slice(2);
    const routes = [
      "servicos",
      "tea",
      "homecare",
      "empresas",
      "convenios",
      "sobre",
      "servicos/c",
      "servicos/m",
      "servicos/t",
      "servicos/r",
      "servicos/e",
      "servicos/a",
      "servicos/o",
      "unidade/matriz",
      "unidade/tea",
      "unidade/ambulatorial",
      "unidade/reabilitar",
      "unidade/ocupacional",
      "unidade/pedra-branca",
      "unidade/laranjal",
    ];
    if (routes.includes(route)) location.replace(BASE + route + ".html");
  }
}
addEventListener("hashchange", legacyRoute);
legacyRoute();
