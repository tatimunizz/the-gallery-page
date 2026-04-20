document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('newsContainer');
    if (!container) return;

    async function loadNews() {
        try {
            const response = await fetch('/api/news');
            if (!response.ok) throw new Error('API error');
            const articles = await response.json();

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
            container.innerHTML = `
                <article class="bg-white/50 backdrop-blur-sm border border-[#8B7355]/20 p-6">
                    <h3 class="text-2xl mb-3 font-serif-body">New Exhibition Opens at MoMA</h3>
                    <p class="text-sm opacity-70 mb-4">A groundbreaking exhibition featuring contemporary artists.</p>
                    <a href="#" class="inline-block text-sm text-[#8B7355] hover:underline">Read more →</a>
                </article>
            `;
        }
    }

    loadNews();
});