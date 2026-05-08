import thumb from './../../../../../assets/img/sticky-default.jpg';

export default function skinWave(poster = "", title = "", author = "") {
  return `<div class="skin_container wave radius">
      <div class="thumb">
        <img src="${poster || thumb}" />
      </div>
      <div class="info-wave">
        <div class="wave">
          <canvas id="wave-canvas"></canvas>
          <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
          <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
        </div>
        <div class="info">
          <div class="play">
            <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
              <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
            </button>
          </div>
          <div class="title-author">
            ${title && `<h2 title="${title}">${title}</h2>`}
            ${author && `<p>${author}</p>`}
          </div>
          <div class="volume_controls">
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
    </div>`;
}