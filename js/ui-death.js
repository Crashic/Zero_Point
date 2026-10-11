// Окно воскрешения: открывается само при гибели героини. Здесь можно выбрать зелья для автозакупки.
// Воскрешение — по кнопке или через 8 секунд; если игрок меняет зелья, таймер ждёт кнопку.
(function (ZP) {
  const $ = (id) => document.getElementById(id);
  const Dw = (ZP.uiDeath = { openAt: 0, hold: false, killer: null });

  Dw.render = () => {
    $('death-autobuy').innerHTML = ZP.uiBag.autobuyHTML();
    const cost = ZP.potions.setCost(), coins = ZP.save.data.coins;
    $('death-cost').textContent = cost ? `Нужно ${cost} коин., у вас ${coins}.` + (cost > coins ? ' Хватит не на всё.' : '') : `Набор собран или не выбран. Коинов: ${coins}.`;
  };
  Dw.open = (killer) => {
    Dw.killer = killer; Dw.hold = false; Dw.openAt = performance.now();
    for (const w of ['win-skills', 'win-char', 'win-menu', 'win-bag', 'win-enemies']) $(w).hidden = true;
    $('death-sub').textContent = killer ? `Её одолел враг: ${killer.name}, ур. ${killer.L}. После воскрешения она выберет другую цель.` : '';
    Dw.render();
    $('win-death').hidden = false;
  };
  Dw.close = () => { $('win-death').hidden = true; };
  Dw.revive = () => { if (!ZP.hero.dead) return; Dw.close(); ZP.world.respawnHero(); };
  // вызывается каждый кадр
  Dw.tick = (now) => {
    const H = ZP.hero, el = $('win-death');
    if (!H.dead) { if (!el.hidden) Dw.close(); return; }
    if (el.hidden) { if (H.deathT > 0.6) Dw.open(Dw.killer); return; }
    if (Dw.hold) { $('death-timer').textContent = 'Таймер остановлен — нажмите «Воскреснуть», когда будете готовы.'; return; }
    const left = ZP.RESPAWN_TIME - (now - Dw.openAt) / 1000;
    if (left <= 0) { Dw.revive(); return; }
    $('death-timer').textContent = `Воскрешение через ${Math.ceil(left)} с. Измените набор — и таймер подождёт.`;
  };
  Dw.init = () => {
    $('death-autobuy').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ab]'); if (!b) return;
      Dw.hold = true; ZP.uiBag.stepAutobuy(b); Dw.render();
    });
    $('revive-btn').addEventListener('click', Dw.revive);
  };
})(window.ZP);
