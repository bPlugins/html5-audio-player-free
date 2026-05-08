function fadeOut(element, duration = 500) {
    if (!element) return;

    let opacity = 1;
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        opacity = Math.max(1 - elapsed / duration, 0);
        element.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = "none";
        }
    }
    if (element.querySelector('audio')) {
        element.querySelector('audio').pause();
    }

    requestAnimationFrame(animate);
}

export default fadeOut;