document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('newsContainer');
  if (!container) return;

  let originalHTML = '';
  let originalDisplay = '';

  async function loadNews(isInitial = true) {
    if (isInitial) window.loaderStart?.();

    originalHTML = container.innerHTML;
    showLocalSpinner();

    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('API error');
      const articles = await response.json();

      container.style.display = originalDisplay;
      container.classList.add('grid');

      if (articles.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center opacity-60">No news available.</p>';
        return;
      }

      container.innerHTML = articles.map(article => `
        <article class="bg-white/50 backdrop-blur-sm border border-[#8B7355]/20 p-6 hover:border-[#8B7355]/40 transition-all group">
          <h3 class="text-2xl mb-3 group-hover:text-[#8B7355] transition-colors font-serif-body">${article.title}</h3>
          <p class="text-sm opacity-70 mb-4 line-clamp-3">${article.description}</p>
          <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="inline-block text-sm text-[#8B7355] hover:underline">Read more →</a>
        </article>
      `).join('');
    } catch (error) {
      console.error('Failed to load news:', error);
      container.style.display = originalDisplay;
      container.innerHTML = `
        <article class="bg-white/50 backdrop-blur-sm border border-[#8B7355]/20 p-6">
          <h3 class="text-2xl mb-3 font-serif-body">New Exhibition Opens at MoMA</h3>
          <p class="text-sm opacity-70 mb-4">A groundbreaking exhibition featuring contemporary artists.</p>
          <a href="#" class="inline-block text-sm text-[#8B7355] hover:underline">Read more →</a>
        </article>
      `;
    } finally {
      if (isInitial) window.loaderFinish?.();
    }
  }

  function showLocalSpinner() {
    originalDisplay = window.getComputedStyle(container).display;
    container.style.display = 'flex';
    container.classList.remove('grid');
    container.innerHTML = `
      <div class="loading-spinner">
        <div class="loading-glow"></div>
        <i class="loading-sparkle ri-sparkling-line"></i>
      </div>
    `;
  }

  window.loadNews = () => loadNews(true);
  window.refreshNews = async () => {
    showLocalSpinner();
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('API error');
      const articles = await response.json();
      container.style.display = originalDisplay;
      container.innerHTML = articles.map(article => `
        <article class="bg-white/50 backdrop-blur-sm border border-[#8B7355]/20 p-6 hover:border-[#8B7355]/40 transition-all group">
          <h3 class="text-2xl mb-3 group-hover:text-[#8B7355] transition-colors font-serif-body">${article.title}</h3>
          <p class="text-sm opacity-70 mb-4 line-clamp-3">${article.description}</p>
          <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="inline-block text-sm text-[#8B7355] hover:underline">Read more →</a>
        </article>
      `).join('');
    } catch (error) {
      console.error('Failed to refresh news:', error);
      container.style.display = originalDisplay;
      container.innerHTML = originalHTML;
    }
  };

  loadNews(true);
});