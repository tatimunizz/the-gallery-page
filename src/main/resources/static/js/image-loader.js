document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    async function loadImages() {
        try {
            const response = await fetch('/api/images');
            if (!response.ok) throw new Error('API error');
            const images = await response.json();

            if (images.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center opacity-60">No images available.</p>';
                return;
            }

            container.innerHTML = images.map(img => {
                const fullLink = img.link.startsWith('http') ? img.link : `https://unsplash.com${img.link}`;
                const escapedTitle = img.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                return `
                    <div class="relative overflow-hidden group cursor-pointer" onclick="openModal('${img.imageUrl}', '${escapedTitle}')">
                        <!-- Imagem com efeito de scale -->
                        <div class="image-card aspect-[4/5] relative">
                            <img src="${img.imageUrl}" alt="${img.title}" class="w-full h-full object-cover" loading="lazy">
                            <!-- Gradiente e textos sobrepostos -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <p class="text-sm font-medium">Unsplash Blog</p>
                                    <a href="${fullLink}" target="_blank" rel="noopener noreferrer" 
                                       class="text-xs opacity-80 mt-1 line-clamp-2 hover:underline"
                                       onclick="event.stopPropagation()">
                                        ${img.title}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Failed to load images:', error);
            container.innerHTML = `
                <div class="relative overflow-hidden group cursor-pointer" onclick="openModal('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', 'Artistic Vision')">
                    <div class="image-card aspect-[4/5] relative">
                        <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800" alt="Fallback image" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <p class="text-sm font-medium">Unsplash Blog</p>
                                <a href="#" target="_blank" rel="noopener noreferrer" class="text-xs opacity-80 mt-1 hover:underline" onclick="event.stopPropagation()">Artistic Vision</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadImages();
});