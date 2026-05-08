import "./style.scss";
import thumb from "../../../assets/img/sticky-default.jpg";
const bluePlaylistSkin = (items = [], customOptions = {}) => {
    return `
    <div class="playlist_container hextensive">
        <div class="plyr__controls controls left">
        	<img class="poster" data-plyr="cover" src="${items[0]?.poster || thumb}" alt="">
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
                <div class="repeat-shuffle" >
                    <span class="plyr__control" data-plyr="shuffle"><svg class="icon">
                    <use xlink:href="#shuffle"></use>
                    </svg></span>
                    <span class="plyr__control" active="false" data-plyr="repeat"><svg class="icon">
                    <use xlink:href="#exchange"></use>
                    </svg></span>
                </div>
                <div class="re-ply-fast">
                    <button type="button" class="plyr__control" data-plyr="${customOptions?.forward_rewind_change_audio && customOptions?.forward_rewind_change_audio !== '0' && customOptions?.forward_rewind_change_audio !== 'false' ? 'prev' : 'rewind'}">
                        <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
                        <span class="plyr__tooltip" role="tooltip">Rewind {seektime}s</span>
                    </button>
                    <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
                        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
                        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
                        <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
                        <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
                    </button>
                    <button type="button" class="plyr__control" data-plyr="${customOptions?.forward_rewind_change_audio && customOptions?.forward_rewind_change_audio !== '0' && customOptions?.forward_rewind_change_audio !== 'false' ? 'next' : 'fast-forward'}">
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
          </div>
            <div class="plyr__meta">
                <h2 class="title" data-plyr="title">${items[0]?.title}</h2>
                <h3 class="artist" data-plyr="artist">${items[0]?.artist}</h3>
            </div>
        </div>
				<div class="right">
				${items
            .map(
                ({ title, artist, source }, index) =>
                    `<div class="hsong-item plyr__controlss"  data-index="${index}" data-audio-item>
							<span class="ply_icon">
								<button type="button" class="plyr__control" aria-label="Play, {title}">
									<svg class="icon--pressed" role="presentation">
										<use href="#plyr-pause"></use>
									</svg>
									<svg class="icon--not-pressed" role="presentation">
										<use href="#plyr-play"></use>
									</svg>
								</button>
							</span>
							<div class="meta-data">
								<h3 class="title">${title || ""}</h3>
								<span class="singer">${artist || ""}</span>
							</div>
							<span class="time duration">00:00</span>
							${customOptions?.hide_download
                        ? ""
                        : `<a class="plyr__controls__item plyr__control" target="_blank" download href="${source}" data-plyr="download"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-download"></use></svg><span class="plyr__sr-only">Download</span></a>`
                    }
						</div>`
            )
            .join("")}
				</div>
    	</div>`;
};

export default bluePlaylistSkin;
