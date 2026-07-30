const handleWave = (container, player, color = '#fff', background = 'transparent', type = 'equalizer', sourceUrl = '') => {
    const audio = container.querySelector("audio");
    const canvas = container.querySelector("#wave-canvas");

    if (!audio || !canvas) {
        //eslint-disable-next-line no-console
        console.error("Audio or canvas element not found in the container.");
        return;
    }

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let timeUpdateListener;
    let clickListener;
    let mouseMoveListener;
    let mouseLeaveListener;

    const dpr = window.devicePixelRatio || 1;
    const WIDTH = canvas.getBoundingClientRect().width || 500;
    const HEIGHT = canvas.getBoundingClientRect().height || 60;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // Helper to generate deterministic wave peaks based on sourceUrl
    const generatePeaks = (count, url) => {
        let hash = 0;
        const str = url || "default_wave";
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const peaks = [];
        for (let i = 0; i < count; i++) {
            // Combine a sine wave envelope with deterministic pseudo-random noise
            const progress = i / count;
            const envelope = Math.sin(progress * Math.PI); // Peak in the middle
            const seed = Math.abs(Math.sin(hash + i * 2.3) * 1000) % 1;
            const noise = 0.3 + 0.7 * seed;
            const height = envelope * noise;
            peaks.push(Math.max(0.05, height)); // Ensure a minimum height
        }
        return peaks;
    };

    if (type === 'equalizer') {
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

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            if (background && background !== 'transparent') {
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
            }

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
                context.close().catch(() => { });
            }
        };

    } else if (type === 'waveform') {
        const barCount = Math.floor(WIDTH / 4); // A bar every 4px
        const peaks = generatePeaks(barCount, sourceUrl);
        let hoverPercent = null;

        const drawWaveform = () => {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            if (background && background !== 'transparent') {
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
            }

            const duration = audio.duration || 1;
            const currentProgress = audio.currentTime / duration;

            for (let i = 0; i < barCount; i++) {
                const barX = i * 4;
                const barHeight = peaks[i] * (HEIGHT - 10);
                const barY = (HEIGHT - barHeight) / 2;
                const barProgress = i / barCount;

                if (hoverPercent !== null && barProgress <= hoverPercent) {
                    ctx.fillStyle = hexToRgba(color, 0.8);
                } else if (barProgress <= currentProgress) {
                    ctx.fillStyle = color;
                } else {
                    ctx.fillStyle = hexToRgba(color, 0.25);
                }

                drawRoundedRect(ctx, barX, barY, 2, barHeight, 1);
            }
        };

        function drawRoundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        }

        function hexToRgba(hex, opacity) {
            let c = hex.substring(1);
            if (c.length === 3) {
                c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
            }
            const r = parseInt(c.substring(0, 2), 16);
            const g = parseInt(c.substring(2, 4), 16);
            const b = parseInt(c.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }

        timeUpdateListener = () => {
            drawWaveform();
        };
        audio.addEventListener("timeupdate", timeUpdateListener);

        clickListener = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickedPercent = clickX / rect.width;
            if (audio.duration) {
                player.currentTime = clickedPercent * audio.duration;
            }
        };
        canvas.addEventListener("click", clickListener);

        mouseMoveListener = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            hoverPercent = mouseX / rect.width;
            drawWaveform();
        };
        canvas.addEventListener("mousemove", mouseMoveListener);

        mouseLeaveListener = () => {
            hoverPercent = null;
            drawWaveform();
        };
        canvas.addEventListener("mouseleave", mouseLeaveListener);

        drawWaveform();

        const resizeObserver = new ResizeObserver(() => {
            const newDpr = window.devicePixelRatio || 1;
            const newWidth = canvas.getBoundingClientRect().width || 500;
            const newHeight = canvas.getBoundingClientRect().height || 60;
            canvas.width = newWidth * newDpr;
            canvas.height = newHeight * newDpr;
            ctx.scale(newDpr, newDpr);
            drawWaveform();
        });
        resizeObserver.observe(canvas);

        return () => {
            audio.removeEventListener("timeupdate", timeUpdateListener);
            canvas.removeEventListener("click", clickListener);
            canvas.removeEventListener("mousemove", mouseMoveListener);
            canvas.removeEventListener("mouseleave", mouseLeaveListener);
            resizeObserver.disconnect();
        };
    }
};

export default handleWave;