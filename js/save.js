// Сохранение прогресса в памяти браузера телефона (localStorage).
// При первом запуске версии 0.8 старые сохранения удаляются у всех игроков.
(function (ZP) {
  const KEY = 'zp-save-v1';
  const RESET_FLAG = 'zp-reset-0.8';
  // Старые ключи этой игры. Чужие ключи (другие игры на том же адресе github.io) не трогаем.
  const OLD_KEYS = ['training-yard-v1', 'training-yard-v2'];

  const fresh = () => ({
    v: 1,
    current: 'sword',
    skills: Object.fromEntries(ZP.ORDER.map((k) => [k, { m: 0, hits: 0, shots: 0, learned: [] }])),
    kills: 0,
    deaths: 0,
    killsByType: {},
    bestLevel: 0,
    savedAt: 0,
  });

  ZP.save = {
    data: fresh(),
    available: true,
    load() {
      let raw = null;
      try {
        if (!localStorage.getItem(RESET_FLAG)) {
          OLD_KEYS.forEach((k) => localStorage.removeItem(k));
          localStorage.removeItem(KEY);
          localStorage.setItem(RESET_FLAG, '1');
        }
        raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      } catch (e) { this.available = false; }
      const d = fresh();
      if (raw && raw.v === 1) {
        for (const k of ZP.ORDER) {
          const s = raw.skills && raw.skills[k];
          if (!s) continue;
          d.skills[k] = {
            m: Math.max(0, Math.min(ZP.MAX, s.m | 0)),
            hits: s.hits | 0,
            shots: s.shots | 0,
            learned: (s.learned || []).filter((id) => ZP.SKILL_NODES[k][id]),
          };
          // не больше изученных узлов, чем заработано очков
          const pts = Math.floor(d.skills[k].m / ZP.STEP);
          if (d.skills[k].learned.length > pts) d.skills[k].learned.length = pts;
        }
        if (ZP.WEAPONS[raw.current]) d.current = raw.current;
        d.kills = raw.kills | 0;
        d.deaths = raw.deaths | 0;
        d.bestLevel = raw.bestLevel | 0;
        d.killsByType = typeof raw.killsByType === 'object' && raw.killsByType ? raw.killsByType : {};
        d.savedAt = raw.savedAt || 0;
      }
      this.data = d;
      return d;
    },
    write() {
      this.data.savedAt = Date.now();
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); this.available = true; } catch (e) { this.available = false; }
    },
    wipe() {
      this.data = fresh();
      this.write();
    },
  };

  // Просим браузер не удалять данные игры при нехватке места.
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}
})(window.ZP);
