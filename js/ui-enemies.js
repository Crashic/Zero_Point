// Окно «Враги на карте» (по нажатию на миникарту): список врагов с уровнем; нажатие — атаковать.
(function (ZP) {
  const U = ZP.util;
  const $ = (id) => document.getElementById(id);
  const E = (ZP.uiEnemies = { last: 0 });

  E.render = (force) => {
    const now = performance.now();
    if (!force && now - E.last < 600) return;
    E.last = now;
    const H = ZP.hero, field = ZP.world.maps.field, inField = H.map === 'field';
    const from = inField ? H : field.gates.north;
    const list = ZP.enemies.list.filter((e) => !e.dead).map((e) => ({ e, d: Math.hypot(e.x - from.x, e.y - from.y) })).sort((a, b) => a.d - b.d);
    const byCat = ZP.CAT_ORDER.map((c) => `${ZP.CATS[c].name}: ${list.filter((x) => x.e.cat === c).length}`).join(' · ');
    $('enemy-sum').textContent = `Звериные луга — ${list.length} врагов. ${byCat}. ` + (inField ? 'Расстояние — от героини.' : 'Героиня в деревне, расстояние — от ворот лугов.') + ' Нажмите на врага, чтобы атаковать его.';
    $('enemy-list').innerHTML = list.map(({ e, d }) => {
      const tags = [];
      if (e === H.target) tags.push('<span class="tag">цель</span>');
      if (e.id === H.avoidId && H.avoidUntil > ZP.time.clock) tags.push('<span class="tag bad">убил вас</span>');
      if (e.aggro) tags.push('<span class="tag warn">преследует</span>');
      return `<button class="erow${e === H.target ? ' on' : ''}" type="button" data-id="${e.id}">
        <span class="elv ol" style="color:${ZP.levelColor(e.L)}">${e.L}</span>
        <span class="ename"><b>${e.name}</b><small>${ZP.CATS[e.cat].one} · ${Math.ceil(e.hp)}/${e.st.hp} ОЗ</small></span>
        <span class="etags">${tags.join('')}</span>
        <span class="edist">${Math.round(d / 32)} м</span>
      </button>`;
    }).join('') || '<p class="hint">Врагов не осталось — новые появятся через 1–5 минут.</p>';
  };

  E.init = () => {
    $('enemy-list').addEventListener('click', (ev) => {
      const b = ev.target.closest('.erow'); if (!b) return;
      const e = ZP.enemies.list.find((x) => x.id === +b.dataset.id);
      if (e && !e.dead) { ZP.heroAI.forceTarget(e); ZP.ui.close('win-enemies'); ZP.ui.render(); }
    });
  };
})(window.ZP);
