import toHHMMSS from "../../../../utils/toHHMMSS";
import { generateKeyFromUrl } from "../utils";

class H5AP {
  audioPlayer(audioPlayer, options) {
    const $ = jQuery;
    const otherControls = {
      repeat: true,
    };
    options.i18n = {};
    if (typeof h5ap_i18n != "undefined") {
      options.i18n = h5ap_i18n;
    }
    let { controls, seekTime, i18n, title, artist, disablePause, poster, muted, autoplay, startTime, source, skin, disableDownload, fusionDownload, color, background, repeat, primaryColor, saveState = false } = options;

    if (skin === "default" && disableDownload === false) {
      otherControls.download = true;
    }

    if (skin === "fusion" && fusionDownload === true) {
      otherControls.download = true;
    }

    //initialize skin
    if (skin === "fusion") {
      controls = this.skinFusion(poster, title, source, otherControls);
    }

    if (skin === "wave") {
      controls = this.skinWave(poster, title, artist, background, color);
    }

    if (skin === "card-1") {
      controls = this.skinCardOne({ title, artist });
    }
    if (skin === "card-2") {
      controls = this.skinCardTwo({ title, artist, poster });
    }

    if (skin === "simple-1") {
      controls = this.skinSimpleOne({ title, artist });
    }
    if (skin === "simple-2") {
      controls = this.skinSimpleTwo({ title, artist, poster });
    }

    if (skin === "stamp") {
      controls = this.skinStamp();
    }

    //remove focus
    $(".skin_default .plyr__control").on("focus", function () {
      setTimeout(() => {
        this.blur();
      }, 1000);
    });

    let plyr = localStorage.getItem("plyr");
    // const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    const isFirefox = typeof InstallTrigger !== "undefined";
    if (autoplay && plyr && isFirefox) {
      plyr = JSON.parse(plyr);
      plyr.muted = true;
      localStorage.setItem("plyr", JSON.stringify(plyr));
    } else if (plyr) {
      plyr = JSON.parse(plyr);
      plyr.muted = false;
      localStorage.setItem("plyr", JSON.stringify(plyr));
    }

    // window.onload = function () {
    //   console.log($(audioPlayer).find("audio"));
    //   $(audioPlayer).find("audio")[0].play();
    //   console.log(navigator.getAutoplayPolicy(audioPlayer).find("audio")[0]);
    // };
    // return;

    //initialize player

    const player = new Plyr($(audioPlayer).find("audio"), {
      controls,
      i18n,
      seekTime,
      loop: {
        active: repeat,
      },
      muted,
      autoplay,
      speed: { selected: 1, options: h5apPlayer?.speed.map(Number) },
    });

    const key = generateKeyFromUrl(player.source);
    this.handleSaveState(player, saveState, key);

    player.on("ready", function () {
      const state = localStorage.getItem(key);
      if (!saveState || !state) {
        const currentTime = parseInt(startTime);
        player.currentTime = currentTime;
        const interval = setInterval(() => {
          if (currentTime > player.currentTime) {
            player.currentTime = currentTime;
          } else {
            clearInterval(interval);
          }
        }, 50);
      }
    });

    if (skin != "default") {
      player.speed = 1;
    }

    if (autoplay) {
      player.play();
    }

    if (skin === "wave" && player) {
      this.wave(audioPlayer, player, primaryColor, background);
    }

    if (skin === "card-1" && player) {
      this.cardOne(audioPlayer, player, poster);
    }
    if (skin === "card-2" && player) {
      this.cardTwo(audioPlayer, player, poster);
    }

    if (disablePause) {
      this.disablePause(player);
    }

    //apply stamp player style
    if (options.skin === "stamp" && color != "") {
      $(audioPlayer).find(".StampAudioPlayerSkin button svg").css("fill", color);
      $(audioPlayer).find(".StampAudioPlayerSkin .extraOptions .audioTitle").css("color", color);
      $(audioPlayer).find(".StampAudioPlayerSkin .mainOptions .controls .audioProgressView .progressWrap .currentTime").css("color", color);
      $(audioPlayer).find(".StampAudioPlayerSkin .mainOptions .controls .audioProgressView .progressWrap .totalTime").css("color", color);
      $(audioPlayer).find(".StampAudioPlayerSkin .mainOptions .controls .playPauseAudio").css("border-color", color);
      $(audioPlayer).find(".audioTitle").text(title);
    }

    // responsive design if container width less than 500px
    if ($(audioPlayer).width() < 500 && skin === "fusion") {
      $(audioPlayer).addClass("skinFusionMobile");
    }

    // disable other player when playing this audio
    if (!h5apPlayer?.multipleAudio) {
      $(audioPlayer)
        .find('.plyr__control[data-plyr="play"]')
        .on("click", () => {
          if (player.playing) {
            this.disableOtherPlayer(player, true);
          }
        });
    }

    //dynamic repeat button
    $(audioPlayer)
      .find('[data-plyr="repeat"]')
      .on("click", function () {
        $(this).attr("data-active", $(this).attr("data-active") === "true" ? "false" : "true");
      });
    if (repeat === true) {
      $(audioPlayer).find('[data-plyr="repeat"]').attr("data-active", "true");
    }

    player.on("ended", function () {
      const repeat = $(audioPlayer).find('[data-plyr="repeat"]').attr("data-active");
      if (repeat === "true") {
        player.play();
      }
    });

    //dynamic repeat button for playlist
    $(audioPlayer)
      .find('[data-plyr="playlist"]')
      .on("click", function () {
        $(this).attr("data-active", $(this).attr("data-active") === "true" ? "false" : "true");
      });

    // update source if audio is not playing (soundcloud)
    let intervalId = null;
    player.on("ready", function () {
      const loadingPlaceholder = player.elements.container?.nextElementSibling;
      if (loadingPlaceholder && loadingPlaceholder.classList.contains("h5ap_lp")) {
        loadingPlaceholder.style.display = "none";
      }

      if (player.source?.includes("soundcloud")) {
        player.speed = 1;
        if (intervalId) {
          clearInterval(intervalId);
        }
        intervalId = setInterval(
          () => {
            if (!player.playing) {
              let tempSource = source;
              if (source.includes("?")) {
                tempSource = source + `&_${parseInt(Math.random(255) * 100)}`;
              } else {
                tempSource = source + `?_${parseInt(Math.random(255) * 100)}`;
              }

              player.source = {
                type: "audio",
                title: "Audio File",
                sources: [
                  {
                    src: tempSource,
                    type: "audio/mp3",
                  },
                ],
              };
            }
          },
          60 * 3 * 1000
        );
      }
    });
  }

