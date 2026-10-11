// Окно «Сумка»: выпавшие предметы, их цена в коинах, продажа.
(function (ZP) {
  const $ = (id) => document.getElementById(id);
  const B = (ZP.uiBag = { sel: null, sig: '' });
  const SLOTS_MIN = 24;

  B.render = (force) => {
    const inv = ZP.save.data.inventory, ids = ZP.ITEM_ORDER.filter((id) => inv[id] > 0);
    const sig = JSON.stringify(inv) + '|' + ZP.save.data.coins + '|' + B.sel;
    if (!force && sig === B.sig) return;
    B.sig = sig;
    $('bag-coins').textContent = ZP.save.data.coins;
    $('bag-summary').textContent = ids.length ? `${ZP.inventory.totalItems()} предм. на ${ZP.inventory.totalValue()} коин.` : 'Сумка пуста';
    const sa = $('sell-all'); sa.disabled = !ids.length;
    if (B.sel && !inv[B.sel]) B.sel = null;
    const cells = [];
    for (const id of ids) {
      const it = ZP.ITEMS[id];
      cells.push(`<button class="bslot${B.sel === id ? ' on' : ''}" type="button" data-id="${id}" aria-label="${it.name}, ${inv[id]} шт." style="--rc:${ZP.RARITY[it.rar].color}">
        <img src="${ZP.pix.itemUrl(id)}" alt="">${ZP.inventory.fresh.has(id) ? '<i class="new"></i>' : ''}<span class="n ol">${inv[id]}</span></button>`);
    }
    const total = Math.max(SLOTS_MIN, Math.ceil(cells.length / 6) * 6);
    for (let i = cells.length; i < total; i++) cells.push('<span class="bslot empty"></span>');
    $('bag-grid').innerHTML = cells.join('');
    // карточка предмета
    const card = $('item-card');
    if (!B.sel) {
      card.innerHTML = ids.length
        ? '<p class="hint">Нажмите на предмет, чтобы посмотреть его и продать.</p>'
        : '<p class="hint">Предметы выпадают из побеждённых врагов с шансом от 10% (1 уровень) до 30% (10 уровень). У каждого типа врагов своя добыча.</p>';
      return;
    }
    const it = ZP.ITEMS[B.sel], n = inv[B.sel], rc = ZP.RARITY[it.rar];
    card.innerHTML = `<div class="icard-head"><img src="${ZP.pix.itemUrl(B.sel)}" alt=""><div><h3 class="ol" style="color:${rc.color}">${it.name}</h3><div class="hint">${rc.name} · добыча: ${ZP.CATS[it.cat].name.toLowerCase()}</div></div></div>
      <p class="idesc">${it.desc}</p>
      <div class="mline"><span>В сумке</span><span>${n} шт.</span></div>
      <div class="mline"><span>Цена</span><span>${it.price} коин. за шт.</span></div>
      <div class="sell-row"><button class="gbtn" type="button" id="sell-one">Продать 1 · ${it.price}</button>${n > 1 ? `<button class="gbtn" type="button" id="sell-stack">Продать ${n} · ${it.price * n}</button>` : ''}</div>`;
    $('sell-one').addEventListener('click', () => { ZP.inventory.sell(B.sel, 1); B.render(true); });
    if (n > 1) $('sell-stack').addEventListener('click', () => { ZP.inventory.sell(B.sel, n); B.render(true); });
  };

  B.init = () => {
    $('bag-coin-ico').src = ZP.pix.coinUrl();
    $('bag-grid').addEventListener('click', (e) => {
      const b = e.target.closest('.bslot[data-id]'); if (!b) return;
      B.sel = b.dataset.id; ZP.inventory.fresh.delete(B.sel); B.render(true);
    });
    const sa = $('sell-all'); let armT = null;
    sa.addEventListener('click', () => {
      if (sa.dataset.armed !== 'true') { sa.dataset.armed = 'true'; sa.textContent = `Точно? +${ZP.inventory.totalValue()} коин.`; clearTimeout(armT); armT = setTimeout(() => { sa.dataset.armed = 'false'; sa.textContent = 'Продать всё'; }, 3000); return; }
      clearTimeout(armT); sa.dataset.armed = 'false'; sa.textContent = 'Продать всё';
      ZP.inventory.sellAll(); B.sel = null; B.render(true);
    });
  };
  B.open = () => { B.sel = null; B.render(true); };
})(window.ZP);
