// Игровой интерфейс: портрет и полосы, рамка цели, панель оружия, журнал, баннер, окна.
(function (ZP) {
  const U = ZP.util;
  const $ = (id) => document.getElementById(id);
  const UI = (ZP.ui = { _dirty: true });

  UI.dirty = () => { UI._dirty = true; };
  UI.log = (text, cls) => {
    const el = $('log'), li = document.createElement('li');
    if (cls) li.className = cls;
    const c = ZP.time.clock, m = Math.floor(c / 60), s = Math.floor(c % 60);
    li.innerHTML = `<time>[${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}]</time><span></span>`;
    li.querySelector('span').textContent = text;
    el.prepend(li);
    while (el.children.length > 60) el.lastChild.remove();
  };
  UI.mapChanged = () => {
    const map = ZP.world.cur, mm = $('minimap');
    mm.width = 64; mm.height = Math.round(64 * map.H / map.W);
    $('map-label').textContent = map.name;
  };
  UI.skillsChanged = () => { UI.dirty(); if (ZP.uiSkills && !$('win-skills').hidden) ZP.uiSkills.render(); };

  // окна
  const wins = ['win-skills', 'win-char', 'win-menu'];
  UI.open = (id) => {
    for (const w of wins) if (w !== id) $(w).hidden = true;
    if (id === 'win-skills') ZP.uiSkills.open();
    if (id === 'win-char') ZP.uiChar.render();
    if (id === 'win-menu') ZP.uiMenu.render();
    $(id).hidden = false;
    const c = $(id).querySelector('.close'); if (c) c.focus({ preventScroll: true });
  };
  UI.close = (id) => { $(id).hidden = true; };
  UI.toggle = (id) => ($(id).hidden ? UI.open(id) : UI.close(id));
  UI.anyOpen = () => wins.some((w) => !$(w).hidden);

  UI.init = () => {
    for (const w of wins) {
      const el = $(w);
      el.querySelector('.close').innerHTML = ZP.ICONS.close;
      el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('.close')) UI.close(w); });
    }
    // панель оружия + навыки + персонаж
    const ab = $('actionbar');
    ab.innerHTML = ZP.ORDER.map((k, i) => `<button class="slot" type="button" id="s-${k}" data-k="${k}" aria-pressed="false" aria-label="${ZP.WEAPONS[k].name}">${ZP.ICONS[k]}<i class="cd"></i><span class="key ol">${i + 1}</span><span class="pct ol"></span><span class="badge" hidden></span></button>`).join('') +
      `<span class="sep"></span><button class="slot util" type="button" id="s-skills" aria-label="Паутина навыков">${ZP.ICONS.web}<span class="pct ol">Навыки</span><span class="badge" hidden></span></button>` +
      `<button class="slot util" type="button" id="s-char" aria-label="Персонаж">${ZP.ICONS.person}<span class="pct ol">Герой</span></button>`;
    ab.addEventListener('click', (e) => {
      const b = e.target.closest('.slot'); if (!b) return;
      if (b.id === 's-skills') UI.open('win-skills');
      else if (b.id === 's-char') UI.open('win-char');
      else { ZP.heroAI.selectWeapon(b.dataset.k); UI.dirty(); }
    });
    $('unit').addEventListener('click', () => UI.open('win-char'));
    $('unit').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); UI.open('win-char'); } });
    $('log').addEventListener('click', () => $('log').classList.toggle('open'));
    UI.mapChanged();
  };

  function statusText() {
    const H = ZP.hero;
    if (H.dead) return 'погибла';
    if (ZP.world.pending) return 'переход';
    if (H.state === 'swap') return 'берёт ' + ZP.WEAPONS[H.weapon].acc4;
    if (H.map === 'village') return 'идёт на охоту';
    if (H.target) return H.animDur || ZP.util.dist(H, H.target) < 320 ? 'в бою' : 'идёт к цели';
    return 'ищет цель';
  }

  UI.render = () => {
    const H = ZP.hero, k = H.weapon, sk = ZP.save.data.skills[k];
    $('unit-name').innerHTML = `${ZP.HERO_NAME} <small>· ${ZP.WEAPONS[k].name} · ${statusText()}</small>`;
    $('bar-hp').style.width = (H.hp / H.max) * 100 + '%';
    $('txt-hp').textContent = `Здоровье ${Math.max(0, Math.ceil(H.hp))}/${H.max}`;
    $('bar-m').style.width = (sk.m / ZP.MAX) * 100 + '%';
    $('txt-m').textContent = `${ZP.WEAPONS[k].name}: владение ${U.pctTxt(sk.m)}`;
    // цель
    const t = H.target, tf = $('target');
    if (t && !t.dead && !H.dead) {
      tf.hidden = false;
      $('target-name').textContent = t.name; $('target-name').style.color = ZP.levelColor(t.L);
      $('target-lvl').textContent = 'ур. ' + t.L; $('target-lvl').style.color = ZP.levelColor(t.L);
      $('bar-thp').style.width = (t.hp / t.st.hp) * 100 + '%';
      $('txt-thp').textContent = `${Math.max(0, Math.ceil(t.hp))}/${t.st.hp}`;
    } else tf.hidden = true;
    // слоты
    for (const w of ZP.ORDER) {
      const el = $('s-' + w), fp = ZP.mastery.freePts(w);
      el.setAttribute('aria-pressed', w === k);
      el.querySelector('.pct').textContent = U.pctTxt(ZP.save.data.skills[w].m);
      const b = el.querySelector('.badge'); b.hidden = fp <= 0; b.textContent = fp;
    }
    const tot = ZP.mastery.totalFree(), sb = $('s-skills').querySelector('.badge'); sb.hidden = tot <= 0; sb.textContent = tot;
    // баннер
    const bn = $('banner');
    if (H.dead) { bn.hidden = false; bn.className = 'banner ol dead'; $('banner-title').textContent = `${ZP.HERO_NAME} погибла`; $('banner-sub').textContent = `Воскрешение в деревне через ${Math.max(1, Math.ceil(ZP.RESPAWN_TIME - H.deathT))}…`; }
    else if (ZP.paused) { bn.hidden = false; bn.className = 'banner ol'; $('banner-title').textContent = 'Пауза'; $('banner-sub').textContent = ''; }
    else bn.hidden = true;
    if (!$('win-char').hidden) ZP.uiChar.render();
    if (!$('win-menu').hidden) ZP.uiMenu.render();
  };

  UI.renderFast = () => {
    const H = ZP.hero, el = document.querySelector(`#s-${H.weapon} .cd`);
    if (el) el.style.setProperty('--cd', U.clamp(H.cd / (H.cdTotal || 1), 0, 1).toFixed(3));
  };
})(window.ZP);
