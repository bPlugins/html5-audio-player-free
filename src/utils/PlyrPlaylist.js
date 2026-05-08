import { toHHMMSS } from "../js/utils";

class PlyrPlaylist {
    constructor(player, audios, options = {}) {
        this.player = player;
        this.audios = audios;
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
                this.switchToAudio(this.currentIndex);
            } else {
                this.next();
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
        const src = this.audios[this.currentIndex].source;

        if (!src) return;


        if (this.player.elements.container.querySelector('audio')) {

            this.player.elements.container.querySelector('audio').src = src;
            if (this.playlistTitle) {
                this.playlistTitle.textContent = this.audios[this.currentIndex].title;
            }
            if (this.playlistArtist) {
                this.playlistArtist.textContent = this.audios[this.currentIndex].artist;
            }
            if (this.playlistCover) {
                this.playlistCover.src = this.audios[this.currentIndex].poster || this.thumb;
            }

            this.playlistItems.forEach((item, index) => {
                if (index === this.currentIndex) {
                    item.classList.add('item-active');
                } else {
                    item.classList.remove('item-active');
                }
            })

            if (play) {
                this.player.play()?.catch((error) => {
                    //eslint-disable-next-line no-console
                    console.error('Error playing audio:', error);
                });
            }

        }

    }
    next() {
        let index = (this.currentIndex + 1) % this.audios.length;
        if (this.shuffle) {
            index = Math.floor(Math.random() * this.audios.length);
            if (this.audios.length > 1 && index === this.currentIndex) {
                index = (index + 1) % this.audios.length;
            }
        }
        this.switchToAudio(index);
    }
    prev() {
        this.switchToAudio((this.currentIndex - 1 + this.audios.length) % this.audios.length);
    }

    setItemsDuration() {
        this.playlistItems.forEach((item, index) => {
            const audio = document.createElement("audio");
            if (item.querySelector(".duration")) {
                audio.src = this.audios[index]?.source;

                const updateDuration = () => {
                    if (!isNaN(audio.duration) && audio.duration !== Infinity) {
                        item.querySelector(".duration").innerText = toHHMMSS(audio.duration);
                    }
                };

                audio.addEventListener("loadedmetadata", updateDuration);
                audio.addEventListener("durationchange", updateDuration);
            }
        })
    }

}

export default PlyrPlaylist;
