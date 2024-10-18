document.addEventListener("DOMContentLoaded", () => {
const rippleContainer = document.querySelector('.rippleContainer');
    const button = document.querySelector('.glitchyButton');
    const randomColorRipple = () => '#' + Math.floor(Math.random() * 16777215).toString(16); // makes random colors
    const makeRipple = () => { // fancy stuff to make the ripples 
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        rippleContainer.appendChild(ripple);
        const size = Math.random() * 50 + 10; // changes the size
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * window.innerWidth - size / 2}px;
            top: ${Math.random() * window.innerHeight - size / 2}px;
            background-color: ${randomColorRipple()};
        `;
        ripple.addEventListener('animationend', () => ripple.remove());
    };
    setInterval(makeRipple, 3000); // makes one every 3 sec
});
