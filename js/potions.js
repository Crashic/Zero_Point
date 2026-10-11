// Эликсиры: питьё по порогу здоровья и автозакупка при воскрешении в деревне.
(function (ZP) {
  const Pn = (ZP.potions = { cd: 0 });
  const D = () => ZP.save.data;
  const st = () => D().settings;

  Pn.count = (id) => D().potions[id] || 0;
  Pn.total = () => ZP.POTION_ORDER.reduce((a, id) => a + Pn.count(id), 0);

  Pn.drink = (id, auto) => {
    const H = ZP.hero, p = ZP.POTIONS[id];
    if (!p || Pn.count(id) <= 0 || H.dead || H.hp >= H.max) return false;
    D().potions[id]--; if (!D().potions[id]) delete D().potions[id];
    const got = Math.min(p.heal, H.max - H.hp);
    H.hp = Math.min(H.max, H.hp + p.heal);
    Pn.cd = 1.5;
    ZP.fx.float(H.x, H.y - ZP.HERO_FX + 12, '+' + Math.round(got) + ' ОЗ', '#6ef08a', true);
    ZP.fx.burst(H.x, H.y - 24, 10, ['#ff7a8a', '#ffd0d8', '#6ef08a'], 70);
    ZP.ui.log(`${ZP.HERO_NAME} пьёт «${p.name}»: +${Math.round(got)} ОЗ.${auto ? '' : ' (вручную)'}`, 'loot');
    ZP.save.write(); ZP.ui.dirty();
    return true;
  };

  // какое зелье пить: самое маленькое, которого хватает на недостающее здоровье; иначе самое большое из имеющихся
  Pn.pick = () => {
    const H = ZP.hero, miss = H.max - H.hp, have = ZP.POTION_ORDER.filter((id) => Pn.count(id) > 0);
    if (!have.length) return null;
    return have.find((id) => ZP.POTIONS[id].heal >= miss) || have[have.length - 1];
  };

  Pn.update = (dt) => {
    Pn.cd -= dt;
    const H = ZP.hero, at = st().drinkAt;
    if (at <= 0 || H.dead || Pn.cd > 0 || H.map !== 'field') return;
    if ((H.hp / H.max) * 100 <= at) { const id = Pn.pick(); if (id) Pn.drink(id, true); else Pn.cd = 2; }
  };

  // автозакупка: докупить до заданного количества; если коинов мало — по одному по кругу, на сколько хватит
  Pn.autoBuy = (silent) => {
    const want = st().autobuy, bought = {};
    let spent = 0, progress = true;
    while (progress) {
      progress = false;
      for (const id of ZP.POTION_ORDER) {
        const need = (want[id] || 0) - Pn.count(id);
        const price = ZP.POTIONS[id].price;
        if (need > 0 && D().coins >= price) {
          D().coins -= price; spent += price;
          D().potions[id] = Pn.count(id) + 1; bought[id] = (bought[id] || 0) + 1; progress = true;
        }
      }
    }
    const list = Object.entries(bought).map(([id, n]) => `${ZP.POTIONS[id].name} ×${n}`);
    const short = ZP.POTION_ORDER.some((id) => (want[id] || 0) > Pn.count(id));
    if (list.length) ZP.ui.log(`Автозакупка: ${list.join(', ')} за ${spent} коин.` + (short ? ' На остальное коинов не хватило.' : ''), 'gold');
    else if (short && !silent) ZP.ui.log('Автозакупка: не хватает коинов.', 'miss');
    if (list.length) { ZP.save.write(); ZP.ui.dirty(); }
    return spent;
  };
  Pn.setCost = () => ZP.POTION_ORDER.reduce((a, id) => a + Math.max(0, (st().autobuy[id] || 0) - Pn.count(id)) * ZP.POTIONS[id].price, 0);
})(window.ZP);
