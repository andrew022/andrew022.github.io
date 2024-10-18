document.addEventListener("DOMContentLoaded", function () {
    const rippleContainer = document.querySelector('.ripple-container');

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function createRipple() {
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        rippleContainer.appendChild(ripple);

        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 100 + 50; // Random size

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`; // Center the ripple
        ripple.style.top = `${y - size / 2}px`; // Center the ripple

        // Set a random color for the ripple
        ripple.style.backgroundColor = getRandomColor();

        ripple.addEventListener('animationend', () => {
            ripple.remove(); // Remove ripple after animation ends
        });
    }

    // Start creating ripples at a slower interval
    setInterval(createRipple, 3000); // Ripple appears every 3 seconds

    const button = document.querySelector('.glitch-button');

    function randomBrightness() {
        const brightness = Math.random() * 0.4 + 0.1;
        button.style.boxShadow = `0 0 10px rgba(0, 255, 0, ${brightness}), 0 0 20px rgba(0, 255, 0, ${brightness})`;
    }

    function startGlitchEffect() {
        setInterval(() => {
            button.style.animation = `subtlePulse ${Math.random() * 1 + 1}s infinite`;
            randomBrightness();
        }, Math.random() * 1000 + 500);
    }

    startGlitchEffect();

    button.addEventListener('click', function () {
        button.disabled = true; // Disable button
        document.body.classList.add('swipe-left');
        setTimeout(() => {
            window.location.href = './Nav Page/index.html';
        }, 500); // Delay for transition effect
    });
});
