import { generateKeyFromUrl } from "../js/utils";

// config = {disablePause: false, startTime: 0}
class PlyrExtend {
    constructor(player, config) {
        this.player = player;
        this.config = config;
        this.key = null;
        this.configure();

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
