// Aplica o tema salvo antes de exibir a página.
try {
  if (localStorage.getItem("bethesda-theme") === "dark")
    document.documentElement.setAttribute("data-theme", "dark");
} catch (e) {}