  /**
   *
   * @param {*} selector
   * @param {*} options
   */
  quickPlayer(quickPlayer) {
    const $ = jQuery;
    const options = $(quickPlayer).data("options");
    options.i18n = {};
    if (typeof h5ap_i18n != "undefined") {
      options.i18n = h5ap_i18n;
    }
    const { seekTime, controls, i18n, autoplay, muted } = options;
    const player = new Plyr($(quickPlayer).find("audio"), {
      controls,
      i18n,
      seekTime,
      autoplay,
      muted,
      speed: { selected: 1, options: h5apPlayer?.speed.map(Number) },
    });

    if (autoplay) {
      player.play();
    }

    //pause other player if this player is playing
    if (!h5apPlayer?.multipleAudio) {
      $(quickPlayer)
        .find('.plyr__control[data-plyr="play"]')
        .on("click", () => {
          if (player.playing) {
            this.disableOtherPlayer(player, true);
          }
        });
    }
  }

  /**
   *
   * @param {String} stickyPlayer
   */
  stickyPlayer(stickyPlayer) {
    const $ = jQuery;
    const btnClose = $(stickyPlayer).find(".icon-no-alt");
    const btnMinimize = $(stickyPlayer).find(".icon-minus");
    const btnMaximize = $(stickyPlayer).find(".icon-plus");
    const poster = $(stickyPlayer).data("poster");
    const source = $(stickyPlayer).data("source");
    const title = $(stickyPlayer).data("title");
    const options = $(stickyPlayer).data("options");
    const { initialVolume, skin, background, saveState } = options;
    const otherControls = {};

    if (options?.stickyDownload === true) {
      otherControls.download = true;
    }
    if (options?.repeat === true) {
      otherControls.repeat = true;
    }

    $(window).on("scroll", function () {
      if (window.pageYOffset > 300) {
        $(stickyPlayer).fadeIn();
      }
    });

    //get player screen
    let controls = "";
    if (skin === "simple") {
      controls = this.skinSimple(title, poster, background);
    } else {
      controls = this.skinFusion(poster, title, source, otherControls);
    }

    let storage = localStorage.getItem("h5apStickyplaying");
    let option = { controls };
    if (options?.remember && storage != "false") {
      let plyr = localStorage.getItem("plyr");
      // if (autoplay && plyr) {
      //   plyr = JSON.parse(plyr);
      //   plyr.volume = 0;
      //   plyr.muted = true;
      //   localStorage.setItem("plyr", JSON.stringify(plyr));
      // } else if (plyr) {
      plyr = JSON.parse(plyr);
      plyr.volume = 0;
      plyr.muted = true;
      localStorage.setItem("plyr", JSON.stringify(plyr));
      // }
    }

    const player = new Plyr($(stickyPlayer).find("audio"), option);

    player.speed = 1;

    const key = generateKeyFromUrl(player.source);
    const state = localStorage.getItem(key);
    // if (!saveState || !state) {
    if (storage != "false") {
      if (!saveState || !state) {
        storage = JSON.parse(storage);
        setTimeout(() => {
          player.volume = 0.5;
          player.currentTime = storage?.time;
        }, 100);
        player.play();
      }
    }

    if (saveState) {
      if (state) {
        player.on("loadeddata", () => {
          const { currentTime } = JSON.parse(state);
          player.currentTime = currentTime;
        });
      }
      player.on("timeupdate", function () {
        localStorage.setItem(key, JSON.stringify({ currentTime: player.currentTime, playing: player.playing }));
      });
    }

    // setTimeout(() => {
    //   player.play();
    // }, 2000);

    // disable other player when playing this audio
    if (!h5apPlayer?.multipleAudio) {
      $(stickyPlayer)
        .find('.plyr__control[data-plyr="play"]')
        .on("click", () => {
          if (player.playing) {
            this.disableOtherPlayer(player, true);
          }
        });
    }

    //close player
    btnClose.on("click", function () {
      $(stickyPlayer).fadeOut();
      $(stickyPlayer).remove();
      player.stop();
    });

    // minimize player
    btnMinimize.on("click", function () {
      $(stickyPlayer).addClass("minimized");
      $(stickyPlayer).removeClass("maximized");
    });

    btnMaximize.on("click", function () {
      $(stickyPlayer).addClass("maximized");
      $(stickyPlayer).removeClass("minimized");
    });

    //set initial volume
    player.volume = initialVolume / 100;

    $(stickyPlayer)
      .find('[data-plyr="repeat"]')
      .on("click", function () {
        $(this).attr("data-active", $(this).attr("data-active") === "true" ? "false" : "true");
      });
    if (options?.repeat === true) {
      $(stickyPlayer).find('[data-plyr="repeat"]').attr("data-active", "true");
    }
    player.on("ended", function () {
      const repeat = $(stickyPlayer).find('[data-plyr="repeat"]').attr("data-active");
      if (repeat === "true") {
        player.play();
      }
    });

    // player.on("pause", function () {
    //   console.log("source", player.source);
    //   console.log("md5", MD5(decodeURI(player.source)).toString());
    // });

    // set cookie if there
    window.onbeforeunload = () => {
      // const e = event || window.event;
      // e.preventDefault();
      if (player.playing) {
        const object = { time: player.currentTime };
        if (stickyPlayer[0]) {
          object.html = controls;
          object.source = player.source;
        }
        localStorage.setItem("h5apStickyplaying", JSON.stringify(object));
      } else {
        localStorage.setItem("h5apStickyplaying", false);
      }
    };

    // if (!source) {
    //   const downloadBtn = $(stickyPlayer).find(".plyr__download");
    //   downloadBtn.hide();
    // }
  }

