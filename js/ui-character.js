// Окно «Персонаж»: характеристики с описаниями, боевые показатели, владение каждым оружием и его бонусы.
(function (ZP) {
  const U = ZP.util, M = ZP.mastery;
  const $ = (id) => document.getElementById(id);
  const C = (ZP.uiChar = { last: 0 });
  const row = (name, value, desc) => `<div class="srow"><b>${name}</b><span class="v">${value}</span>${desc ? `<small>${desc}</small>` : ''}</div>`;

  C.render = (force) => {
    const now = performance.now();
    if (!force && now - C.last < 800 && !$('win-char').hidden && C.last) return;
    C.last = now;
    const H = ZP.hero, p = ZP.PLAYER_BASE, k = H.weapon, w = ZP.WEAPONS[k], s = ZP.save.data;
    ZP.sprites.drawPortrait($('char-portrait').getContext('2d'), 32, H, ZP.time.clock);
    $('char-sub').textContent = `Оружие в руках: ${w.acc4}. Сейчас: ${H.dead ? 'погибла, ждёт воскрешения' : ZP.world.cur.name}.`;

    $('char-stats').innerHTML = ZP.STAT_ORDER.map((st) => row(ZP.STAT_NAMES[st], st === 'hp' ? `${Math.max(0, Math.ceil(H.hp))} / ${p.hp}` : p[st], ZP.STAT_DESC[st])).join('');

    const raw = ZP.stats.playerRaw(k);
    $('char-combat-title').textContent = 'В бою: ' + w.name.toLowerCase();
    $('char-combat').innerHTML =
      row('Урон за удар', `${Math.round(raw * 0.85)}–${Math.round(raw * 1.15)}`, `Атака ${p.atk} + оружие ${w.base} + ${ZP.STAT_NAMES[w.attr].toLowerCase()} ×${U.n1(w.attrK)}. Защита цели снижает урон.`) +
      row('Точность', U.accTxt(M.baseAcc(k)), 'Шанс попасть. Растёт с владением оружием и навыками точности. Цель ещё может увернуться.') +
      row('Атак в секунду', U.n1(M.attacksPerSec(k)), 'Зависит от оружия, владения, ловкости и навыков скорости.') +
      (w.type === 'melee' ? '' : row('Дальность', `${w.range[0]}–${w.range[1]}`, 'Дистанция стрельбы в пикселях мира.')) +
      row('Шанс уворота', U.accTxt(ZP.stats.dodgeChance(p)), 'Шанс избежать удара зверя (от уворота и ловкости).') +
      row('Снижение урона', Math.round((1 - ZP.stats.reduction(p)) * 100) + '%', 'Сколько урона поглощает защита.') +
      row('Скорость бега', Math.round(ZP.heroAI.speed()) + ' px/с', '');

    $('char-mastery').innerHTML = ZP.ORDER.map((wk) => {
      const sk = s.skills[wk], ww = ZP.WEAPONS[wk], on = wk === k, list = M.bonusList(wk), fp = M.freePts(wk);
      return `<div class="mcard${on ? ' on' : ''}">
        <div class="mcard-head">${ZP.ICONS[wk]}<b>${ww.name}</b>${on ? '<span class="tag">в руках</span>' : ''}<span class="pctv">${U.pctTxt(sk.m)}</span></div>
        <div class="pbar gold"><i style="width:${(sk.m / ZP.MAX) * 100}%"></i></div>
        <div class="mline"><span>Точность</span><span>${U.accTxt(M.baseAcc(wk))}</span></div>
        <div class="mline"><span>Урон / атак в сек.</span><span>${Math.round(ZP.stats.playerRaw(wk))} / ${U.n1(M.attacksPerSec(wk))}</span></div>
        <div class="mline"><span>Навыки</span><span>${sk.learned.length}/${ZP.SKILL_NODE_COUNT}${fp > 0 ? ` · свободно ${fp}` : ''}</span></div>
        <div class="mline"><span>Попаданий</span><span>${sk.hits} из ${sk.shots}</span></div>
        <ul class="bonus-list">${list.length ? list.map((b) => `<li>${b.key ? `<b>${b.label}</b>: ${b.desc}` : `${b.label} ${b.value}`}</li>`).join('') : '<li class="none">Бонусов от навыков пока нет</li>'}</ul>
      </div>`;
    }).join('');

    const byType = Object.keys(ZP.ANIMALS).map((t) => `${ZP.ANIMALS[t].name}: ${s.killsByType[t] || 0}`).join(' · ');
    $('char-record').innerHTML = row('Побеждено зверей', s.kills, byType) + row('Самый сильный побеждённый', s.bestLevel ? 'ур. ' + s.bestLevel : '—', '') + row('Гибелей', s.deaths, '');
  };
})(window.ZP);
