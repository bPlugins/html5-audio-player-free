export default function skinStamp(title) {
  return `<div class="skin_container StampAudioPlayerSkin radius">
   <button type="button" class="muteUnmute plyr__control" data-plyr="mute"><svg class="icon--pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-muted"></use></svg><svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-volume"></use></svg></button>
   <div class="extraOptions">
   <h3 class="audioTitle">${title}</h3>

   <div class="plyr__volume">
        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
    </div>
    </div>

   <div class="mainOptions">
   <button class="leftAudio  plyr__controls__item plyr__control" data-plyr="rewind"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-rewind"></use></svg></button>
   <button class="rightAudio plyr__controls__item plyr__control" data-plyr="fast-forward"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-fast-forward"></use></svg></button>

   <div class="controls">
   <div class="play_forward_rewind">
    <button class="plyr__controls__item plyr__control" data-plyr="rewind"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-rewind"></use></svg></button>
    <button class="plyr__controls__item plyr__control playPauseAudio" type="button" data-plyr="play" aria-label="Play"><svg class="icon--pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-pause"></use></svg><svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg></button>
    <button class="plyr__controls__item plyr__control" data-plyr="fast-forward"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-fast-forward"></use></svg></button>
</div>

   <div class="audioProgressView">
    <div class="progressWrap">
    <span class="plyr__time currentTime plyr__time--current">00:00</span>
    <div class="plyr__controls__item plyr__progress__container"><div class="plyr__progress"><input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" autocomplete="off" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="plyr-seek-7930" aria-valuetext="00:00 of 03:05" seek-value="14.901800327332243" style="--value:0%;"><progress class="plyr__progress__buffer" min="0" max="100" value="0" role="progressbar" aria-hidden="true">% buffered</progress><span class="plyr__tooltip" style="left: 11.2357%;">00:20</span></div></div>
    <span class="plyr__time totalTime plyr__time--duration">00:00</span>
      </div>
      </div>
    </div>

    </div>
    </div>`;
}