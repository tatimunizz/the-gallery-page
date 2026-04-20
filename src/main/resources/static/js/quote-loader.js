document.addEventListener('DOMContentLoaded', function() {
    const quoteElement = document.getElementById('quoteContent');
    const authorElement = document.getElementById('quoteAuthor');

    if (!quoteElement || !authorElement) return;

    async function loadQuote() {
        try {
            const response = await fetch('/api/quote');
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            quoteElement.textContent = `"${data.quote}"`;
            authorElement.textContent = `— ${data.author}`;
        } catch (error) {
            console.error('Quote fetch error:', error);
            quoteElement.textContent = '"The art inspires the soul."';
            authorElement.textContent = '— Unknown';
        }
    }

    loadQuote();
});