  /**
   *
   * @param {String} stickyPlayer
   */
  stickyPlayer2(stickyPlayer, optionss = false, infoss = false) {
    const detector = this.getDetectorData(stickyPlayer, { options: optionss, infos: infoss, initializer: "stickyPlayer2" });
    if (!detector) return false;
    const { wrapper, options } = detector;

    const $ = jQuery;
    const btnClose = $(wrapper).find(".icon-no-alt");
    const btnMinimize = $(wrapper).find(".icon-minus");
    const btnMaximize = $(wrapper).find(".icon-plus");
    const poster = $(wrapper).data("poster");
    const source = $(wrapper).data("source");
    const title = $(wrapper).data("title");
    // const options = $(stickyPlayer).data("options");
    const { initialVolume, skin, background, saveState } = options;
    const otherControls = {};

    // remove attributes
    $(wrapper).removeAttr("data-poster");
    $(wrapper).removeAttr("data-source");
    $(wrapper).removeAttr("data-title");
    $(wrapper).removeAttr("data-options");

    if (options?.stickyDownload === true) {
      otherControls.download = true;
    }
    if (options?.repeat === true) {
      otherControls.repeat = true;
    }

    $(window).on("scroll", function () {
      if (window.pageYOffset > 300) {
        $(wrapper).fadeIn();
      }
    });

    //get player screen
    let controls = "";
    if (skin === "simple") {
      controls = this.skinSimple(title, poster, background);
    } else {
      controls = this.skinFusion(poster, title, source, otherControls);
    }

    let storage = localStorage.getItem("h5apStickyplaying");
    let option = { controls };
    if (options?.remember && storage != "false") {
      let plyr = localStorage.getItem("plyr") || "{}";
      plyr = JSON.parse(plyr);
      plyr.volume = 0;
      plyr.muted = true;
      localStorage.setItem("plyr", JSON.stringify(plyr));
    }

    const player = new Plyr($(wrapper).find("audio"), option);

    if (storage != "false") {
      storage = JSON.parse(storage);
      setTimeout(() => {
        player.volume = 0.5;
        player.currentTime = storage?.time;
      }, 100);
      player.play();
    }

    // disable other player when playing this audio
    if (!h5apPlayer?.multipleAudio) {
      $(wrapper)
        .find('.plyr__control[data-plyr="play"]')
        .on("click", () => {
          if (player.playing) {
            this.disableOtherPlayer(player, true);
          }
        });
    }

    const key = generateKeyFromUrl(player.source);
    const state = localStorage.getItem(key);

    if (saveState) {
      if (state) {
        player.on("loadeddata", () => {
          const { currentTime } = JSON.parse(state);
          player.currentTime = currentTime;
        });
      }
      player.on("timeupdate", function () {
        localStorage.setItem(key, JSON.stringify({ currentTime: player.currentTime, playing: player.playing }));
      });
    }

    //close player
    btnClose.on("click", function () {
      $(wrapper).fadeOut();
      $(wrapper).remove();
      player.stop();
    });

    // minimize player
    btnMinimize.on("click", function () {
      $(wrapper).addClass("minimized");
      $(wrapper).removeClass("maximized");
    });

    btnMaximize.on("click", function () {
      $(wrapper).addClass("maximized");
      $(wrapper).removeClass("minimized");
    });

    //set initial volume
    player.volume = initialVolume / 100;

    $(wrapper)
      .find('[data-plyr="repeat"]')
      .on("click", function () {
        $(this).attr("data-active", $(this).attr("data-active") === "true" ? "false" : "true");
      });
    if (options?.repeat === true) {
      $(wrapper).find('[data-plyr="repeat"]').attr("data-active", "true");
    }

    player.on("ended", function () {
      const repeat = $(wrapper).find('[data-plyr="repeat"]').attr("data-active");
      if (repeat === "true") {
        player.play();
      }
    });

    //draggble
    // new Dragable(wrapper, {
    //   setPosition: false,
    //   useGPU: false,
    //   onDrag: (element) => {
    //     if (element) {
    //       element.style.bottom = "100%";
    //     }
    //   },
    //   handle: $(wrapper).find(".rewind_play_fastforward")[0],
    // });
    // $(wrapper).find(".rewind_play_fastforward").css("cursor", "move");
  }

