// Спрайты зверей: заяц, лиса, кабан, волк, медведь. Вид сбоку, пиксельные прямоугольники с контуром.
(function (ZP) {
  const S = (ZP.sprites = ZP.sprites || {});
  const OUT = '#1a1008';
  const Z = 1.3; // общий масштаб зверей

  const T = {
    rabbit: { body: '#9a8a78', shade: '#6e6152', light: '#c9bba8', belly: '#e8dfd2', bw: 15, bh: 10, hw: 9, hh: 8, leg: 3, legH: 4, ears: 'long', tail: 'puff', tailC: '#f2ece2', legC: '#7e705f' },
    fox:    { body: '#d4732a', shade: '#9a4c17', light: '#f09a4c', belly: '#f6e7d2', bw: 20, bh: 9, hw: 10, hh: 8, leg: 3, legH: 7, ears: 'point', tail: 'bushy', tailC: '#d4732a', tailTip: '#f6efe4', legC: '#3a2414', snout: 'long', nose: '#1a1008' },
    boar:   { body: '#5a4030', shade: '#3a2818', light: '#7a5a44', belly: '#4a3424', bw: 26, bh: 15, hw: 12, hh: 11, leg: 4, legH: 6, ears: 'small', tail: 'thin', tailC: '#3a2818', tusks: true, mane: '#2e2018', snout: 'pig', nose: '#8a5a50', legC: '#2e2018' },
    wolf:   { body: '#7d838a', shade: '#53585e', light: '#a9afb5', belly: '#c9cdd1', bw: 24, bh: 11, hw: 11, hh: 9, leg: 3, legH: 9, ears: 'point', tail: 'bushy', tailC: '#6d7379', tailTip: '#3e4247', legC: '#4a4e53', snout: 'long', nose: '#1a1008' },
    bear:   { body: '#6b4a2e', shade: '#4a321c', light: '#8a6440', belly: '#5c3f26', bw: 32, bh: 19, hw: 15, hh: 13, leg: 6, legH: 8, ears: 'round', tail: 'none', legC: '#4a321c', snout: 'bear', nose: '#1a1008' },
  };

  // размеры для столкновений и подписи (в пикселях мира)
  S.animalSize = (type) => { const t = T[type]; return { r: Math.round(t.bw * Z * 0.45), h: Math.round((t.legH + t.bh + t.hh * 0.6 + (t.ears === 'long' ? 9 : 3)) * Z) }; };

  function parts(t, walk, flash) {
    const P = [], col = (c) => (flash ? '#ffffff' : c);
    const { bw, bh, hw, hh, leg, legH } = t;
    const top = -legH - bh, p = Math.sin(walk) * 2;
    // дальние лапы
    P.push([-bw / 2 + 3 - p, -legH, leg, legH, col(t.shade)]);
    P.push([bw / 2 - leg - 1 + p, -legH, leg, legH, col(t.shade)]);
    // хвост
    if (t.tail === 'puff') P.push([-bw / 2 - 3, top + 1, 5, 5, col(t.tailC)]);
    if (t.tail === 'bushy') { P.push([-bw / 2 - 11, top + 1, 12, 5, col(t.tailC)]); P.push([-bw / 2 - 13, top + 2, 4, 3, col(t.tailTip)]); }
    if (t.tail === 'thin') P.push([-bw / 2 - 4, top + 2, 4, 2, col(t.tailC)]);
    // тело
    P.push([-bw / 2, top, bw, bh, col(t.body)]);
    P.push([-bw / 2 + 2, top, bw - 6, 2, col(t.light)]);
    P.push([-bw / 2 + 3, top + bh - 3, bw - 7, 3, col(t.belly)]);
    if (t.mane) P.push([-bw / 2 + 4, top - 2, bw - 8, 3, col(t.mane)]);
    // ближние лапы
    P.push([-bw / 2 + 1 + p, -legH, leg, legH, col(t.legC)]);
    P.push([bw / 2 - leg - 3 - p, -legH, leg, legH, col(t.legC)]);
    // голова
    const hx = bw / 2 - 4, hy = top - hh * 0.35;
    if (t.ears === 'long') { P.push([hx + 1, hy - 10, 3, 11, col(t.body)]); P.push([hx + 5, hy - 9, 3, 10, col(t.shade)]); P.push([hx + 2, hy - 8, 1, 7, col('#e8b0a8')]); }
    if (t.ears === 'point') { P.push([hx + 1, hy - 4, 3, 5, col(t.shade)]); P.push([hx + 5, hy - 4, 3, 5, col(t.body)]); P.push([hx + 2, hy - 6, 1, 2, col(t.shade)]); P.push([hx + 6, hy - 6, 1, 2, col(t.body)]); }
    if (t.ears === 'small') P.push([hx + 2, hy - 3, 4, 4, col(t.shade)]);
    if (t.ears === 'round') { P.push([hx + 1, hy - 3, 5, 4, col(t.shade)]); P.push([hx + hw - 6, hy - 3, 5, 4, col(t.shade)]); }
    P.push([hx, hy, hw, hh, col(t.body)]);
    P.push([hx + 1, hy, hw - 2, 2, col(t.light)]);
    if (t.snout === 'long') { P.push([hx + hw, hy + hh * 0.4, hw * 0.5, hh * 0.45, col(t.body)]); P.push([hx + hw + hw * 0.5 - 2, hy + hh * 0.4, 2, 2, col(t.nose)]); P.push([hx + hw, hy + hh * 0.75, hw * 0.4, 1.5, col(t.belly)]); }
    if (t.snout === 'pig') { P.push([hx + hw, hy + hh * 0.35, 4, hh * 0.5, col(t.nose)]); }
    if (t.snout === 'bear') { P.push([hx + hw, hy + hh * 0.45, hw * 0.3, hh * 0.4, col(t.light)]); P.push([hx + hw + hw * 0.3 - 2, hy + hh * 0.45, 2, 2, col(t.nose)]); }
    if (t.tusks) P.push([hx + hw + 1, hy + hh * 0.78, 2, 3, col('#f2ece2')]);
    P.push([hx + hw * 0.62, hy + hh * 0.28, 2, 2, flash ? '#ffffff' : '#120a04']);
    return P;
  }

  S.drawAnimal = (c, e, clock) => {
    const t = T[e.type];
    const flash = e.hitFlash > 0;
    const shake = e.shake > 0 ? Math.sin(clock * 80) * e.shake * 6 : 0;
    const lunge = e.atkAnim > 0 ? Math.sin((1 - e.atkAnim / 0.3) * Math.PI) * 5 : 0;
    const bob = e.moving && !e.dead ? Math.abs(Math.sin(e.walk)) * 1 : 0;
    S.shadow(c, e.x, e.y + 1, t.bw * Z * 0.6, t.bw * Z * 0.18);
    c.save();
    c.translate(e.x + shake, e.y - bob);
    c.scale(e.face * Z, Z);
    if (e.dead) { c.globalAlpha = Math.max(0, 1 - e.deadT / 1.8); c.rotate(-Math.min(1, e.deadT * 4) * Math.PI / 2); c.translate(0, -t.legH * 0.5); }
    c.translate(lunge, 0);
    const P = parts(t, e.moving ? e.walk : 0, flash);
    c.fillStyle = OUT;
    for (const [x, y, w, h] of P) c.fillRect(x - 1, y - 1, w + 2, h + 2);
    for (const [x, y, w, h, col] of P) { c.fillStyle = col; c.fillRect(x, y, w, h); }
    c.restore();
  };
})(window.ZP);
