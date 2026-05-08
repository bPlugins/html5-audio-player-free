import "./style.scss";

const cardSkin = (items = []) => {
  return `<div class="flat-black-player-container playlist_container">
      <div id="list-screen" class="slide-in-top">
        <div id="list-screen-header" class="hide-playlist">
          <img id="up-arrow" src="https://521dimensions.com/img/open-source/amplitudejs/examples/flat-black/up.svg"/>
          Hide Playlist
        </div>
        <div id="list">
          
          ${items
            .map(
              ({ title, artist }, index) => `
            <div class="song amplitude-song-container amplitude-play-pause" data-audio-item data-index="${index}">
              <span class="song-number-now-playing">
                <span class="number">${index + 1}</span>
                <img class="now-playing" src="https://521dimensions.com/img/open-source/amplitudejs/examples/flat-black/now-playing.svg"/>
              </span>
  
              <div class="song-meta-container">
                <span class="song-name" data-amplitude-song-info="name" data-amplitude-song-index="0">${title || ""}</span>
                <span class="song-artist-album"><span data-amplitude-song-info="artist" data-amplitude-song-index="0">${artist || ""}</span>
              </div>
              <span class="duration">3:30<span>
            </div>`
            )
            .join("")}
        </div>
  
        <div id="list-screen-footer">
          <div id="list-screen-meta-container">
            <span data-amplitude-song-info="name" class="song-name"></span>
  
            <div class="song-artist-album">
              <span data-amplitude-song-info="artist"></span>
            </div>
          </div>
          <div class="list-controls">
            <div class="list-previous amplitude-prev"></div>
            <div class="list-play-pause amplitude-play-pause paused" data-plyr="play2"></div>
            <div class="list-next amplitude-next"></div>
          </div>
        </div>
      </div>
      <div id="player-screen">
        <div class="player-header down-header">
          <img id="down" src="https://521dimensions.com/img/open-source/amplitudejs/examples/flat-black/down.svg"/>
          Show Playlist
        </div>
        <div id="player-top">
          <img data-amplitude-song-info="cover_art_url" data-plyr="cover" src="${items[0]?.poster}"/>
        </div>
        <div id="player-progress-bar-container">
          <progress class="song-played-progress" min="0" max="100" step="0.01"></progress>
          <progress id="song-buffered-progress" class="amplitude-buffered-progress" value="0"></progress>
        </div>
        
        <div id="player-middle">
          <div id="time-container">
            <span class="amplitude-current-time time-container plyr__time--current"></span>
            <span class="amplitude-duration-time time-container plyr__time--duration"></span>
          </div>
          <div id="meta-container">
            <span data-amplitude-song-info="name" class="song-name"></span>
  
            <div class="song-artist-album">
              <span data-amplitude-song-info="artist"></span>
            </div>
          </div>
        </div>
        <div id="player-bottom">
          <div id="control-container">
  
            <div id="shuffle-container">
              <div class="amplitude-shuffle amplitude-shuffle-off" data-plyr="shuffle" id="shuffle"></div>
            </div>
  
            <div id="prev-container">
              <div class="amplitude-prev" data-plyr="prev" id="previous"></div>
            </div>
  
            <div id="play-pause-container">
              <div class="amplitude-play-pause" data-plyr="play" id="play-pause"></div>
            </div>
  
            <div id="next-container">
              <div class="amplitude-next" data-plyr="next" id="next"></div>
            </div>
  
            <div id="repeat-container">
              <div class="amplitude-repeat" id="repeat" data-plyr="repeat"></div>
            </div>
  
          </div>
          <div id="volume-container">
            <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
              <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
            </button>
            <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume" class="amplitude-volume-slider">
          </div>
        </div>
      </div>
    </div>`;
};

export default cardSkin;

export const listItem = () => {};
