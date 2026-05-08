import thumb from './../../../../../assets/img/sticky-default.jpg';
export default function skinFusion(poster = null, title = null, source = null, otherControls = { download: false }) {
  const download =
    otherControls?.download === true
      ? `<a class="plyr__controls__item plyr__control plyr__download" href="${source}" target="_blank" download data-plyr="download">
          <svg aria-hidden="true" focusable="false">
            <use xlink:href="#plyr-download"></use>
          </svg>
          <span class="plyr__sr-only">Download</span>
        </a>`
      : "";
  const repeat =
    otherControls?.repeat === true
      ? `<button type="button" data-active="false" class="plyr__control" data-plyr="repeat"><svg class="icon">
          <use xlink:href="#exchange"></use>
        </button>`
      : "";
  const playlist = otherControls?.playlist === true ? `<button type="button" class="plyr__control" data-active="true" data-plyr="playlist"><span class="dashicons dashicons-playlist-audio"></span></button>` : "";
  return `<div class="plyr__controls radius">
    <div class="plyr__controls rewind_play_fastforward">
    ${(poster !== 'null') ? `<img class="thumbnails" src="${poster || thumb}" alt=""></img>` : ''}
    <div class="plyr__controls">
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
    </div>
    <div class="infos">
      <div class="title">
        <h3>${title}</h3>
    </div>
        <div class="time_progress">
        <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
        <div class="plyr__progress">
          <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
          <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
          <span role="tooltip" class="plyr__tooltip">00:00</span>
        </div>
        <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
        </div>
      </div>
    <div class="other_controls">
      <div class="extra_controls">
        ${download}
        ${repeat}
        ${playlist}
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
  </div>`;
}