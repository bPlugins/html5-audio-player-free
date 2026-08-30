import { generateKeyFromUrl } from "../js/utils";

// config = {disablePause: false, startTime: 0}
class PlyrExtend {
    constructor(player, config) {
        this.player = player;
        this.config = config || {};
        this.key = null;
        this.configure();
        this.setupDuration();

        this.repeatEl = player.elements?.controls?.querySelector('[data-plyr="repeat"]');
        this.config.repeat = false;

        this.repeatEl?.addEventListener('click', () => {
            this.repeatEl.classList.toggle('control-active');
            this.config.repeat = !this.config.repeat;
        })
        this.player.on('ended', () => {
            if (this.config.repeat) {
                this.player.play();
            }
        })
    }

    configure() {
        this.player.on('loadedmetadata', () => {
            this.key = generateKeyFromUrl(this.player.source)
            if (!this.config.saveState) {
                this.player.currentTime = parseInt(this.config.startTime);
            } else {
                const state = localStorage.getItem(this.key);
                if (state) {
                    const { currentTime } = JSON.parse(state);
                    this.player.currentTime = currentTime;
                }
            }

            if (this.player.volume === 0) {
                this.player.volume = 0.4;
            }

            if (this.config.muted !== undefined) {
                this.player.muted = this.config.muted;
            }
        });
        if (this.config.disablePause) {
            this.player.on('pause', () => {
                this.player.play();
            });
        }

        if (this.config.saveState) {
            this.player.on('timeupdate', () => {
                this.saveState();
            });

        }
    }

    setupDuration() {
        const setDurationText = (dur) => {
            const container = this.player.elements?.container;
            const durationEls = container ? container.querySelectorAll(".plyr__time--duration") : document.querySelectorAll(".plyr__time--duration");
            if (durationEls && durationEls.length > 0) {
                if (dur && !isNaN(dur) && dur > 0) {
                    const sec_num = parseInt(dur, 10);
                    const hours = Math.floor(sec_num / 3600);
                    const minutes = Math.floor((sec_num - hours * 3600) / 60);
                    const seconds = sec_num - hours * 3600 - minutes * 60;
                    const formatted = (hours > 0 ? (hours < 10 ? "0" + hours : hours) + ":" : "") +
                        (minutes < 10 ? "0" + minutes : minutes) + ":" +
                        (seconds < 10 ? "0" + seconds : seconds);
                    durationEls.forEach(el => {
                        el.textContent = formatted;
                    });
                } else {
                    durationEls.forEach(el => {
                        el.textContent = "00:00";
                    });
                }
            }
        };

        const updateDuration = () => {
            const audioEl = this.player.media || this.player.elements?.container?.querySelector('audio');
            const dur = this.player.duration || (audioEl && audioEl.duration);
            setDurationText(dur);
        };

        this.player.on("ready", updateDuration);
        this.player.on("loadedmetadata", updateDuration);
        this.player.on("canplay", updateDuration);
        this.player.on("durationchange", updateDuration);
        this.player.on("timeupdate", () => {
            if (!this._durationSet) {
                updateDuration();
                if (this.player.duration > 0) {
                    this._durationSet = true;
                }
            }
        });

        const audioEl = this.player.media || this.player.elements?.container?.querySelector('audio');
        if (audioEl) {
            audioEl.setAttribute('preload', 'metadata');
            audioEl.addEventListener("loadedmetadata", updateDuration);
            audioEl.addEventListener("canplay", updateDuration);
            audioEl.addEventListener("durationchange", updateDuration);
            audioEl.addEventListener("loadeddata", updateDuration);
            if (audioEl.readyState >= 1) {
                updateDuration();
            } else {
                try { audioEl.load(); } catch (e) { }
            }
        }

        let src = this.config.source;
        if (!src && typeof this.player.source === 'string') {
            src = this.player.source;
        } else if (!src && this.player.source && typeof this.player.source === 'object' && Array.isArray(this.player.source.sources) && this.player.source.sources[0]?.src) {
            src = this.player.source.sources[0].src;
        }
        if (!src && audioEl) {
            src = audioEl.src || audioEl.getAttribute('src') || '';
        }

        const isPreloadNone = this.config?.preload === 'none' || (audioEl && audioEl.getAttribute('preload') === 'none');
        if (!isPreloadNone && src && typeof src === 'string' && src.trim() !== '') {
            const tempAudio = new Audio();
            tempAudio.preload = "metadata";
            const handleLoaded = () => {
                if (tempAudio.duration && !isNaN(tempAudio.duration) && tempAudio.duration > 0) {
                    setDurationText(tempAudio.duration);
                }
            };
            tempAudio.addEventListener("loadedmetadata", handleLoaded);
            tempAudio.addEventListener("durationchange", handleLoaded);
            tempAudio.addEventListener("canplay", handleLoaded);
            tempAudio.addEventListener("loadeddata", handleLoaded);
            tempAudio.src = src;
            if (tempAudio.readyState >= 1) {
                handleLoaded();
            }
        } else {
            updateDuration();
        }
    }

    saveState() {
        const currentTime = this.player.currentTime;
        const state = { currentTime };
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    init(player) {
        this.player = player;
    }

    destroy() {
        this.player = null;
    }
}

export default PlyrExtend;
