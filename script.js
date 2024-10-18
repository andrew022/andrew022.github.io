document.addEventListener("DOMContentLoaded", function () {
    const rippleContainer = document.querySelector('.rippleContainer');

    function getRandomColorRipple() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function makeRipple() {
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        rippleContainer.appendChild(ripple);
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 100 + 50;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        ripple.style.backgroundColor = getRandomColorRipple();

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }
    setInterval(makeRipple, 3000);

    const button = document.querySelector('.glitchyButton');

    function randomBrightness() {
        const brightness = Math.random() * 0.4 + 0.1;
        button.style.boxShadow = `0 0 10px rgba(0, 255, 0, ${brightness}), 0 0 20px rgba(0, 255, 0, ${brightness})`;
    }

    function beginGlitchEffect() {
        setInterval(() => {
            button.style.animation = `subtlePulse ${Math.random() * 1 + 1}s infinite`;
            randomBrightness();
        }, Math.random() * 1000 + 500);
    }

    beginGlitchEffect();

    button.addEventListener('click', function () {
        button.disabled = true;
        document.body.classList.add('swipe-left');
        setTimeout(() => {
            window.location.href = './Nav Page/index.html';
        }, 500);
    });
});
