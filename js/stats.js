// Характеристики героини и зверей, формулы боя.
(function (ZP) {
  const U = ZP.util;

  ZP.STAT_ORDER = ['hp', 'atk', 'dodge', 'def', 'agi', 'int', 'str'];
  ZP.STAT_NAMES = { hp: 'Здоровье', atk: 'Атака', dodge: 'Уворот', def: 'Защита', agi: 'Ловкость', int: 'Интеллект', str: 'Сила' };
  ZP.STAT_DESC = {
    hp: 'Сколько урона можно выдержать. На нуле героиня погибает и воскресает в деревне.',
    atk: 'Базовый урон каждого удара любым оружием.',
    dodge: 'Повышает шанс полностью избежать удара.',
    def: 'Снижает весь получаемый урон.',
    agi: 'Ускоряет атаки, немного повышает уворот, усиливает кинжал и лук.',
    int: 'Усиливает удары посохом.',
    str: 'Усиливает удары мечом.',
  };

  ZP.PLAYER_BASE = { hp: 200, atk: 12, dodge: 6, def: 6, agi: 10, int: 10, str: 10 };

  ZP.stats = {
    // шанс увернуться: уворот + треть ловкости, с потолком 50%
    dodgeChance(s) { const v = s.dodge + s.agi * 0.3; return Math.min(0.5, v / (v + 60)); },
    // множитель входящего урона от защиты
    reduction(s) { return 50 / (50 + s.def); },
    attackSpeedMul(s) { return 1 + s.agi * 0.01; },
    playerRaw(k) { const w = ZP.WEAPONS[k], p = ZP.PLAYER_BASE; return p.atk + w.base + p[w.attr] * w.attrK; },
    enemyRaw(s) { return s.atk + s.str * 0.5; },
    rollDamage(raw, target) { return Math.max(1, Math.round(raw * U.rnd(0.85, 1.15) * this.reduction(target))); },
    enemyHitChance: 0.85,
  };

  // Звери. lv — уровни, на которых встречается вид; остальные числа — множители к базовым характеристикам.
  ZP.ANIMALS = {
    rabbit: { name: 'Заяц',    lv: [1, 3],  hp: 0.6, atk: 0.6, dod: 1.6, def: 0.5, agi: 1.4, str: 0.5, speed: 120 },
    fox:    { name: 'Лиса',    lv: [2, 5],  hp: 0.8, atk: 0.9, dod: 1.4, def: 0.7, agi: 1.3, str: 0.8, speed: 130 },
    boar:   { name: 'Кабан',   lv: [3, 7],  hp: 1.3, atk: 1.1, dod: 0.6, def: 1.4, agi: 0.8, str: 1.3, speed: 105 },
    wolf:   { name: 'Волк',    lv: [5, 9],  hp: 1.1, atk: 1.3, dod: 1.2, def: 1.0, agi: 1.3, str: 1.1, speed: 140 },
    bear:   { name: 'Медведь', lv: [8, 10], hp: 1.9, atk: 1.5, dod: 0.5, def: 1.5, agi: 0.7, str: 1.6, speed: 100 },
  };

  ZP.makeEnemyStats = (type, L) => {
    const t = ZP.ANIMALS[type];
    return {
      hp: Math.round((30 + L * 20) * t.hp),
      atk: Math.round((3 + L * 1.7) * t.atk),
      dodge: Math.round((2 + L * 0.9) * t.dod),
      def: Math.round((1 + L * 1.3) * t.def),
      agi: Math.round((4 + L * 1.4) * t.agi),
      int: Math.round(1 + L * 0.5),
      str: Math.round((3 + L * 1.6) * t.str),
    };
  };

  ZP.typeForLevel = (L) => {
    const c = Object.keys(ZP.ANIMALS).filter((k) => L >= ZP.ANIMALS[k].lv[0] && L <= ZP.ANIMALS[k].lv[1]);
    return c[(Math.random() * c.length) | 0];
  };

  // цвет подписи уровня — насколько зверь опасен
  ZP.levelColor = (L) => (L <= 2 ? '#9cf07a' : L <= 4 ? '#e8f07a' : L <= 6 ? '#ffd36a' : L <= 8 ? '#ff9a5a' : '#ff6a5a');
})(window.ZP);
