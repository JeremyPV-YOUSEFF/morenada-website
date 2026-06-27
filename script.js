  const TOTAL = 7;
  let current = 0, bloqueado = false;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsEl = document.getElementById('dots');

  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.addEventListener('click', () => irA(i));
    dotsEl.appendChild(d);
  }
  const dots = Array.from(dotsEl.querySelectorAll('.dot'));

  function irA(idx) {
    if (idx === current || bloqueado || idx < 0 || idx >= TOTAL) return;
    bloqueado = true;
    const prev = current, next = idx, dir = next > prev ? 1 : -1;

    slides[prev].style.transition = 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)';
    slides[prev].style.opacity = '0';
    slides[prev].style.transform = dir > 0 ? 'translateY(-55px)' : 'translateY(55px)';
    slides[prev].style.pointerEvents = 'none';

    current = next;
    slides[current].style.transition = 'none';
    slides[current].style.transform = dir > 0 ? 'translateY(55px)' : 'translateY(-55px)';
    slides[current].style.opacity = '0';
    slides[current].style.pointerEvents = 'none';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      slides[current].style.transition = 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)';
      slides[current].style.opacity = '1';
      slides[current].style.transform = 'translateY(0)';
      slides[current].style.pointerEvents = 'all';
      actualizarUI();
    }));

    setTimeout(() => {
      slides[prev].style.transform = 'translateY(55px)';
      bloqueado = false;
    }, 680);
  }

  function actualizarUI() {
    dots.forEach((d, i) => d.classList.toggle('activo', i === current));
    document.querySelectorAll('[data-slide]').forEach(el => {
      el.classList && el.classList.toggle('activo', parseInt(el.dataset.slide) === current);
    });
  }

  /* init primer slide */
  slides[0].style.opacity = '1';
  slides[0].style.transform = 'translateY(0)';
  slides[0].style.pointerEvents = 'all';
  actualizarUI();

  /* wheel */
  let wt = null;
  window.addEventListener('wheel', e => {
    if (bloqueado) return;
    clearTimeout(wt);
    wt = setTimeout(() => {
      if (e.deltaY > 25 && current < TOTAL-1) irA(current+1);
      else if (e.deltaY < -25 && current > 0) irA(current-1);
    }, 40);
  }, {passive:true});

  /* teclado */
  window.addEventListener('keydown', e => {
    if (bloqueado) return;
    if (e.key==='ArrowDown'||e.key==='PageDown') irA(current+1);
    if (e.key==='ArrowUp'||e.key==='PageUp') irA(current-1);
  });

  /* touch */
  let ty = null;
  window.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, {passive:true});
  window.addEventListener('touchend', e => {
    if (ty===null||bloqueado) return;
    const d = ty - e.changedTouches[0].clientY;
    if (d>40) irA(current+1);
    else if (d<-40) irA(current-1);
    ty = null;
  });

  /* clics con data-slide */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-slide]');
    if (!el) return;
    e.preventDefault();
    irA(parseInt(el.dataset.slide));
  });

  /* countdown */
  function tick() {
    const diff = new Date('2026-07-25T08:00:00') - new Date();
    const safe = v => String(Math.max(0,v)).padStart(2,'0');
    document.getElementById('cd-dias').textContent  = safe(Math.floor(diff/86400000));
    document.getElementById('cd-horas').textContent = safe(Math.floor((diff%86400000)/3600000));
    document.getElementById('cd-min').textContent   = safe(Math.floor((diff%3600000)/60000));
    document.getElementById('cd-seg').textContent   = safe(Math.floor((diff%60000)/1000));
  }
  tick(); setInterval(tick,1000);

  /* form */
  function enviarForm() {
    const n=document.getElementById('f-nombre').value.trim();
    const e=document.getElementById('f-email').value.trim();
    const m=document.getElementById('f-msg').value.trim();
    if(!n||!e||!m){alert('Por favor completa todos los campos.');return;}
    document.getElementById('msg-ok').style.display='block';
    document.getElementById('f-nombre').value='';
    document.getElementById('f-email').value='';
    document.getElementById('f-msg').value='';
  }