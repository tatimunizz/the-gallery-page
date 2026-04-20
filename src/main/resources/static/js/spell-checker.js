document.addEventListener('DOMContentLoaded', function() {
    const spellForm = document.getElementById('spellCheckForm');
    const wordInput = document.getElementById('wordInput');
    const resultDiv = document.getElementById('spellResult');

    if (!spellForm) return;

    spellForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = wordInput.value.trim();
        if (!word) return;

        // Mock (será substituído por fetch real futuramente)
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3 class="text-xl font-serif-body">${word}</h3>
            </div>
            <p class="text-sm text-green-500/80">✓ Spelled correctly (mock)</p>
            <p class="text-sm opacity-60">The word "${word}" is valid.</p>
        `;
    });
});