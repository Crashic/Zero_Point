// Спрайты окружения: деревья, дома, бочки, камни, частокол, ворота, факелы, манекен.
// Всё рисуется кодом в пиксельном стиле. Точка (x, y) — основание предмета на земле.
(function (ZP) {
  const OUT = '#1a1008';
  const S = (ZP.sprites = ZP.sprites || {});
  S.OUT = OUT;

  S.shadow = (c, x, y, rx, ry) => { c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); };

  function barrel(c, o) {
    const w = o.r * 1.5, h = o.r * 1.7, x = o.x - w / 2, yb = o.y + o.r * 0.45;
    S.shadow(c, o.x + 3, yb, o.r * 0.95, o.r * 0.35);
    c.fillStyle = OUT; c.fillRect(x - 1.5, yb - h - 1.5, w + 3, h + 3);
    c.fillStyle = '#7a4a22'; c.fillRect(x, yb - h, w, h);
    c.fillStyle = '#5a3417'; c.fillRect(x + w * 0.72, yb - h, w * 0.28, h);
    c.fillStyle = '#9d6835'; c.fillRect(x + w * 0.12, yb - h, w * 0.13, h);
    c.fillStyle = '#2b1a0c'; c.fillRect(x, yb - h * 0.78, w, h * 0.09); c.fillRect(x, yb - h * 0.3, w, h * 0.09);
    c.fillStyle = '#a8743f'; c.beginPath(); c.ellipse(o.x, yb - h, w / 2, w * 0.22, 0, 0, 7); c.fill();
    c.strokeStyle = '#4a2c12'; c.lineWidth = 1.5; c.stroke();
  }
  function rock(c, o) {
    const R = o.r, cy = o.y - R * 0.25;
    S.shadow(c, o.x + 4, o.y + R * 0.35, R * 1.05, R * 0.35);
    const poly = (k, col) => { c.fillStyle = col; c.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = (1 + 0.12 * Math.sin(i * 2.7 + o.x)) * k; c.lineTo(o.x + Math.cos(a) * R * rr, cy + Math.sin(a) * R * 0.78 * rr); } c.closePath(); c.fill(); };
    poly(1.06, OUT); poly(1, '#7b8489');
    c.fillStyle = '#4f575b'; c.beginPath(); c.ellipse(o.x + R * 0.15, cy + R * 0.42, R * 0.85, R * 0.3, 0, 0, Math.PI); c.fill();
    c.fillStyle = '#a6b0b4'; c.beginPath(); c.ellipse(o.x - R * 0.25, cy - R * 0.32, R * 0.5, R * 0.24, -0.3, 0, 7); c.fill();
    c.fillStyle = '#5d8a3e'; c.fillRect(o.x + R * 0.1, cy - R * 0.6, R * 0.35, R * 0.14);
  }
  function hay(c, o) {
    const w = o.r * 1.9, h = o.r * 1.3, x = o.x - w / 2, yb = o.y + o.r * 0.45;
    S.shadow(c, o.x + 4, yb, o.r * 1.1, o.r * 0.35);
    c.fillStyle = OUT; c.fillRect(x - 1.5, yb - h - o.r * 0.4 - 1.5, w + 3, h + o.r * 0.4 + 3);
    c.fillStyle = '#e9c86f'; c.fillRect(x, yb - h - o.r * 0.4, w, o.r * 0.4);
    c.fillStyle = '#cfa64e'; c.fillRect(x, yb - h, w, h);
    c.fillStyle = '#a8832f'; for (let i = 1; i < 6; i++) c.fillRect(x + 2, yb - h + i * h / 6, w - 4, 1.4);
    c.fillStyle = '#6b4a1c'; c.fillRect(x + w * 0.3, yb - h - o.r * 0.4, 2.4, h + o.r * 0.4); c.fillRect(x + w * 0.68, yb - h - o.r * 0.4, 2.4, h + o.r * 0.4);
  }
  function post(c, o) {
    c.fillStyle = OUT; c.fillRect(o.x - 4, o.y - 19, 8, 20);
    c.fillStyle = '#6b4626'; c.fillRect(o.x - 2.8, o.y - 17, 5.6, 17);
    c.fillStyle = '#8f6236'; c.fillRect(o.x - 2.8, o.y - 17, 1.8, 17);
    c.fillStyle = '#6b4626'; c.beginPath(); c.moveTo(o.x - 4, o.y - 18); c.lineTo(o.x, o.y - 23); c.lineTo(o.x + 4, o.y - 18); c.fill();
  }
  function gatePost(c, o) {
    c.fillStyle = OUT; c.fillRect(o.x - 6, o.y - 46, 12, 47);
    c.fillStyle = '#5a3a1e'; c.fillRect(o.x - 4.5, o.y - 44, 9, 44);
    c.fillStyle = '#7d5530'; c.fillRect(o.x - 4.5, o.y - 44, 3, 44);
    c.fillStyle = '#c2a14a'; c.fillRect(o.x - 6, o.y - 48, 12, 4);
  }
  function gateBar(c, o) {
    // перекладина ворот между двумя столбами (o.x1 .. o.x2)
    c.fillStyle = OUT; c.fillRect(o.x1 - 8, o.y - 52, o.x2 - o.x1 + 16, 10);
    c.fillStyle = '#6b4626'; c.fillRect(o.x1 - 6, o.y - 50, o.x2 - o.x1 + 12, 6);
    c.fillStyle = '#8f6236'; c.fillRect(o.x1 - 6, o.y - 50, o.x2 - o.x1 + 12, 2);
  }
  function sign(c, o) {
    c.fillStyle = OUT; c.fillRect(o.x - 2.5, o.y - 26, 5, 27);
    c.fillStyle = '#5a3a1e'; c.fillRect(o.x - 1.5, o.y - 25, 3, 25);
    const w = 26, h = 13, x = o.x - w / 2, y = o.y - 36;
    c.fillStyle = OUT; c.fillRect(x - 1.5, y - 1.5, w + 3, h + 3);
    c.fillStyle = '#9d6835'; c.fillRect(x, y, w, h);
    c.fillStyle = '#7a4a22'; c.fillRect(x, y + h - 3, w, 3);
    // стрелка
    c.fillStyle = '#f4e4bd';
    const cx = o.x, cy = y + h / 2 - 1, d = o.dir;
    c.save(); c.translate(cx, cy); c.rotate(d === 'e' ? 0 : d === 's' ? Math.PI / 2 : d === 'w' ? Math.PI : -Math.PI / 2);
    c.fillRect(-7, -1.2, 9, 2.4); c.beginPath(); c.moveTo(6, 0); c.lineTo(1, -4); c.lineTo(1, 4); c.fill();
    c.restore();
  }
  function torch(c, o, t) {
    c.fillStyle = OUT; c.fillRect(o.x - 3, o.y - 34, 6, 35);
    c.fillStyle = '#5b3b1f'; c.fillRect(o.x - 2, o.y - 33, 4, 33);
    c.fillStyle = '#3b3b3b'; c.fillRect(o.x - 5, o.y - 37, 10, 4);
    const f = Math.sin(t * 18 + o.x) * 1.5 + Math.sin(t * 31 + o.y);
    c.fillStyle = '#ff8a2a'; c.beginPath(); c.ellipse(o.x, o.y - 43, 5, Math.max(4, 8 + f * 0.6), 0, 0, 7); c.fill();
    c.fillStyle = '#ffe07a'; c.beginPath(); c.ellipse(o.x, o.y - 41, 2.6, 4.5, 0, 0, 7); c.fill();
  }
  S.torchLight = (c, o, t) => {
    const R = 70 + Math.sin(t * 9 + o.x) * 4, g = c.createRadialGradient(o.x, o.y - 30, 2, o.x, o.y - 30, R);
    g.addColorStop(0, 'rgba(255,170,70,.32)'); g.addColorStop(1, 'rgba(255,140,40,0)');
    c.fillStyle = g; c.beginPath(); c.arc(o.x, o.y - 30, R, 0, 7); c.fill();
  };
  function tree(c, o) {
    const z = o.sz, x = o.x, y = o.y;
    S.shadow(c, x + 6 * z, y + 2, 26 * z, 8 * z);
    c.fillStyle = OUT; c.fillRect(x - 5 * z, y - 16 * z, 10 * z, 17 * z);
    c.fillStyle = '#5a3a1e'; c.fillRect(x - 3.5 * z, y - 15 * z, 7 * z, 15 * z);
    if (o.kind === 'pine') {
      for (let i = 0; i < 3; i++) {
        const by = y - 12 * z - i * 17 * z, hw = (30 - i * 7) * z, h = 28 * z;
        c.fillStyle = OUT; c.beginPath(); c.moveTo(x - hw - 2, by + 2); c.lineTo(x, by - h - 2); c.lineTo(x + hw + 2, by + 2); c.fill();
        c.fillStyle = '#24451f'; c.beginPath(); c.moveTo(x - hw, by); c.lineTo(x, by - h); c.lineTo(x + hw, by); c.fill();
        c.fillStyle = '#35652b'; c.beginPath(); c.moveTo(x - hw, by); c.lineTo(x, by - h); c.lineTo(x - hw * 0.15, by); c.fill();
        c.fillStyle = '#4f8a3a'; c.fillRect(x - hw * 0.5, by - h * 0.45, hw * 0.25, 2 * z);
      }
    } else {
      const blobs = [[0, -44, 24], [-16, -32, 17], [16, -32, 17], [0, -26, 18]];
      for (const [dx, dy, rr] of blobs) { c.fillStyle = OUT; c.beginPath(); c.arc(x + dx * z, y + dy * z, (rr + 1.5) * z, 0, 7); c.fill(); }
      for (const [dx, dy, rr] of blobs) { c.fillStyle = '#2f5a26'; c.beginPath(); c.arc(x + dx * z, y + dy * z, rr * z, 0, 7); c.fill(); }
      for (const [dx, dy, rr] of blobs) { c.fillStyle = '#447a33'; c.beginPath(); c.arc(x + (dx - 4) * z, y + (dy - 5) * z, rr * 0.6 * z, 0, 7); c.fill(); }
      c.fillStyle = '#62a047'; c.fillRect(x - 12 * z, y - 58 * z, 8 * z, 3 * z); c.fillRect(x - 26 * z, y - 40 * z, 6 * z, 3 * z);
      if (o.fruit) { c.fillStyle = '#d8453a'; c.fillRect(x + 8 * z, y - 40 * z, 3 * z, 3 * z); c.fillRect(x - 6 * z, y - 30 * z, 3 * z, 3 * z); c.fillRect(x + 14 * z, y - 26 * z, 3 * z, 3 * z); }
    }
  }
  function bush(c, o) {
    const z = o.sz, x = o.x, y = o.y;
    S.shadow(c, x + 3, y + 1, 16 * z, 5 * z);
    const blobs = [[-8, -8, 9], [7, -9, 9], [0, -14, 10]];
    for (const [dx, dy, rr] of blobs) { c.fillStyle = OUT; c.beginPath(); c.arc(x + dx * z, y + dy * z, (rr + 1.5) * z, 0, 7); c.fill(); }
    for (const [dx, dy, rr] of blobs) { c.fillStyle = '#2f6a2a'; c.beginPath(); c.arc(x + dx * z, y + dy * z, rr * z, 0, 7); c.fill(); }
    c.fillStyle = '#4d8f3a'; c.fillRect(x - 6 * z, y - 18 * z, 5 * z, 2 * z); c.fillRect(x + 4 * z, y - 13 * z, 4 * z, 2 * z);
    if (o.berries) { c.fillStyle = '#7a5cd8'; c.fillRect(x - 3 * z, y - 9 * z, 2.5 * z, 2.5 * z); c.fillRect(x + 6 * z, y - 6 * z, 2.5 * z, 2.5 * z); }
  }
  function house(c, o) {
    const x = o.x, y = o.y, w = 116, wallH = 54, roofH = 54;
    S.shadow(c, x + 8, y + 4, 66, 14);
    // стены
    c.fillStyle = OUT; c.fillRect(x - w / 2 - 2, y - wallH - 2, w + 4, wallH + 4);
    c.fillStyle = '#b8945e'; c.fillRect(x - w / 2, y - wallH, w, wallH);
    c.fillStyle = '#9a7646'; for (let i = 1; i < 5; i++) c.fillRect(x - w / 2, y - wallH + i * wallH / 5, w, 1.5);
    c.fillStyle = '#6b4626'; c.fillRect(x - w / 2, y - wallH, 5, wallH); c.fillRect(x + w / 2 - 5, y - wallH, 5, wallH);
    // дверь и окно
    c.fillStyle = OUT; c.fillRect(x - 12, y - 34, 24, 34);
    c.fillStyle = '#5a3417'; c.fillRect(x - 10, y - 32, 20, 32);
    c.fillStyle = '#7a4a22'; c.fillRect(x - 10, y - 32, 6, 32);
    c.fillStyle = '#e2b14f'; c.fillRect(x + 5, y - 17, 3, 3);
    const wx = o.flip ? x - 42 : x + 24;
    c.fillStyle = OUT; c.fillRect(wx - 1, y - 40, 20, 18);
    c.fillStyle = '#ffd877'; c.fillRect(wx + 1, y - 38, 16, 14);
    c.fillStyle = '#6b4626'; c.fillRect(wx + 8, y - 38, 2, 14); c.fillRect(wx + 1, y - 32, 16, 2);
    // крыша
    c.fillStyle = OUT; c.beginPath(); c.moveTo(x - w / 2 - 12, y - wallH + 4); c.lineTo(x, y - wallH - roofH - 4); c.lineTo(x + w / 2 + 12, y - wallH + 4); c.fill();
    c.fillStyle = o.roof || '#a5432a'; c.beginPath(); c.moveTo(x - w / 2 - 8, y - wallH + 1); c.lineTo(x, y - wallH - roofH); c.lineTo(x + w / 2 + 8, y - wallH + 1); c.fill();
    c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.moveTo(x, y - wallH - roofH); c.lineTo(x + w / 2 + 8, y - wallH + 1); c.lineTo(x + 10, y - wallH + 1); c.fill();
    c.fillStyle = 'rgba(255,220,180,.18)'; for (let i = 1; i < 4; i++) c.fillRect(x - w / 2 + i * 6, y - wallH - i * 13, w - i * 12, 2);
    // труба
    c.fillStyle = OUT; c.fillRect(x + 22, y - wallH - roofH + 10, 14, 26);
    c.fillStyle = '#7b6a5c'; c.fillRect(x + 24, y - wallH - roofH + 12, 10, 22);
  }
  function well(c, o) {
    const x = o.x, y = o.y;
    S.shadow(c, x + 3, y + 3, 22, 7);
    c.fillStyle = OUT; c.fillRect(x - 20, y - 20, 40, 22);
    c.fillStyle = '#7b8489'; c.fillRect(x - 18, y - 18, 36, 18);
    c.fillStyle = '#5f676b'; for (let i = 0; i < 3; i++) c.fillRect(x - 18, y - 12 + i * 6, 36, 1.5);
    c.fillStyle = '#1d2a35'; c.beginPath(); c.ellipse(x, y - 19, 16, 5, 0, 0, 7); c.fill();
    c.fillStyle = OUT; c.fillRect(x - 18, y - 52, 5, 34); c.fillRect(x + 13, y - 52, 5, 34);
    c.fillStyle = '#6b4626'; c.fillRect(x - 17, y - 51, 3, 32); c.fillRect(x + 14, y - 51, 3, 32);
    c.fillStyle = OUT; c.beginPath(); c.moveTo(x - 26, y - 46); c.lineTo(x, y - 62); c.lineTo(x + 26, y - 46); c.fill();
    c.fillStyle = '#a5432a'; c.beginPath(); c.moveTo(x - 23, y - 47); c.lineTo(x, y - 60); c.lineTo(x + 23, y - 47); c.fill();
    c.fillStyle = '#c9b38a'; c.fillRect(x - 1, y - 46, 2, 18);
    c.fillStyle = '#7a4a22'; c.fillRect(x - 4, y - 30, 8, 6);
  }
  function stone(c, o, t) {
    // камень воскрешения
    const x = o.x, y = o.y, gl = 0.5 + Math.sin(t * 2.4) * 0.25;
    const g = c.createRadialGradient(x, y - 14, 2, x, y - 14, 46);
    g.addColorStop(0, `rgba(120,200,255,${0.35 * gl})`); g.addColorStop(1, 'rgba(120,200,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y - 14, 46, 0, 7); c.fill();
    c.fillStyle = 'rgba(120,200,255,.18)'; c.beginPath(); c.ellipse(x, y + 2, 30, 10, 0, 0, 7); c.fill();
    c.fillStyle = OUT; c.fillRect(x - 15, y - 8, 30, 10);
    c.fillStyle = '#7b8489'; c.fillRect(x - 13, y - 6, 26, 7);
    c.fillStyle = OUT; c.beginPath(); c.moveTo(x, y - 40); c.lineTo(x + 9, y - 20); c.lineTo(x, y - 6); c.lineTo(x - 9, y - 20); c.fill();
    c.fillStyle = '#7fd0ff'; c.beginPath(); c.moveTo(x, y - 37); c.lineTo(x + 7, y - 20); c.lineTo(x, y - 8); c.lineTo(x - 7, y - 20); c.fill();
    c.fillStyle = '#e6f6ff'; c.beginPath(); c.moveTo(x, y - 37); c.lineTo(x - 7, y - 20); c.lineTo(x - 2, y - 20); c.fill();
  }
  const DS = 1.4;
  function dummy(c, o, t) {
    const shake = o.shake > 0 ? Math.sin(t * 90) * o.shake * 8 : 0;
    c.save(); c.translate(o.x, o.y); c.scale(DS, DS); c.translate(-o.x, -o.y);
    const x = o.x + shake, y = o.y - 17;
    S.shadow(c, o.x, y + 17, 16, 5);
    c.fillStyle = OUT; c.fillRect(o.x - 3.5, y - 5, 7, 23); c.fillRect(o.x - 11, y + 13, 22, 6);
    c.fillStyle = '#5a3a1e'; c.fillRect(o.x - 2.5, y - 4, 5, 21); c.fillRect(o.x - 10, y + 14, 20, 4);
    c.fillStyle = OUT; c.fillRect(x - 20, y - 10, 40, 5); c.fillStyle = '#8a6a3a'; c.fillRect(x - 19, y - 9, 38, 3);
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x, y, 12.5, 15.5, 0, 0, 7); c.fill();
    c.fillStyle = '#d8b56a'; c.beginPath(); c.ellipse(x, y, 11, 14, 0, 0, 7); c.fill();
    c.fillStyle = '#b8933f'; c.beginPath(); c.ellipse(x + 3, y + 2, 7, 11, 0, 0, 7); c.fill();
    c.fillStyle = '#d8b56a'; c.beginPath(); c.ellipse(x - 1, y, 8, 12, 0, 0, 7); c.fill();
    c.strokeStyle = '#a5432a'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y + 1, 7, 8.5, 0, 0, 7); c.stroke();
    c.fillStyle = '#a5432a'; c.beginPath(); c.arc(x, y + 1, 3, 0, 7); c.fill();
    c.fillStyle = OUT; c.beginPath(); c.arc(x, y - 21, 8.3, 0, 7); c.fill();
    c.fillStyle = '#cfa95c'; c.beginPath(); c.arc(x, y - 21, 7, 0, 7); c.fill();
    c.fillStyle = '#8f6d2c'; c.fillRect(x - 4, y - 21.5, 8, 1.2); c.fillRect(x - 0.6, y - 25, 1.2, 8);
    c.restore();
  }

  const DRAW = { barrel, rock, hay, post, gatePost, gateBar, sign, torch, tree, bush, house, well, stone, dummy };
  S.drawProp = (c, o, t) => { const f = DRAW[o.k]; if (f) f(c, o, t); };
})(window.ZP);
