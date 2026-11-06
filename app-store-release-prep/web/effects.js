/* Decorative website effects. No device APIs are used. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero-art');
  const phone = hero.querySelector('.phone');
  let heroVisible = true;
  let tiltFrame = 0;
  let x = 0, y = 0, vx = 0, vy = 0, targetX = 0, targetY = 0, lastTilt = 0;
  const resetTilt = () => {
    cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    x = y = vx = vy = targetX = targetY = 0;
    phone.style.removeProperty('--tilt-x');
    phone.style.removeProperty('--tilt-y');
  };
  const tilt = (time) => {
    const dt = Math.min((time - lastTilt) / 1000, .032);
    lastTilt = time;
    vx += ((targetX - x) * 170 - vx * 23) * dt;
    vy += ((targetY - y) * 170 - vy * 23) * dt;
    x += vx * dt; y += vy * dt;
    phone.style.setProperty('--tilt-x', `${x.toFixed(3)}deg`);
    phone.style.setProperty('--tilt-y', `${y.toFixed(3)}deg`);
    if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(vx) + Math.abs(vy) > .01) {
      tiltFrame = requestAnimationFrame(tilt);
    } else { tiltFrame = 0; }
  };
  const aim = (nextX, nextY) => {
    targetX = nextX; targetY = nextY;
    if (!tiltFrame) { lastTilt = performance.now(); tiltFrame = requestAnimationFrame(tilt); }
  };
  hero.addEventListener('pointermove', (event) => {
    if (reduced.matches || !finePointer.matches || !heroVisible || document.hidden) return;
    const rect = hero.getBoundingClientRect();
    aim((.5 - (event.clientY - rect.top) / rect.height) * 7, ((event.clientX - rect.left) / rect.width - .5) * 9);
  });
  hero.addEventListener('pointerleave', () => { if (!reduced.matches && heroVisible) aim(0, 0); });

  // Reveal with Web Animations: content is readable even if scripts fail or are disabled.
  const revealAnimations = new Set();
  const revealTargets = document.querySelectorAll('.statement, .showcase-copy, .principle, .compatibility, .final-cta');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        if (reduced.matches) return;
        const animation = entry.target.animate([{ opacity: .35, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
        revealAnimations.add(animation);
        animation.finished.then(() => revealAnimations.delete(animation)).catch(() => revealAnimations.delete(animation));
      });
    }, { threshold: .12 });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const syncHero = () => {
    hero.classList.toggle('is-paused', !heroVisible || document.hidden);
    if (!heroVisible || document.hidden || reduced.matches) resetTilt();
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncHero(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => {
    syncHero();
    revealAnimations.forEach((animation) => document.hidden ? animation.pause() : animation.play());
  });
  reduced.addEventListener('change', () => {
    syncHero();
    if (reduced.matches) {
      revealAnimations.forEach((animation) => animation.finish());
    }
  });
})();
