const handleWave = (container, player, color = '#fff', background = '#222') => {
    const audio = container.querySelector("audio");
    const canvas = container.querySelector("#wave-canvas");

    if (!audio || !canvas) {
        //eslint-disable-next-line no-console
        console.error("Audio or canvas element not found in the container.");
        return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        //eslint-disable-next-line no-console
        console.error("Web Audio API is not supported in this browser.");
        return;
    }

    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    src.connect(analyser);
    analyser.connect(context.destination);

    const ctx = canvas.getContext("2d");
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let fftSize = container?.offsetWidth > 800 ? 1024 : 512;
    analyser.fftSize = fftSize;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (WIDTH / bufferLength) * 1;
    window.ctx = ctx;
    const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = player.playing ? dataArray[i] : dataArray[i] + 100;
            ctx.fillStyle = color;
            ctx.fillRect(x, HEIGHT - barHeight - 80, barWidth, barHeight + 80);
            x += barWidth + 5;
        }
    };

    renderFrame();

    player.on('play', () => {
        context.resume();
    });

    player.on('pause', () => {
        context.suspend();
    });

};

export default handleWave