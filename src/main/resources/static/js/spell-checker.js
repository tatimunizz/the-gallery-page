// static/js/spell-checker.js

document.addEventListener('DOMContentLoaded', function () {
    const spellForm = document.getElementById('spellCheckForm');
    const wordInput = document.getElementById('wordInput');
    const spellCheckBtn = document.getElementById('spellCheckBtn');
    const resultDiv = document.getElementById('spellResult');
    const loadingDiv = document.getElementById('spellLoading');

    if (!spellForm) return;

    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    const crossIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

    spellForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const word = wordInput.value.trim();
        if (!word) return;

        if (window.loaderStart) window.loaderStart();

        // if (loadingDiv) loadingDiv.classList.remove('hidden');
        // resultDiv.classList.add('hidden');
        // spellCheckBtn.disabled = true;

        try {
            const response = await fetch(`/api/spellcheck?word=${encodeURIComponent(word)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            renderResult(word, data);
        } catch (error) {
            console.error('Spell check error:', error);
            resultDiv.innerHTML = `<p class="text-sm text-red-400">Error checking word. Please try again.</p>`;
            resultDiv.classList.remove('hidden');
        } finally {
            // if (loadingDiv) loadingDiv.classList.add('hidden');
            // spellCheckBtn.disabled = false;
            if (window.loaderFinish) window.loaderFinish();
        }
    });

    function renderResult(word, data) {
        const { correct = false, suggestions = [], meanings = [] } = data;

        let html = `
            <div class="flex items-center gap-3 mb-4">
                ${correct ? checkIcon : crossIcon}
                <h3 class="text-xl font-serif-display">${word}</h3>
            </div>
        `;

        if (correct) {
            html += `<p class="text-sm text-green-500/80">✓ Spelled correctly</p>`;
            if (meanings && meanings.length > 0) {
                html += `<div class="space-y-3 mt-4">`;
                meanings.forEach(meaning => {
                    html += `
                        <div class="border-l-2 border-[#8B7355]/30 pl-4">
                            <p class="text-sm opacity-60 mb-2">${meaning.partOfSpeech || ''}</p>
                            <ul class="space-y-2">
                    `;
                    meaning.definitions?.forEach(def => {
                        html += `
                            <li class="text-sm">
                                <p>${def.definition || ''}</p>
                                ${def.example ? `<p class="text-xs opacity-50 italic mt-1">"${def.example}"</p>` : ''}
                            </li>
                        `;
                    });
                    html += `</ul></div>`;
                });
                html += `</div>`;
            }
        } else {
            html += `<p class="text-sm text-red-400/80">✗ Not found in dictionary</p>`;
            if (suggestions && suggestions.length > 0) {
                html += `
                    <div class="mt-4">
                        <p class="text-sm opacity-60 mb-2">Suggestions:</p>
                        <div class="flex flex-wrap gap-2">
                `;
                suggestions.forEach(suggestion => {
                    html += `
                        <button class="suggestion-btn px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors text-sm" data-word="${suggestion}">
                            ${suggestion}
                        </button>
                    `;
                });
                html += `</div></div>`;
            }
        }

        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');

        // Attach click handlers to suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newWord = btn.dataset.word;
                wordInput.value = newWord;
                spellForm.dispatchEvent(new Event('submit'));
            });
        });
    }
});