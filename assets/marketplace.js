"use strict";
(() => {
  const key = 'bethesda-cart-v1';
  const money = value => (value / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    for (const p of PRODUCTS) if (Number.isInteger(saved?.[p.id]) && saved[p.id] > 0) cart[p.id] = Math.min(99, saved[p.id]);
  } catch {}
  const list = document.getElementById('product-list');
  const items = document.getElementById('cart-items');
  const dialog = document.getElementById('cart-dialog');
  const checkout = document.getElementById('checkout');
  const status = document.getElementById('market-status');
  const label = p => `${p.name} — ${p.category}, ${p.volume} ml`;
  function drawProducts() {
    const search = normalize(document.getElementById('product-search').value.trim());
    const category = document.getElementById('product-category').value;
    const filtered = PRODUCTS.filter(p => (!category || category === p.category) && normalize(`${p.name} ${p.category} ${p.origin} ${p.botanical || ''}`).includes(search));
    list.innerHTML = filtered.map(p => `<article class="product-card">
      <div class="product-photo"><img src="./assets/images/produtos/${p.id}.webp" alt="${p.name}, ${p.volume} ml" width="320" height="640" loading="lazy"><span>${p.volume} ml</span></div>
      <div class="product-content"><span class="product-category">${p.category}</span><h2>${p.name}</h2><p>${p.description}</p>
      <p class="product-origin">Origem: <strong>${p.origin}</strong></p>
      <details><summary>Modo de uso e informações</summary><dl><dt>Forma de uso</dt><dd>${p.usage}</dd>${p.botanical ? `<dt>Nome botânico</dt><dd><i>${p.botanical}</i></dd>` : ''}${p.extraction ? `<dt>Extração / parte da planta</dt><dd>${p.extraction}</dd>` : ''}<dt>Fonte</dt><dd>Revista de produtos Bethesda, página ${p.page}. Origem conforme informada na revista.</dd></dl></details>
      <div class="product-buy"><div><strong>${money(p.price)}</strong><small>Preço da revista</small></div><button class="btn btn-g" data-add="${p.id}" aria-label="Adicionar ${label(p)} ao carrinho">Adicionar <span aria-hidden="true">+</span></button></div></div></article>`).join('') || '<p class="no-products">Nenhum produto encontrado. Tente outro nome ou categoria.</p>';
    document.getElementById('product-count').textContent = `${filtered.length} produtos encontrados`;
  }
  function drawCart() {
    const selected = PRODUCTS.filter(p => cart[p.id]);
    const count = selected.reduce((n,p) => n + cart[p.id], 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
    items.innerHTML = selected.map(p => `<li class="cart-item"><img src="./assets/images/produtos/${p.id}.webp" alt="" width="50" height="90"><div><strong>${p.name}</strong><small>${p.category} · ${p.volume} ml</small><span>${money(p.price * cart[p.id])}</span><div class="quantity"><button data-id="${p.id}" data-change="-1" aria-label="Diminuir quantidade de ${label(p)}" ${cart[p.id] === 1 ? 'disabled' : ''}>−</button><span aria-label="Quantidade">${cart[p.id]}</span><button data-id="${p.id}" data-change="1" aria-label="Aumentar quantidade de ${label(p)}" ${cart[p.id] === 99 ? 'disabled' : ''}>+</button><button class="remove-item" data-remove="${p.id}" aria-label="Remover ${label(p)}">Remover</button></div></div></li>`).join('');
    document.getElementById('empty-cart').hidden = count > 0;
    document.getElementById('cart-summary').hidden = count === 0;
    document.getElementById('cart-total').textContent = money(selected.reduce((n,p) => n + p.price * cart[p.id], 0));
    if (count) {
      const message = 'Olá! Me interessei pelos seguintes produtos da revista Bethesda:\n\n' + selected.map(p => `• ${label(p)} — ${cart[p.id]} unidade(s)`).join('\n') + '\n\nVocês têm esses produtos disponíveis? Poderiam confirmar os valores e as opções de retirada ou entrega?';
      checkout.href = `https://wa.me/5596981253776?text=${encodeURIComponent(message)}`;
    } else checkout.removeAttribute('href');
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(cart)); } catch { status.textContent = 'O carrinho está disponível nesta página, mas não pôde ser salvo neste navegador.'; }
    drawCart();
  }
  list.addEventListener('click', e => {
    const button = e.target.closest('[data-add]');
    if (!button) return;
    const id = button.dataset.add;
    if ((cart[id] || 0) >= 99) { status.textContent = 'Limite de 99 unidades por produto.'; return; }
    cart[id] = (cart[id] || 0) + 1;
    status.textContent = `${PRODUCTS.find(p => p.id === id).name} adicionado ao carrinho.`;
    save();
  });
  items.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    const id = button.dataset.id || button.dataset.remove;
    const oldIndex = [...items.querySelectorAll('button')].indexOf(button);
    if (button.dataset.remove) delete cart[id];
    else cart[id] = Math.max(1, Math.min(99, cart[id] + Number(button.dataset.change)));
    save();
    const buttons = items.querySelectorAll('button:not(:disabled)');
    (buttons[Math.min(oldIndex, buttons.length - 1)] || document.getElementById('close-cart')).focus();
  });
  document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  document.getElementById('close-cart').addEventListener('click', () => dialog.close());
  document.getElementById('continue-shopping').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog && (e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right || e.clientY < dialog.getBoundingClientRect().top || e.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  document.getElementById('product-search').addEventListener('input', drawProducts);
  document.getElementById('product-category').addEventListener('change', drawProducts);
  drawProducts();
  drawCart();
})();
