document.addEventListener("DOMContentLoaded", () => {
    const rippleContainer = document.querySelector('.rippleContainer');
    const button = document.querySelector('.glitchyButton');
    // create a random color ripple
    const randomColorRipple = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
    // create and animate ripple
    const makeRipple = () => {
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        rippleContainer.appendChild(ripple);
        const size = Math.random() * 100 + 10; // changes the size
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * window.innerWidth - size / 2}px;
            top: ${Math.random() * window.innerHeight - size / 2}px;
            background-color: ${randomColorRipple()};
        `;
        ripple.addEventListener('animationend', () => ripple.remove());
    };
    setInterval(makeRipple, 3000); // makes happen every 3 sec
    // change button brightness and effect
    const randomBrightness = () => {
        const brightness = Math.random() * 0.4 + 0.1;
        button.style.boxShadow = `0 0 10px rgba(0, 255, 0, ${brightness}), 0 0 20px rgba(0, 255, 0, ${brightness})`;
    };
    const beginGlitchEffect = () => {
        setInterval(() => {
            button.style.animation = `subtlePulse ${Math.random() * 1 + 1}s infinite`;
            randomBrightness();
        }, Math.random() * 1000 + 500);
    };
    beginGlitchEffect();
    button.addEventListener('click', () => {
        button.disabled = true;
        document.body.classList.add('swipe-left');
        setTimeout(() => window.location.href = './Nav Page/index.html', 500); // delay to switch pages
    });
});