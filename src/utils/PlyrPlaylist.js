import { toHHMMSS } from "../js/utils";
import { resolveAudioSrc } from "./gDriveProxy";

const durationCache = new Map();

class PlyrPlaylist {
    constructor(player, audios, options = {}) {
        this.player = player;
        this.audios = audios.map(audio => ({
            ...audio,
            source: audio.source ? resolveAudioSrc(audio.source) : audio.source
        }));
        if (!player.elements.container) return;

        this.shuffle = options.shuffle || false;
        this.thumb = options.thumb || "";
        this.repeat = false;

        // elements
        this.playlistItems = player.elements.container?.querySelectorAll('[data-plyr="playlist-item"]') || [];
        this.playlistTitle = player.elements.container.querySelector('[data-plyr="playlist-title"]');
        this.playlistArtist = player.elements.container.querySelector('[data-plyr="playlist-artist"]');
        this.playlistCover = player.elements.container.querySelector('[data-plyr="playlist-cover"]');
        this.playlistSeeMoreItems = player.elements.container.querySelector('[data-plyr="playlist-see-more-items"]');
        this.nextButton = player.elements.container.querySelector('[data-plyr="next"]');
        this.prevButton = player.elements.container.querySelector('[data-plyr="prev"]');
        this.seeMoreButton = player.elements.container.querySelector('[data-plyr="see-more"]');
        this.shuffleButton = player.elements.container.querySelector('[data-plyr="shuffle"]');
        this.repeatButton = player.elements.container.querySelector('[data-plyr="repeat"]');
        this.currentIndex = 0;
        this.multipleAudio = options.multipleAudio ?? false;

        this.setupEventListeners();
        this.setItemsDuration();

    }
    setupEventListeners() {
        this.playlistItems.forEach((item, index) => {
            const src = this.audios[index]?.source;

            if (!src) {
                item.classList.add('item-disabled');
                return;
            }

            item.addEventListener('click', () => {
                this.switchToAudio(index);
            });
        })

        this.player.on('ended', () => {
            if (this.repeat) {
                this.switchToAudio(this.currentIndex, true);
            } else {
                this.next(true);
            }
        })

        this.nextButton?.addEventListener('click', () => {
            this.next();
        })

        this.prevButton?.addEventListener('click', () => {
            this.prev();
        })

        this.player.on('play', () => {
            this.playlistItems.forEach((item, index) => {
                if (index === this.currentIndex) {
                    item.classList.add('item-playing');
                } else {
                    item.classList.remove('item-playing');
                }
            })

            if (!this.multipleAudio) {
                const audios = document.querySelectorAll("audio");
                audios.forEach((item) => {
                    if (!item.isEqualNode(this.player.elements.container.querySelector('audio'))) {
                        item.pause();
                    }
                });
            }
        })

        this.player.on('pause', () => {
            this.playlistItems.forEach((item, index) => {
                if (index === this.currentIndex) {
                    item.classList.remove('item-playing');
                } else {
                    item.classList.remove('item-playing');
                }
            })
        })

        this.seeMoreButton?.addEventListener('click', () => {
            if (this.playlistSeeMoreItems.classList.contains('hidden')) {
                this.playlistSeeMoreItems.classList.remove('hidden');
                this.seeMoreButton.classList.remove('rotate-180');
            } else {
                this.playlistSeeMoreItems.classList.add('hidden');
                this.seeMoreButton.classList.add('rotate-180');
            }
        })

        // switch audio
        this.player.on('ready', () => {
            this.switchToAudio(this.currentIndex, false);
        })

        // handle repeat
        this.handleRepeat();
        // handle shuffle
        this.handleShuffle();
        if (this.shuffle && this.shuffleButton) {
            this.shuffleButton.classList.add('active');
        }
    }

    handleShuffle() {
        this.shuffleButton?.addEventListener('click', () => {
            this.shuffle = !this.shuffle;
            if (this.shuffle) {
                this.shuffleButton.classList.add('active');
            } else {
                this.shuffleButton.classList.remove('active');
            }
        })
    }