  /**
   *
   * @param {*} player
   */
  disableOtherPlayer(player, play = true) {
    const $ = jQuery;
    const players = $("audio");
    players.each(function () {
      $(this)[0].pause();
    });

    if (play) {
      player?.play();
    } else {
      player?.pause();
    }
  }

  /**
   *
   * @param {String} poster
   * @param {String} title
   * @param {URL} source
   * @param {Object} otherControls
   * @returns Fusion Skin
   */
  skinFusion(poster = null, title = null, source = null, otherControls = { download: false }) {
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
        <use xlink:href="#exchange"></use></button>`
        : "";
    const playlist = otherControls?.playlist === true ? `<button type="button" class="plyr__control" data-active="true" data-plyr="playlist"><span class="dashicons dashicons-playlist-audio"></span></button>` : "";
    return `<div class="plyr__controls radius">
    <div class="plyr__controls rewind_play_fastforward">
    <img class="thumbnails" src="${poster}" alt="">
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

  skinStamp() {
    return `<div class="StampAudioPlayerSkin radius">
     <button type="button" class="muteUnmute plyr__control" data-plyr="mute"><svg class="icon--pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-muted"></use></svg><svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-volume"></use></svg></button>
     <div class="extraOptions">
     <h3 class="audioTitle">Audio Title</h3>

     <div class="audioSound">
     <input data-plyr="volume" type="range" name="sound" id="audioRange" value=".5" min="0" max="1" step="0.001" />
      </div>
      </div>

     <div class="mainOptions">
     <button class="leftAudio  plyr__controls__item plyr__control" data-plyr="rewind"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-rewind"></use></svg></button>

     <div class="controls">
     <div class="play_forward_rewind">
      <button class="playPauseAudio  plyr__controls__item plyr__control" data-plyr="rewind"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-rewind"></use></svg></button>
      <button class="plyr__controls__item plyr__control playPauseAudio" type="button" data-plyr="play" aria-label="Play"><svg class="icon--pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-pause"></use></svg><svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg></button>
     </div>

     <div class="audioProgressView">
      <div class="progressWrap">
      <span class="currentTime plyr__time--current">00:00</span>
      <div class="plyr__controls__item plyr__progress__container"><div class="plyr__progress"><input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" autocomplete="off" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="plyr-seek-7930" aria-valuetext="00:00 of 03:05" seek-value="14.901800327332243" style="--value:0%;"><progress class="plyr__progress__buffer" min="0" max="100" value="0" role="progressbar" aria-hidden="true">% buffered</progress><span class="plyr__tooltip" style="left: 11.2357%;">00:20</span></div></div>
      <span class="totalTime plyr__time--duration">00:00</span>
        </div>
        </div>
      </div>

     <button class="rightAudio plyr__controls__item plyr__control" data-plyr="fast-forward"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-fast-forward"></use></svg></button>
      </div>
      </div>`;
  }

  skinSimple(title = "", logo = "", background = "") {
    return `<div class="skin_simple_sticky" style="background:${background}">
      <div class="play">
      <button class="plyr__controls__item plyr__control" type="button" data-plyr="play" aria-label="Play Audio"><svg class="icon--pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-pause"></use></svg><svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg><span class="label--pressed plyr__sr-only">Pause</span><span class="label--not-pressed plyr__sr-only">Play Audio</span></button>
      </div>
      <div class="title" title="${title}">${title}</div>
      <div class="logo">
        <img src="${logo}" alt="" />
      </div>
    </div>`;
  }

  skinWave(poster = "", title = "", author = "") {
    return `<div class="wave radius">
      <div class="thumb">
        <img src="${poster}" />
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

  skinCardOne(info = {}) {
    return `<div class="skin_card_container">
    <div class="player">
      <div class="like waves-effect waves-light">
        <i class="icon-heart"></i>
      </div>
      <div class="mask"></div>
      <ul class="player-info info-one">
        <li>${info?.title}</li>
        <li>${info?.artist}</li>
        <li class="plyr__time--duration">0:00</li>
      </ul>
      <ul class="player-info info-two">
        <li>${info?.title}</li>
        <li>${info?.artist}</li>
        <li><span class="plyr__time--current" id="duration"></span><i> / </i><span class="plyr__time--duration">0:00</span></li>
      </ul>
      <button id="play-button" type="button" class="plyr__control waves-effect waves-button waves-float play-inactive" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed icon-play" role="presentation">s<use xlink:href="#plyr-pause"></use></svg>
        <svg class="icon--not-pressed icon-play" role="presentation"><use xlink:href="#plyr-play"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
      </button>
      <div class="control-row">
        <div class="waves-animation-one"></div>
        <div class="waves-animation-two"></div>
        <div class="details">
          <button id="pause-button" type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
            <svg class="icon--pressed icon-play" role="presentation">s<use xlink:href="#plyr-pause"></use></svg>
            <svg class="icon--not-pressed icon-play" role="presentation"><use xlink:href="#plyr-play"></use></svg>
            <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
          </button>
        <div class="seek-field">
          <div class="plyr__progress">
            <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
            <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
            <span role="tooltip" class="plyr__tooltip">00:00</span>
          </div>
        </div>
        <div class="volume_controls volume-icon">
            <button type="button" class=" plyr__control" aria-label="Mute" data-plyr="mute">
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
    </div>
  </div>`;
  }

  skinCardTwo(info = {}) {
    return `<div id="single-song-player" class="radius">
    <img data-amplitude-song-info="cover_art_url" src="${info?.poster}"/>
    <div class="bottom-container">
      <progress type="range" class="amplitude-song-played-progress" min="0" max="100" step="0.01"></progress>

      <div class="time-container">
        <span class="current-time plyr__time--current"></span>
        <span class="duration plyr__time--duration"></span>
      </div>

      <div class="control-container">
        <button id="play-button" type="button" class="plyr__control amplitude-play-pause" aria-label="Play, ${info.title}" data-plyr="play">
          <svg class="icon--pressed icon-play" role="presentation">s<use xlink:href="#plyr-pause"></use></svg>
          <svg class="icon--not-pressed icon-play" role="presentation"><use xlink:href="#plyr-play"></use></svg>
          <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
          <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
        </button>
        <div class="meta-container">
          <span data-amplitude-song-info="name" class="song-name">${info?.title}</span>
          <span data-amplitude-song-info="artist">${info?.artist}</span>
        </div>
      </div>
    </div>
  </div>`;
  }

  skinSimpleOne() {
    return `<div class="h5ap-player-skin-5 radius">
        <div class="progress-time">
            <div>
                <div class="plyr__progress">
                    <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
                    <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
                    <span role="tooltip" class="plyr__tooltip">00:00</span>
                </div>
            </div>
            <div class="time">
                <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
                <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
            </div>
        </div>
      <div class="controls">
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
    </div>`;
  }

  skinSimpleTwo({ poster }) {
    return `<div class="h5ap-player-skin-6">
        <div class="progress-time">
            <div class="thumbnail"><img src="${poster}" /></div>
        </div>
      <div class="controls">
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
    </div>`;
  }

  disablePause(player) {
    player.on("pause", function () {
      if (!player.ended) {
        player.play();
      }
    });
  }

  getDetectorData(wrapper, data = {}) {
    let mediaElement = null;
    let { options, infos, initializer, selector } = data;

    // get the exact wrapper
    if (wrapper === null) {
      return false;
    }
    if (typeof wrapper[0] !== "undefined") {
      wrapper.map((index, item) => {
        this[initializer](item, options, infos);
      });
      return false;
    }
    if (typeof wrapper.length !== "undefined" && wrapper.length === 0) {
      return false;
    }
    if (wrapper.querySelector(selector) !== null) {
      wrapper = wrapper.querySelector(selector);
    }

    //get data from attribute if it not pass in function
    if (!options && jQuery(wrapper).attr("data-options") != undefined) {
      options = JSON.parse(jQuery(wrapper).attr("data-options"));
    }

    if (!infos && jQuery(wrapper).attr("data-infos") != undefined) {
      infos = JSON.parse(jQuery(wrapper).attr("data-infos"));
    }

    mediaElement = wrapper.querySelector("audio");

    return {
      wrapper,
      options,
      infos,
      mediaElement,
    };
  }

  cardOne(wrapper, player, poster = "") {
    const detailsEl = wrapper.querySelector(".details");
    const maskEl = wrapper.querySelector(".mask");
    const playBtn = wrapper.querySelector("#play-button");
    const infoOne = wrapper.querySelector(".player-info.info-one");
    const infoTwo = wrapper.querySelector(".player-info.info-two");
    const cardContainer = wrapper.querySelector(".skin_card_container");
    const anmOne = wrapper.querySelector(".waves-animation-one");

    maskEl.style.background = `url(${poster})`;

    player.on("play", function () {
      cardContainer.classList.add("playing");
      playBtn.classList.add("play-active");
      playBtn.classList.remove("play-inactive");
      playBtn.style.display = "none";
      infoOne.style.display = "none";
      infoTwo.style.display = "block";
      infoTwo.classList.add("info-active");
      anmOne.style.display = "block";
      detailsEl.style.display = "block";
    });

    const updateDuration = () => {
      const durationEl = infoTwo.querySelector(".plyr__time--duration");
      if (durationEl && !isNaN(player.duration) && player.duration !== Infinity) {
        durationEl.innerText = toHHMMSS(player.duration);
      }
    };

    player.on("ready", updateDuration);
    player.on("loadedmetadata", updateDuration);
    player.on("durationchange", updateDuration);
  }

  cardTwo(wrapper, player) {
    const progressEl = wrapper.querySelector(".amplitude-song-played-progress");
    progressEl.addEventListener("click", function (e) {
      if (player.duration && !isNaN(player.duration) && player.duration !== Infinity) {
        const position = player.duration / progressEl.offsetWidth;
        player.currentTime = e.offsetX * position;
      }
    });

    player.on("timeupdate", function () {
      if (player.duration && !isNaN(player.duration) && player.duration !== Infinity) {
        progressEl.setAttribute("value", (100 / player.duration) * player.currentTime);
      }
    });
  }

  wave(wrapper, player, color = "#fff", background = "#333") {
    const audio = jQuery(wrapper).find("audio");
    const title = jQuery(wrapper).find(".title-author h2");
    if (title) {
      const titleText = title.text();
      const dot = titleText.length > title?.width() / 10.5 ? "..." : "";
      jQuery(title).text(titleText.substr(0, title?.width() / 10.5) + dot);
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext || false;
    const context = new AudioContext();

    if (context) {
      var src = context.createMediaElementSource(audio[0]);
      var analyser = context.createAnalyser();

      var canvas = jQuery(wrapper).find("#wave-canvas")[0];
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 512;
        if (wrapper?.offsetWidth > 800) {
          analyser.fftSize = 1024;
        }

        var bufferLength = analyser.frequencyBinCount;

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 1;
        var barHeight;
        var x = 0;

        const renderFrame = () => {
          requestAnimationFrame(renderFrame);

          x = 0;

          analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = background;
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          for (var i = 0; i < bufferLength; i++) {
            if (!player.playing) {
              barHeight = dataArray[i] + 100;
            } else {
              barHeight = dataArray[i];
            }

            // var r = barHeight + 25 * (i / bufferLength);
            // var g = 250 * (i / bufferLength);
            // var b = 50;

            // ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillStyle = color;
            ctx.fillRect(x, HEIGHT - barHeight - 80, barWidth, barHeight + 80);

            x += barWidth + 5;
          }
        };

        renderFrame();
      }

      const palyButton = jQuery(wrapper).find('[data-plyr="play"]');
      palyButton.one("click", function () {
        context.resume();
        // audio[0].play();
      });
    }
  }

  // save player time/ player state
  handleSaveState(player, saveState, key) {
    if (saveState) {
      const state = localStorage.getItem(key);
      if (state) {
        player.on("ready", () => {
          const { currentTime } = JSON.parse(state);
          setTimeout(() => {
            player.currentTime = currentTime;
          }, 100);
        });
      }
      player.on("timeupdate", function () {
        localStorage.setItem(key, JSON.stringify({ currentTime: player.currentTime, playing: player.playing }));
      });
    }
  }
}

export default H5AP;
