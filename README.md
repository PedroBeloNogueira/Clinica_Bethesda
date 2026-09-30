# Clínica Bethesda

Site estático com 21 páginas HTML, mantendo o design e o conteúdo do protótipo.

Execute `node scripts/serve.cjs` e acesse http://127.0.0.1:4173. Também é possível abrir index.html diretamente.

## Onde editar

- `index.html`: estrutura e textos da página inicial.
- Demais arquivos `.html`, incluindo as pastas `servicos` e `unidade`: estrutura e textos de cada página.
- `assets/styles.css`: cores, fontes, espaçamentos, temas e layout responsivo.
- `assets/site.js`: busca, filtros, botões e menu.
- `assets/theme.js`: aplicação do tema salvo antes de carregar a página.
- `assets/images/`: fotos, logo e favicon. As páginas usam caminhos relativos compatíveis com GitHub Pages, incluindo quando o site fica no endereço do repositório.

Os arquivos estão formatados com indentação de dois espaços. Não é necessário compilar para editar e visualizar o site: salve o arquivo e atualize o navegador. Para formatar novamente, execute `node scripts/format.cjs` com a dependência de desenvolvimento Prettier instalada.

Para hospedar, envie os arquivos HTML da raiz e as pastas assets, servicos e unidade para uma hospedagem estática. Não há dependências de instalação ou backend. O agendamento usa os contatos de WhatsApp originais.

O original está preservado em `prototipo/index.html` apenas como referência. O script `scripts/build.cjs` permite reconstruir a conversão a partir dele, mas sobrescreve edições nos arquivos do site; não é necessário executá-lo no uso normal. O CSS mantém as regras originais, com formatação legível. Os espaços reservados para imagens e os dados de contato foram preservados. A fonte continua sendo carregada do Google Fonts, como no original.

Páginas: início, serviços, sete categorias de serviços, Bethesda TEA, Home Care, saúde ocupacional, convênios, sobre e sete unidades. Links antigos com #/ continuam funcionando.

## Catálogo de produtos

`produtos.html` apresenta 19 fichas da revista `Revista_Agora_Vai_Padronizada_Ativos.pdf`, com busca, categorias e carrinho salvo no navegador. A página inicial e os menus dão acesso ao catálogo. `assets/products-data.js` contém nomes, descrições, volumes, preços em centavos, origem, uso e página da fonte; `assets/images/produtos/` contém as imagens extraídas da revista. Itens citados somente na tabela de queixas, sem ficha comercial, não foram cadastrados.

O botão de finalizar abre uma mensagem editável no WhatsApp da Matriz, **55 96 98125-3776**, configurado em `assets/marketplace.js`. Inclui nome, categoria, volume e quantidade de cada produto, solicitando disponibilidade e confirmação de valores e entrega. Não há cobrança, reserva de estoque ou envio automático. Os preços são referências da revista; dados ausentes e instruções de aplicação incompletas estão indicados nas fichas.

O comportamento está em `assets/marketplace.js` e os estilos em `assets/marketplace.css`. Edite diretamente esses arquivos; a reconstrução pelo protótipo também remove os novos links dos menus e o destaque na página inicial.