    handleRepeat() {
        this.repeatButton?.addEventListener('click', () => {
            this.repeat = !this.repeat;
            if (this.repeat) {
                this.repeatButton.classList.add('active');
            } else {
                this.repeatButton.classList.remove('active');
            }
        })
    }

    switchToAudio(index, play = true) {
        if (index < 0 || index >= this.audios.length) return;

        if (this.currentIndex === index && play) {
            if (this.player.playing) {
                this.player.pause()?.catch((error) => {
                    //eslint-disable-next-line no-console
                    console.error('Error playing audio:', error);
                });
            } else {
                this.player.play()?.catch((error) => {
                    //eslint-disable-next-line no-console
                    console.error('Error playing audio:', error);
                });
            }
            return;
        }

        this.currentIndex = index;
        const src = this.audios[this.currentIndex]?.source;

        if (!src) return;

        const audioEl = this.player.elements?.container ? this.player.elements.container.querySelector('audio') : null;
        if (audioEl) {
            audioEl.src = src;

            if (this.playlistTitle) {
                this.playlistTitle.textContent = this.audios[this.currentIndex]?.title || '';
            }
            if (this.playlistArtist) {
                this.playlistArtist.textContent = this.audios[this.currentIndex]?.artist || '';
            }
            if (this.playlistCover) {
                this.playlistCover.src = this.audios[this.currentIndex]?.poster || this.thumb;
            }

            this.playlistItems.forEach((item, idx) => {
                if (idx === this.currentIndex) {
                    item.classList.add('item-active');
                } else {
                    item.classList.remove('item-active');
                }
            });

            if (play) {
                this.player.play()?.catch((error) => {
                    //eslint-disable-next-line no-console
                    console.error('Error playing audio:', error);
                });
            }
        }

    }
    next(forcePlay = null) {
        let index = (this.currentIndex + 1) % this.audios.length;
        if (this.shuffle) {
            index = Math.floor(Math.random() * this.audios.length);
            if (this.audios.length > 1 && index === this.currentIndex) {
                index = (index + 1) % this.audios.length;
            }
        }
        const shouldPlay = forcePlay !== null ? forcePlay : (this.player.playing === true);
        this.switchToAudio(index, shouldPlay);
    }
    prev(forcePlay = null) {
        const shouldPlay = forcePlay !== null ? forcePlay : (this.player.playing === true);
        this.switchToAudio((this.currentIndex - 1 + this.audios.length) % this.audios.length, shouldPlay);
    }

    setItemsDuration() {
        this.playlistItems.forEach((item, index) => {
            const durationEl = item.querySelector(".duration");
            if (!durationEl) return;

            const src = this.audios[index]?.source;
            if (!src) return;

            if (durationCache.has(src)) {
                durationEl.innerText = toHHMMSS(durationCache.get(src));
                return;
            }

            const trackDuration = this.audios[index]?.duration;
            if (trackDuration && !isNaN(trackDuration) && trackDuration > 0) {
                durationCache.set(src, trackDuration);
                durationEl.innerText = toHHMMSS(trackDuration);
            }
        });

        const updateCurrentDuration = () => {
            const currentSrc = this.audios[this.currentIndex]?.source;
            const duration = this.player.duration;
            if (currentSrc && duration && !isNaN(duration) && duration > 0) {
                durationCache.set(currentSrc, duration);
                const currentItem = this.playlistItems[this.currentIndex];
                const durationEl = currentItem?.querySelector(".duration");
                if (durationEl) {
                    durationEl.innerText = toHHMMSS(duration);
                }
            }
        };

        this.player.on('loadedmetadata', updateCurrentDuration);
        this.player.on('durationchange', updateCurrentDuration);
        this.player.on('canplay', updateCurrentDuration);
    }

}

export default PlyrPlaylist;
