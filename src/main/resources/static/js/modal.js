document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    const clickSound = new Audio('/sounds/notification.mp3');
    clickSound.preload = 'auto';
    clickSound.volume = 0.3;
    clickSound.load();

    window.openModal = function(imageUrl, title) {
        clickSound.cloneNode().play().catch(err => {});

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