document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    // ------------------------------------------------------------
    // 🔊 SOLUÇÃO 1 – PRÉ‑CARREGAMENTO DO SOM
    // ------------------------------------------------------------
    const clickSound = new Audio('/sounds/notification.mp3');
    clickSound.preload = 'auto';    // Força o navegador a baixar o arquivo inteiro
    clickSound.volume = 0.3;        // Ajuste o volume (0.0 a 1.0)
    clickSound.load();              // Inicia o download e a decodificação agora
    // ------------------------------------------------------------

    window.openModal = function(imageUrl, title) {
        // Toca o som (agora o arquivo já está em cache → latência mínima)
        clickSound.cloneNode().play().catch(err => {
            // Silencia erros (ex.: arquivo não encontrado)
        });

        if (modal && modalImg) {
            modalImg.src = imageUrl;
            modalImg.alt = title;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});