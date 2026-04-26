// app.js – Global loading coordinator and refresh dispatcher
(function () {
  'use strict';

  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;

  let pending = 0;

  function showOverlay() {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.style.display = 'none', 600);
  }

  // Called by loaders during initial page load ONLY
  window.loaderStart = function () {
    pending++;
    if (overlay.style.display === 'none') showOverlay();
  };

  window.loaderFinish = function () {
    pending--;
    if (pending <= 0) hideOverlay();
  };

  // Called by the Refresh button – triggers individual refresh functions
  window.refreshAllContent = async function () {
    const tasks = [];
    if (window.refreshComment) tasks.push(window.refreshComment());
    if (window.refreshQuote) tasks.push(window.refreshQuote());
    if (window.refreshNews) tasks.push(window.refreshNews());
    if (window.refreshImages) tasks.push(window.refreshImages());
    await Promise.allSettled(tasks);
  };
  // Fallback timeout
  setTimeout(() => { if (pending > 0) hideOverlay(); }, 10000);
})();