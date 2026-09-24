# Clínica Bethesda

Site estático com 21 páginas HTML, mantendo o design e o conteúdo do protótipo.

Execute `node scripts/serve.cjs` e acesse http://127.0.0.1:4173. Também é possível abrir index.html diretamente.

## Onde editar

- `index.html`: estrutura e textos da página inicial.
- Demais arquivos `.html`, incluindo as pastas `servicos` e `unidade`: estrutura e textos de cada página.
- `assets/styles.css`: cores, fontes, espaçamentos, temas e layout responsivo.
- `assets/site.js`: busca, filtros, botões e menu.
- `assets/theme.js`: aplicação do tema salvo antes de carregar a página.
- `assets/images/`: logo e favicon em SVG, extraídos das imagens originais.

Os arquivos estão formatados com indentação de dois espaços. Não é necessário compilar para editar e visualizar o site: salve o arquivo e atualize o navegador. Para formatar novamente, execute `node scripts/format.cjs` com a dependência de desenvolvimento Prettier instalada.

Para hospedar, envie os arquivos HTML da raiz e as pastas assets, servicos e unidade para uma hospedagem estática. Não há dependências de instalação ou backend. O agendamento usa os contatos de WhatsApp originais.

O original está preservado em `prototipo/index.html` apenas como referência. O script `scripts/build.cjs` permite reconstruir a conversão a partir dele, mas sobrescreve edições nos arquivos do site; não é necessário executá-lo no uso normal. O CSS mantém as regras originais, com formatação legível. Os espaços reservados para imagens e os dados de contato foram preservados. A fonte continua sendo carregada do Google Fonts, como no original.

Páginas: início, serviços, sete categorias de serviços, Bethesda TEA, Home Care, saúde ocupacional, convênios, sobre e sete unidades. Links antigos com #/ continuam funcionando.
