// Сумка героини и коины: добыча с врагов, продажа предметов.
(function (ZP) {
  const U = ZP.util;
  const I = (ZP.inventory = { loot: [], fresh: new Set() });
  const inv = () => ZP.save.data.inventory;

  I.count = (id) => inv()[id] || 0;
  I.coins = () => ZP.save.data.coins;
  I.totalItems = () => Object.values(inv()).reduce((a, b) => a + b, 0);
  I.totalValue = () => Object.entries(inv()).reduce((a, [id, n]) => a + (ZP.ITEMS[id] ? ZP.ITEMS[id].price * n : 0), 0);
  I.add = (id, n = 1) => { inv()[id] = I.count(id) + n; I.fresh.add(id); ZP.ui.dirty(); };

  // бросок добычи при победе: 10–30% в зависимости от уровня; предмет — из категории врага
  I.rollDrop = (e) => {
    if (Math.random() >= ZP.dropChance(e.L)) return null;
    const pool = ZP.ITEM_ORDER.filter((id) => ZP.ITEMS[id].cat === e.cat);
    let sum = pool.reduce((a, id) => a + ZP.RARITY[ZP.ITEMS[id].rar].weight, 0), x = Math.random() * sum;
    for (const id of pool) { x -= ZP.RARITY[ZP.ITEMS[id].rar].weight; if (x <= 0) return id; }
    return pool[0];
  };
  I.onKill = (e) => {
    const id = I.rollDrop(e);
    if (!id) return;
    I.add(id, 1);
    const it = ZP.ITEMS[id];
    // предмет подпрыгивает на земле и летит к героине
    I.loot.push({ id, map: ZP.world.cur.id, x: e.x, y: e.y, z: 0, vz: 90, t: 0 });
    ZP.fx.float(e.x, e.y - e.h - 44, '+ ' + it.name, ZP.RARITY[it.rar].color, true);
    ZP.ui.log(`Добыча: ${it.name} (${ZP.RARITY[it.rar].name.toLowerCase()}, ${it.price} коин.).`, 'loot');
  };
  I.update = (dt) => {
    const H = ZP.hero;
    I.loot = I.loot.filter((l) => {
      l.t += dt;
      if (l.t < 0.7) { l.vz -= 300 * dt; l.z = Math.max(0, l.z + l.vz * dt); return true; }
      const d = Math.hypot(H.x - l.x, H.y - 20 - l.y);
      if (d < 10 || l.map !== ZP.world.cur.id || H.dead) return false;
      const sp = 420 * dt; l.x += ((H.x - l.x) / d) * Math.min(d, sp); l.y += ((H.y - 20 - l.y) / d) * Math.min(d, sp); l.z *= 0.9;
      return true;
    });
  };
  I.drawLoot = (c, l) => {
    const cv = ZP.pix.itemCanvas(l.id), u = ZP.render.unit * 0.7, w = cv.width * u, h = cv.height * u;
    ZP.sprites.shadow(c, l.x, l.y, 6, 2);
    c.imageSmoothingEnabled = false;
    const x = ZP.render.snap(l.x - w / 2), y = ZP.render.snap(l.y - h - l.z);
    c.drawImage(cv, x, y, w, h);
    if (l.t < 0.7) { c.fillStyle = `rgba(255,255,220,${0.6 - l.t * 0.8})`; c.beginPath(); c.arc(l.x, l.y - h / 2 - l.z, 9, 0, 7); c.fill(); }
  };

  // продажа
  I.sell = (id, n) => {
    const have = I.count(id), it = ZP.ITEMS[id];
    n = Math.min(n, have); if (n <= 0 || !it) return 0;
    const gain = it.price * n;
    inv()[id] = have - n; if (!inv()[id]) delete inv()[id];
    ZP.save.data.coins += gain; ZP.save.data.coinsEarned = (ZP.save.data.coinsEarned || 0) + gain;
    ZP.ui.log(`Продано: ${it.name} ×${n} за ${gain} коин.`, 'gold');
    ZP.save.write(); ZP.ui.dirty();
    return gain;
  };
  I.sellAll = () => {
    let gain = 0, n = 0;
    for (const [id, cnt] of Object.entries(inv())) { if (!ZP.ITEMS[id]) continue; gain += ZP.ITEMS[id].price * cnt; n += cnt; }
    if (!n) return 0;
    ZP.save.data.inventory = {};
    ZP.save.data.coins += gain; ZP.save.data.coinsEarned = (ZP.save.data.coinsEarned || 0) + gain;
    ZP.ui.log(`Продано всё: ${n} предм. за ${gain} коин.`, 'gold');
    ZP.save.write(); ZP.ui.dirty();
    return gain;
  };
})(window.ZP);
