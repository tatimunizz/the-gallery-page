document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audioPlayer");
    const playBtn = document.getElementById("playPauseBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const muteBtn = document.getElementById("muteBtn");
    const volumeIcon = document.getElementById("volumeIcon");
    const muteIcon = document.getElementById("muteIcon");
    const volumeSlider = document.getElementById("volumeSlider");
    const clickSound = new Audio("/sounds/notification.mp3");

    if (!audio) return;

    if (volumeSlider) {
        audio.volume = volumeSlider.value;
    }
    
    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
        } else {
            audio.pause();
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
        }
    });

    muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            volumeIcon.classList.add("hidden");
            muteIcon.classList.remove("hidden");
        } else {
            volumeIcon.classList.remove("hidden");
            muteIcon.classList.add("hidden");
        }
    });

    clickSound.volume = 0.3;

    document.addEventListener(
        "click",
        (e) => {
            if (e.target.closest("a")) {
                clickSound
                    .cloneNode()
                    .play()
                    .catch(() => { });
            }
        },
        true,
    );

    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            audio.volume = e.target.value;
        });
    }
});
