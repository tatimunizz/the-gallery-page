document.addEventListener('DOMContentLoaded', function() {
    const commentElement = document.getElementById('contextualCommentText');
    if (!commentElement) return;

    const container = commentElement.parentElement;
    let originalHTML = container.innerHTML;

    function showLocalSpinner() {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="loading-glow"></div>
                <i class="loading-sparkle ri-sparkling-line"></i>
            </div>
        `;
    }

    async function loadComment(isInitial = true) {
        if (isInitial) window.loaderStart?.();
        showLocalSpinner();
        try {
            const response = await fetch('/api/comment');
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            container.innerHTML = originalHTML;
            document.getElementById('contextualCommentText').textContent = data.comment;
        } catch (error) {
            console.error('Failed to load AI comment:', error);
            container.innerHTML = originalHTML;
        } finally {
            if (isInitial) window.loaderFinish?.();
        }
    }

    window.loadComment = () => loadComment(true);

    window.refreshComment = async () => {
        showLocalSpinner();
        try {
            const response = await fetch('/api/comment');
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            container.innerHTML = originalHTML;
            document.getElementById('contextualCommentText').textContent = data.comment;
        } catch (error) {
            console.error('Failed to refresh comment:', error);
            container.innerHTML = originalHTML;
        }
    };

    loadComment(true);
});