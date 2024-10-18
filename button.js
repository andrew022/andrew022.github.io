document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector('.glitchyButton');
    const randomBrightness = () => {
        const brightness = Math.random() * 0.4 + 0.1; // does a ransome brightness level, below it applies the random level as the shadow
        button.style.boxShadow = `0 0 10px rgba(0, 255, 0, ${brightness}), 0 0 20px rgba(0, 255, 0, ${brightness})`;
    };
    const beginGlitch = () => {
        setInterval(() => {
            button.style.animation = `subtlePulse ${Math.random() * 1 + 1}s infinite`; // speed of the hue effect
            randomBrightness();
        }, Math.random() * 1000 + 500);
    };
    beginGlitch();
    button.addEventListener('click', () => {
        button.disabled = true;
        document.body.classList.add('swipe-left');
        setTimeout(() => window.location.href = './Nav Page/index.html', 500);
    });
});