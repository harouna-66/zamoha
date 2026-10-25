// ZAMOHO – script commun
document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  const burger = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('active');
      burger.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('active')));
  }

  // Compteurs animés
  const nums = document.querySelectorAll('.stat-number[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fmt = n => n.toLocaleString('fr-FR');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, fin = parseInt(el.dataset.count, 10), suf = el.dataset.suffix || '';
        io.unobserve(el);
        if (reduit) { el.textContent = fmt(fin) + suf; return; }
        let t0 = null;
        const pas = t => {
          if (!t0) t0 = t;
          const p = Math.min((t - t0) / 1500, 1);
          el.textContent = fmt(Math.floor(p * fin)) + (p === 1 ? suf : '');
          if (p < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  // Formulaires : ouvre le client mail avec le message pré-rempli
  document.querySelectorAll('form[data-mail]').forEach(form => {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const champs = [...form.querySelectorAll('input, textarea')];
      const corps = champs.map(c => (c.placeholder || c.name) + ' : ' + c.value).join('\n');
      const sujet = form.dataset.subject || 'Message depuis le site ZAMOHO';
      window.location.href = 'mailto:' + form.dataset.mail + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
    });
  });
});
