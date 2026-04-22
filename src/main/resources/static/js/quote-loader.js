document.addEventListener('DOMContentLoaded', function() {
  const quoteElement = document.getElementById('quoteContent');
  const authorElement = document.getElementById('quoteAuthor');
  if (!quoteElement || !authorElement) return;

  const container = quoteElement.parentElement;
  let originalHTML = container.innerHTML;

  function showLocalSpinner() {
    container.innerHTML = `
      <div class="loading-spinner">
            <div class="loading-glow"></div>
            <i class="loading-sparkle ri-sparkling-line"></i>
        </div>
    `;
  }

  async function loadQuote(isInitial = true) {
    if (isInitial) window.loaderStart?.();

    showLocalSpinner();

    try {
      const response = await fetch('/api/quote');
      if (!response.ok) throw new Error('API error');
      const data = await response.json();

      // Restore original structure
      container.innerHTML = originalHTML;

      // Now elements exist again – update them
      document.getElementById('quoteContent').textContent = `"${data.quote}"`;
      document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
    } catch (error) {
      console.error('Failed to load quote:', error);
      container.innerHTML = originalHTML;
      document.getElementById('quoteContent').textContent = '"Art washes away from the soul the dust of everyday life."';
      document.getElementById('quoteAuthor').textContent = '— Pablo Picasso';
    } finally {
      if (isInitial) window.loaderFinish?.();
    }
  }

  window.loadQuote = () => loadQuote(true);

  window.refreshQuote = async () => {
    showLocalSpinner();
    try {
      const response = await fetch('/api/quote');
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      container.innerHTML = originalHTML;
      document.getElementById('quoteContent').textContent = `"${data.quote}"`;
      document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
    } catch (error) {
      console.error('Failed to refresh quote:', error);
      container.innerHTML = originalHTML;
      document.getElementById('quoteContent').textContent = '"Art washes away from the soul the dust of everyday life."';
      document.getElementById('quoteAuthor').textContent = '— Pablo Picasso';
    }
  };

  loadQuote(true);
});