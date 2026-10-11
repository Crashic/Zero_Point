// Отрисовка земли локации в отдельный пиксельный буфер (трава, земля, тропы, цветы).
// Буфер строится один раз на локацию и масштаб, потом просто копируется на экран.
(function (ZP) {
  const U = ZP.util;
  const G = (ZP.ground = { cache: {} });

  G.get = (map, g) => {
    const key = map.id + '|' + g.toFixed(4);
    if (!G.cache[key]) { for (const k in G.cache) if (k.startsWith(map.id + '|')) delete G.cache[k]; G.cache[key] = build(map, g); }
    return G.cache[key];
  };

  function noise(c, w, h, seed) {
    const img = c.getImageData(0, 0, w, h), d = img.data, r = U.seeded(seed), f = [0.84, 0.92, 1.08, 1.14];
    for (let i = 0; i < d.length; i += 4) {
      if (r() < 0.28) { const k = f[(r() * 4) | 0]; d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); }
    }
    c.putImageData(img, 0, 0);
  }

  function build(map, g) {
    const M = map.M, cw = Math.ceil((map.W + 2 * M) / g), ch = Math.ceil((map.H + 2 * M) / g);
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const c = cv.getContext('2d');
    const T = () => c.setTransform(1 / g, 0, 0, 1 / g, M / g, M / g);
    const r = U.seeded(map.id === 'village' ? 7 : 17);
    T();
    // лесная подстилка за границей и трава внутри
    c.fillStyle = '#30561f'; c.fillRect(-M, -M, map.W + 2 * M, map.H + 2 * M);
    c.fillStyle = '#3e6e2e'; c.fillRect(-30, -30, map.W + 60, map.H + 60);
    const path = (x, y, w, h) => { c.fillStyle = '#7f6140'; c.fillRect(x, y, w, h); };

    if (map.id === 'village') {
      for (const gt of Object.values(map.gates)) {
        if (gt.side === 's') path(gt.x - 30, map.H, 60, M);
        if (gt.side === 'e') path(map.W, gt.y - 30, M, 60);
      }
      c.fillStyle = '#6a4f30'; c.fillRect(-10, -10, map.W + 20, map.H + 20);
      c.fillStyle = '#7d5f3d'; c.fillRect(-4, -4, map.W + 8, map.H + 8);
      c.fillStyle = 'rgba(160,125,80,.35)'; c.beginPath(); c.ellipse(map.W / 2, map.H * 0.56, map.W * 0.32, map.H * 0.3, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(120,200,255,.10)'; c.beginPath(); c.ellipse(map.respawn.x, map.respawn.y - 26, 70, 26, 0, 0, 7); c.fill();
      // клумбы у домов
      c.fillStyle = '#4a7d36'; c.fillRect(100, 196, 140, 14); c.fillRect(720, 176, 140, 14);
    } else {
      // земляные проплешины
      for (let i = 0; i < 45; i++) {
        const x = r() * map.W, y = r() * map.H, rx = 30 + r() * 70, ry = rx * (0.4 + r() * 0.3);
        c.fillStyle = r() < 0.5 ? 'rgba(111,90,58,.55)' : 'rgba(90,120,50,.5)'; c.beginPath(); c.ellipse(x, y, rx, ry, r() * 3, 0, 7); c.fill();
      }
      // тропы от ворот вглубь лугов
      for (const gt of Object.values(map.gates)) {
        c.fillStyle = '#7f6140';
        let x = gt.x - gt.nx * M, y = gt.y - gt.ny * M, w = 56;
        for (let s = 0; s < 34; s++) {
          c.globalAlpha = s < 20 ? 1 : 1 - (s - 20) / 14;
          c.beginPath(); c.ellipse(x, y, w / 2, w / 2, 0, 0, 7); c.fill();
          x += gt.nx * 24 + (gt.ny ? (r() - 0.5) * 18 : 0); y += gt.ny * 24 + (gt.nx ? (r() - 0.5) * 18 : 0); w = Math.max(30, w - 0.6);
        }
        c.globalAlpha = 1;
      }
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    noise(c, cw, ch, map.id === 'village' ? 11 : 23);
    T();
    const px = g;
    // пучки травы
    const area = (map.W + 2 * M) * (map.H + 2 * M);
    for (let i = 0; i < area / 700; i++) {
      const x = -M + r() * (map.W + 2 * M), y = -M + r() * (map.H + 2 * M);
      if (map.id === 'village' && x > -12 && x < map.W + 12 && y > -12 && y < map.H + 12) continue;
      c.fillStyle = '#2c5220'; c.fillRect(x, y, px, px * 2); c.fillRect(x + px * 2, y, px, px * 2);
      c.fillStyle = '#6aa045'; c.fillRect(x + px, y - px, px, px * 3);
    }
    // цветы
    const fl = ['#f2e27a', '#f29ab8', '#ffffff', '#9fd0ff', '#ff8a5a'];
    for (let i = 0; i < area / 5200; i++) {
      const x = -M + r() * (map.W + 2 * M), y = -M + r() * (map.H + 2 * M);
      if (map.id === 'village' && x > -30 && x < map.W + 30 && y > -30 && y < map.H + 30) continue;
      c.fillStyle = fl[(r() * fl.length) | 0];
      c.fillRect(x, y, px, px); c.fillRect(x + px * 2, y + px, px, px); c.fillRect(x - px, y + px * 2, px, px);
    }
    if (map.id === 'village') {
      // камешки во дворе
      for (let i = 0; i < 30; i++) { const x = 10 + r() * (map.W - 20), y = 10 + r() * (map.H - 20), w = px * (3 + ((r() * 4) | 0)); c.fillStyle = '#8a8576'; c.fillRect(x, y, w, px * 2); c.fillStyle = '#a9a596'; c.fillRect(x, y, w - px, px); }
      // жерди частокола
      c.fillStyle = '#3a2512';
      const gs = map.gates.south, ge = map.gates.east;
      c.fillRect(0, -15, map.W, px * 1.6);
      c.fillRect(0, map.H - 7, gs.x - 44, px * 1.6); c.fillRect(gs.x + 44, map.H - 7, map.W - gs.x - 44, px * 1.6);
    } else {
      for (let i = 0; i < 60; i++) { const x = r() * map.W, y = r() * map.H, w = px * (2 + ((r() * 3) | 0)); c.fillStyle = '#8a8576'; c.fillRect(x, y, w, px * 2); c.fillStyle = '#a9a596'; c.fillRect(x, y, w - px, px); }
    }
    return cv;
  }
})(window.ZP);
