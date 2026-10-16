// Register before pagereveal, which can fire before React hydrates the page.
export const transitionScript = String.raw`(() => {
  const main = /^\/my-portfolio\/(?:zh\/)?(?:(?:research|projects|notes|personal)(?:\/[^/?#]+)?\/)?$/;
  function choose(event) {
    const activation = event.activation || window.navigation?.activation;
    const from = activation?.from?.url;
    const to = activation?.entry?.url;
    if (!from || !to || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      event.viewTransition?.skipTransition(); return;
    }
    const a = new URL(from), b = new URL(to);
    if (a.origin !== b.origin || !main.test(a.pathname) || !main.test(b.pathname) || a.pathname === b.pathname) {
      event.viewTransition?.skipTransition(); return;
    }
    document.documentElement.dataset.turn = a.pathname.replace('/zh/', '/') === b.pathname.replace('/zh/', '/') ? 'language' : 'page';
  }
  window.addEventListener('pageswap', choose);
  window.addEventListener('pagereveal', choose);
})();`;
