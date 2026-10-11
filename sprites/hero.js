// Спрайт героини Аэлис: серебряное тело из «жидкого металла», гребень, светящиеся глаза,
// голубая энергия вдоль руки, когти на свободной руке. Оружие — в вытянутой руке.
(function (ZP) {
  const S = (ZP.sprites = ZP.sprites || {});
  const U = ZP.util;
  const HS = (S.HERO_SCALE = 1.75);
  const LINE = '#262c34';

  S.heroAim = (H) => U.clamp(Math.atan2(Math.sin(H.face), Math.abs(Math.cos(H.face))), -1.25, 1.25);
  S.heroFlip = (H) => (Math.cos(H.face) < 0 ? -1 : 1);
  // точка ладони в мире (откуда вылетают стрелы и сферы)
  S.handPos = (H) => { const la = S.heroAim(H), f = S.heroFlip(H); return { x: H.x + f * HS * (3 + Math.cos(la) * 12), y: H.y + 12 + HS * (-33 + Math.sin(la) * 12) }; };

  function silver(c, x0, y0, x1, y1) { const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#f6f9fc'); g.addColorStop(0.45, '#c9d2da'); g.addColorStop(1, '#7a8592'); return g; }
  function limb(c, pts, w, fill) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.strokeStyle = LINE; c.lineWidth = w + 1.6; c.stroke(); c.strokeStyle = fill; c.lineWidth = w; c.stroke();
  }
  function claws(c, x, y) {
    c.strokeStyle = '#e8eef3'; c.lineWidth = 0.9;
    for (const a of [0.9, 1.3, 1.7]) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * 3, y + Math.sin(a) * 3, x + Math.cos(a + 0.4) * 5.5, y + Math.sin(a + 0.4) * 5.5); c.stroke(); }
  }

  function weapon(c, H, k, t) {
    if (k === 'sword') {
      const spin = H.animDur && H.spin, sw = spin ? t * Math.PI * 2 : H.animDur ? (-1.4 + 2.7 * U.easeOut(t)) * H.swingSign : -0.55;
      c.save(); c.rotate(sw);
      c.strokeStyle = '#4a3420'; c.lineWidth = 3; c.beginPath(); c.moveTo(-4, 0); c.lineTo(2, 0); c.stroke();
      c.strokeStyle = '#c2a14a'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(2, -4); c.lineTo(2, 4); c.stroke();
      c.strokeStyle = LINE; c.lineWidth = 4.4; c.beginPath(); c.moveTo(3, 0); c.lineTo(29, 0); c.stroke();
      c.strokeStyle = '#e6ecf1'; c.lineWidth = 3; c.beginPath(); c.moveTo(3, 0); c.lineTo(29, 0); c.stroke();
      c.restore();
      if (spin) { c.strokeStyle = 'rgba(120,200,255,.6)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 30, 0, t * Math.PI * 2); c.stroke(); }
      else if (H.animDur && t > 0.2 && t < 0.85) { c.strokeStyle = 'rgba(160,215,255,.5)'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 29, -1.4 * H.swingSign, (-1.4 + 2.7 * U.easeOut(t)) * H.swingSign, H.swingSign < 0); c.stroke(); }
    } else if (k === 'dagger') {
      const th = H.animDur ? Math.sin(t * Math.PI) * 12 : 0;
      c.save(); c.translate(th, 0);
      c.strokeStyle = '#4a3420'; c.lineWidth = 3; c.beginPath(); c.moveTo(-3, 0); c.lineTo(2, 0); c.stroke();
      c.strokeStyle = LINE; c.lineWidth = 3.6; c.beginPath(); c.moveTo(3, 0); c.lineTo(15, 0); c.stroke();
      c.strokeStyle = '#dfe6ec'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(3, 0); c.lineTo(15, 0); c.stroke();
      c.restore();
    } else if (k === 'bow') {
      const pull = H.animDur ? (t < 0.55 ? t / 0.55 : 0) : 0, cx = -6, R = 12, ex = cx + Math.cos(1.1) * R, ey = Math.sin(1.1) * R, px = -1 - pull * 10;
      c.strokeStyle = LINE; c.lineWidth = 3.6; c.beginPath(); c.arc(cx, 0, R, -1.1, 1.1); c.stroke();
      c.strokeStyle = '#8a5a30'; c.lineWidth = 2.2; c.beginPath(); c.arc(cx, 0, R, -1.1, 1.1); c.stroke();
      c.strokeStyle = '#e8f4ff'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(ex, -ey); c.lineTo(px, 0); c.lineTo(ex, ey); c.stroke();
      if (pull > 0 || !H.animDur) { c.strokeStyle = '#cbb58a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px, 0); c.lineTo(px + 22, 0); c.stroke(); c.fillStyle = '#bfe3ff'; c.beginPath(); c.moveTo(px + 26, 0); c.lineTo(px + 21, -2.5); c.lineTo(px + 21, 2.5); c.fill(); }
    } else {
      const glow = H.animDur ? Math.sin(t * Math.PI) : 0;
      c.save(); c.rotate(-0.25);
      c.strokeStyle = LINE; c.lineWidth = 3.6; c.beginPath(); c.moveTo(-12, 0); c.lineTo(20, 0); c.stroke();
      c.strokeStyle = '#7a5532'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-12, 0); c.lineTo(20, 0); c.stroke();
      const r = 6 + glow * 9, g = c.createRadialGradient(22, 0, 1, 22, 0, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, 'rgba(110,190,255,.9)'); g.addColorStop(1, 'rgba(79,179,255,0)');
      c.fillStyle = g; c.beginPath(); c.arc(22, 0, r, 0, 7); c.fill();
      c.restore();
    }
  }

  // фигура в локальных координатах: ступни в (0,0), рост ~55
  S.drawFigure = (c, H, k, la, st, t, withWeapon, clock) => {
    c.lineJoin = 'round'; c.lineCap = 'round';
    const bh = [-4.5 + st * 1.5, -20];
    limb(c, [[-2, -33], [-4, -27], bh], 2.6, '#a9b3bc'); claws(c, bh[0], bh[1]);
    limb(c, [[-2.2, -16], [-2.6 + st * 2, -8], [-2.4 + st * 4, 0]], 3.2, '#9aa5af');
    limb(c, [[2.2, -16], [2.6 - st * 2, -8], [2.4 - st * 4, 0]], 3.4, '#d5dde4');
    c.strokeStyle = '#eef3f7'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(2.4 - st * 4, 0); c.lineTo(5 - st * 4, 0.4); c.stroke();
    c.beginPath(); c.moveTo(-6, -35); c.quadraticCurveTo(-3, -29, -3.6, -24); c.quadraticCurveTo(-6.2, -20, -5.6, -15.5);
    c.lineTo(5.6, -15.5); c.quadraticCurveTo(6.4, -20, 3.8, -24); c.quadraticCurveTo(4.6, -30, 6.4, -35); c.quadraticCurveTo(0, -37.5, -6, -35); c.closePath();
    c.fillStyle = silver(c, -6, -37, 6, -15); c.fill(); c.strokeStyle = LINE; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = '#5b6570'; c.lineWidth = 0.9;
    c.beginPath(); c.moveTo(-3.5, -32); c.quadraticCurveTo(-0.5, -30, 0.5, -27); c.moveTo(2, -25.5); c.quadraticCurveTo(3.5, -22, 2.5, -19); c.moveTo(-4.5, -21); c.quadraticCurveTo(-2, -19, -1, -16.5); c.moveTo(1.5, -33.5); c.lineTo(3.5, -30.5); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-2, -34); c.quadraticCurveTo(-1, -31, -2.4, -28); c.moveTo(3.6, -28); c.lineTo(4.4, -25); c.stroke();
    c.fillStyle = '#e2e9ef'; c.strokeStyle = LINE; c.lineWidth = 0.8;
    for (const sx of [-6, 6]) { c.beginPath(); c.moveTo(sx - 2, -34); c.lineTo(sx + Math.sign(sx) * 1.5, -38.5); c.lineTo(sx + Math.sign(sx) * 2.5, -33); c.closePath(); c.fill(); c.stroke(); }
    c.fillStyle = '#b9c3cc'; c.fillRect(-0.8, -38.5, 2.6, 3);
    c.beginPath(); c.ellipse(1, -42.5, 4.2, 5, 0, 0, 7); c.fillStyle = silver(c, -3, -48, 5, -37); c.fill(); c.strokeStyle = LINE; c.lineWidth = 1.1; c.stroke();
    c.beginPath(); c.moveTo(-3.4, -44); c.lineTo(-5.2, -51); c.lineTo(-1.8, -47.5); c.lineTo(-0.6, -55); c.lineTo(1.4, -47.8); c.lineTo(3.2, -52.5); c.lineTo(4.4, -45.5); c.closePath();
    c.fillStyle = silver(c, -4, -55, 4, -44); c.fill(); c.stroke();
    c.strokeStyle = '#6b7580'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-0.6, -53); c.lineTo(0, -46); c.stroke();
    c.save(); c.shadowColor = '#bfe8ff'; c.shadowBlur = 6; c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(1.6, -43, 0.9, 0.55, 0, 0, 7); c.ellipse(3.9, -43, 0.9, 0.55, 0, 0, 7); c.fill(); c.restore();
    const Sh = [3, -33], E = [3 + Math.cos(la) * 6.5, -33 + Math.sin(la) * 6.5 + 1], Hd = [3 + Math.cos(la) * 12, -33 + Math.sin(la) * 12];
    c.save(); c.shadowColor = '#4fb3ff'; c.shadowBlur = 8;
    for (const [w, col, ph] of [[1.8, 'rgba(90,180,255,.85)', 0], [0.8, 'rgba(225,245,255,.95)', 1.3]]) {
      c.beginPath();
      for (let i = 0; i <= 16; i++) { const u = i / 16, x = -11 + (Hd[0] + 11) * u, y = -28 + (Hd[1] + 28) * u, wv = Math.sin(u * Math.PI * 3 + clock * 6 + ph) * 2.6 * (1 - u * 0.6); if (i) c.lineTo(x, y + wv); else c.moveTo(x, y + wv); }
      c.strokeStyle = col; c.lineWidth = w; c.stroke();
    }
    c.restore();
    limb(c, [Sh, E, Hd], 2.8, '#dde4ea');
    const pulse = 4.5 + Math.sin(clock * 5) * 0.8 + (k === 'staff' && H.animDur ? Math.sin(t * Math.PI) * 4 : 0);
    const hg = c.createRadialGradient(Hd[0], Hd[1], 0.5, Hd[0], Hd[1], pulse);
    hg.addColorStop(0, 'rgba(255,255,255,.95)'); hg.addColorStop(0.5, 'rgba(110,195,255,.7)'); hg.addColorStop(1, 'rgba(79,179,255,0)');
    c.fillStyle = hg; c.beginPath(); c.arc(Hd[0], Hd[1], pulse, 0, 7); c.fill();
    if (withWeapon) { c.save(); c.translate(Hd[0], Hd[1]); c.rotate(la); weapon(c, H, k, t); c.restore(); }
  };

  S.drawHero = (c, H, clock) => {
    const k = H.weapon, flip = S.heroFlip(H), la = S.heroAim(H);
    const st = H.moving ? Math.sin(H.bob) : 0, bob = H.moving ? Math.abs(Math.cos(H.bob)) * 1.4 : 0, t = H.animDur ? H.anim / H.animDur : 0;
    S.shadow(c, H.x, H.y + 12, 13 * HS, 4.5 * HS);
    if (H.dead) {
      // падает на бок и тает
      const p = Math.min(1, H.deathT * 3), a = Math.max(0, 1 - H.deathT / 2.6);
      c.save(); c.globalAlpha = a; c.translate(H.x, H.y + 12); c.scale(flip * HS, HS); c.rotate(-p * Math.PI / 2);
      S.drawFigure(c, H, k, 0, 0, 0, false, clock); c.restore();
      return;
    }
    const ag = c.createRadialGradient(H.x, H.y + 11, 2, H.x, H.y + 11, 26 * HS);
    ag.addColorStop(0, H.hurtFlash > 0 ? 'rgba(255,80,60,.45)' : 'rgba(79,179,255,.25)'); ag.addColorStop(1, 'rgba(79,179,255,0)');
    c.fillStyle = ag; c.beginPath(); c.ellipse(H.x, H.y + 11, 26 * HS, 9 * HS, 0, 0, 7); c.fill();
    c.save(); c.translate(H.x, H.y + 12 - bob * HS); c.scale(flip * HS, HS);
    S.drawFigure(c, H, k, la, st, t, true, clock);
    c.restore();
  };

  // портрет: голова и плечи крупным планом
  S.drawPortrait = (c, size, H, clock) => {
    c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false;
    const g = c.createRadialGradient(size / 2, size * 0.45, 2, size / 2, size / 2, size * 0.7);
    g.addColorStop(0, H.dead ? '#5a2a2a' : '#2a5a86'); g.addColorStop(1, '#0c1824');
    c.fillStyle = g; c.fillRect(0, 0, size, size);
    const k = size / 32;
    c.setTransform(1.5 * k, 0, 0, 1.5 * k, (16 - 1.5) * k, (17 + 1.5 * 44) * k);
    S.drawFigure(c, H, H.weapon, 0, 0, 0, false, clock);
    c.setTransform(1, 0, 0, 1, 0, 0);
  };
})(window.ZP);
