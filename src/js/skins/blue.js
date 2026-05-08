const blueSkin = () => {
    return `<div class="plyr__controls controls">
    <img class="poster" src="https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-to-answer.jpg" alt="">
    <div class="plyr_controls">
        <div class="progressbar plyr__controls">
            <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
            <div class="plyr__progress">
                <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
                <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
                <span role="tooltip" class="plyr__tooltip">00:00</span>
            </div>
            <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
        </div>
        <div class="main-controls plyr__controls">
            <div class="repeat-shuffle ">
                <span class="plyr__control" active="true"><svg class="icon">
                <use xlink:href="#shuffle"></use>
              </svg></span>
                <span class="plyr__control" active="false"><svg class="icon">
                <use xlink:href="#exchange"></use>
              </svg></span>
            </div>
            <div class="re-ply-fast">
                <button type="button" class="plyr__control" data-plyr="rewind">
                    <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Rewind {seektime}s</span>
                </button>
                <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
                    <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
                    <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
                    <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
                    <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
                </button>
                <button type="button" class="plyr__control" data-plyr="fast-forward">
                    <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Forward {seektime}s</span>
                </button>
            </div>
            <div class="volume">
                <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
                    <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
                    <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
                    <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
                    <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
                </button>
                <div class="plyr__volume">
                    <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
                </div>
            </div>
        </div>
    </div></div>`;
};

export default blueSkin;
