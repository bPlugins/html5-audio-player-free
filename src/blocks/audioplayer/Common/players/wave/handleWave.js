const handleWave = (container, player, color = '#fff', background = '#222') => {
    const audio = container.querySelector("audio");
    const canvas = container.querySelector("#wave-canvas");

    if (!audio || !canvas) {
        //eslint-disable-next-line no-console
        console.error("Audio or canvas element not found in the container.");
        return;
    }

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    const WIDTH = canvas.getBoundingClientRect().width || 500;
    const HEIGHT = canvas.getBoundingClientRect().height || 60;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        //eslint-disable-next-line no-console
        console.error("Web Audio API is not supported in this browser.");
        return;
    }

    let context;
    let analyser;
    let source;

    try {
        context = new AudioContext();
        analyser = context.createAnalyser();
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
    } catch (e) {
        //eslint-disable-next-line no-console
        console.warn("AudioContext setup failed (might be already created or blocked):", e);
    }

    let fftSize = container?.offsetWidth > 800 ? 1024 : 512;
    if (analyser) analyser.fftSize = fftSize;

    const bufferLength = analyser ? analyser.frequencyBinCount : 256;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (WIDTH / bufferLength) * 1.5;

    const renderFrame = () => {
        animationFrameId = requestAnimationFrame(renderFrame);

        if (analyser) {
            analyser.getByteFrequencyData(dataArray);
        }

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const rawBarHeight = player.playing ? dataArray[i] : (dataArray[i] > 0 ? dataArray[i] : 10);
            const baseline = HEIGHT * 0.1; // 10% baseline height
            const jumpingHeight = (rawBarHeight * (HEIGHT / 256)) * 0.35; // max 35% jumping
            const barHeight = baseline + jumpingHeight;

            ctx.fillStyle = color;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth + 2;
        }
    };

    renderFrame();

    const playHandler = () => {
        if (context && context.state === 'suspended') {
            context.resume();
        }
    };
    player.on('play', playHandler);

    return () => {
        cancelAnimationFrame(animationFrameId);
        player.off('play', playHandler);
        if (context) {
            context.close().catch(() => {});
        }
    };
};

export default handleWave;