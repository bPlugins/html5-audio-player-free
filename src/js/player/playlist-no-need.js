import blueSkin from "../skins/blue";

class BAudioPlaylist {
  constructor() {
    this.shuffle = false;
    this.repeat = false;
    this.currentIndex = 0;
    this.player = null;
  }
  /**
   *
   * @param {*} selector
   * @param {*} songs
   */
  audioPlylist(playlist, gutenberg = false) {
    const thisClass = this;
    const $ = jQuery;
    const songs = $(playlist).find(".h5ap_playlist ul li");
    const options = $(playlist).data("options");
    const totalSongs = songs.length - 1;
    let active = 0;
    const { initialVolume, controls = ["play", "progress", "current-time", "mute", "volume", "settings"], change_audio } = options;

    let i18n = {};
    if (typeof h5ap_i18n != "undefined") {
      i18n = h5ap_i18n;
    }
    const player = new Plyr($(playlist).find("audio"), {
      i18n,
      speed: { selected: 1, options: h5apPlayer?.speed.map(Number) },
      controls,
      listeners: {
        fastForward: (e) => {
          if (change_audio) {
            if (active < totalSongs) {
              this.setSource(player, active + 1, songs[active + 1], songs, true, false);
              active += 1;
            }
            return false;
          }
        },
        rewind: (e) => {
          if (change_audio) {
            if (active > 0) {
              this.setSource(player, active - 1, songs[active - 1], songs, true, false);
              active -= 1;
            }
            return false;
          }
        },
      },
    });

    //set Source for first song
    this.setSource(player, 0, songs?.[0], songs);
    //set intial volume
    player.volume = initialVolume / 100;

    player.on("ended", () => {
      if (active < totalSongs) {
        this.setSource(player, active + 1, songs[active + 1], songs, true, false);
        active += 1;
      }
    });

    // play song on click
    if (!gutenberg) {
      songs.each((index) => {
        const song = $(songs[index]);
        song.on("click", () => {
          if (index !== active) {
            active = index;
            this.setSource(player, index, songs[index], songs, !gutenberg);
          } else {
            this.setSource(player, index, songs[index], songs, false, true);
          }
        });
      });
    } else {
      $(playlist).on("click", "ul li", function () {
        const index = $(this).attr("index");
        if (index !== active) {
          active = index;
          thisClass.setSource(player, index, this, songs, !gutenberg);
        } else {
          thisClass.setSource(player, index, this, songs, false, true);
        }
      });
    }

    //disable other player on play this audio
    $(playlist)
      .find('.plyr__control[data-plyr="play"]')
      .on("click", () => {
        if (player.playing) {
          this.disableOtherPlayer(player);
        }
      });
  }

  /**
   *
   * @param {*} player
   * @param {*} songId
   * @param {*} song
   * @param {*} songs
   * @param {*} play
   * @param {Boolean} active true
   */
  setSource(player, songId, song, songs, play = false, active = false, shuffle = false, repeat = false) {
    const $ = jQuery;
    songs.each(function () {
      $(this).removeClass("active playing");
    });
    $(song).addClass("active");
    let audioSrc = $(song).data("song");
    if (!audioSrc) {
      audioSrc = $(song).attr("data-song");
    }

    if (!active) {
      player.source = {
        type: "audio",
        sources: [
          {
            src: audioSrc,
            type: "audio/mp3",
          },
        ],
      };
      $(".main-controls .dashicons-randomize").attr("active", shuffle);
      $(".main-controls .dashicons-controls-repeat").attr("active", repeat);
      if (play) {
        this.disableOtherPlayer(player);
        $(song).addClass("playing");
      }
    } else {
      if (player.playing) {
        $(song).removeClass("playing");
        this.disableOtherPlayer(player, false);
      } else {
        $(song).addClass("playing");
        this.disableOtherPlayer(player, true);
      }
    }
  }

  /**
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
   * @param {*} playlist
   */
  bluePlaylist(playlist, gutenberg = false) {
    const controls = blueSkin();

    const $ = jQuery;
    const thisClass = this;
    const songs = $(playlist).find(".right .hsong-item");
    const options = $(playlist).data("options");
    const totalSongs = songs.length - 1;
    let active = 0;
    const { initialVolume = 50, change_audio } = options || {};

    //set duration to song list
    songs.map((index, item) => {
      const songSrc = $(item).data("song");
      const audio = document.createElement("audio");
      audio.src = songSrc;

      const updateDuration = () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) {
          $(item).find(".time").text(this.toHHMMSS(audio.duration));
        }
      };

      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("durationchange", updateDuration);
    });

    // get translation word from localize script
    let i18n = {};
    if (typeof h5ap_i18n != "undefined") {
      i18n = h5ap_i18n;
    }

    //initialize player
    const player = new Plyr($(playlist).find("audio")[0], {
      controls,
      i18n,
      speed: { selected: 1, options: h5apPlayer?.speed.map(Number) },
      listeners: {
        fastForward: (e) => {
          if (change_audio) {
            if (active < totalSongs) {
              this.setSource(player, active + 1, songs[active + 1], songs, true, false);
              active += 1;
            }
            return false;
          }
        },
        rewind: (e) => {
          if (change_audio) {
            if (active > 0) {
              this.setSource(player, active - 1, songs[active - 1], songs, true, false);
              active -= 1;
            }
            return false;
          }
        },
      },
    });

    //set intial volume
    // console.log({ player }, initialVolume / 100);
    // if (player && initialVolume) {
    //   player.volume = initialVolume / 100;
    // }

    // setSource for first song
    this.setSource(player, 0, songs?.[0], songs);

    // set first song metadata
    this.setMetaData(playlist, $(playlist).find(".right .hsong-item")[0]);

    // enable/disbale shuffle/repeat
    $(document).on("click", ".main-controls .dashicons", function () {
      $(this).attr("active", $(this).attr("active") === "true" ? "false" : "true");
    });

    // play next audio on audio ended
    player.on("ended", () => {
      const shuffle = $(playlist).find(".main-controls .dashicons-randomize").attr("active");
      const repeat = $(playlist).find(".main-controls .dashicons-controls-repeat").attr("active");
      let shuffleActive = this.getRandomInt(totalSongs);

      if (active < totalSongs) {
        // shuffle song
        if (shuffle === "true") {
          if (shuffleActive == active) {
            shuffleActive = this.getRandomInt(totalSongs);
          }
          active = shuffleActive;
          this.setSource(player, active + 1, songs[shuffleActive], songs, true, false, shuffle, repeat);
          this.setMetaData(playlist, songs[shuffleActive]);
        } else {
          this.setSource(player, active + 1, songs[active + 1], songs, true, false, shuffle, repeat);
          this.setMetaData(playlist, songs[active + 1]);
          active += 1;
        }
      } else {
        if (repeat === "true") {
          this.setSource(player, active + 1, songs[0], songs, true, false, shuffle, repeat);
          active = 0;
          this.setMetaData(playlist, songs[0]);
        }
      }
    });

    if (!gutenberg) {
      // play song on click
      songs.each((index, item) => {
        const song = $(songs[index]);
        song.on("click", () => {
          const shuffle = $(playlist).find(".main-controls .dashicons-randomize").attr("active");
          const repeat = $(playlist).find(".main-controls .dashicons-controls-repeat").attr("active");
          if (index !== active) {
            active = index;
            this.setSource(player, index, songs[index], songs, !gutenberg, false, shuffle, repeat);
          } else {
            this.setSource(player, index, songs[index], songs, false, true);
          }

          this.setMetaData(playlist, item);
        });
      });
    } else {
      $(playlist).on("click", ".hsong-item", function () {
        const shuffle = $(playlist).find(".main-controls .dashicons-randomize").attr("active");
        const repeat = $(playlist).find(".main-controls .dashicons-controls-repeat").attr("active");
        const index = $(this).attr("index");
        if (index !== active) {
          active = index;
          thisClass.setSource(player, index, this, songs, false, false, shuffle, repeat);
        } else {
          thisClass.setSource(player, index, this, songs, false, false);
        }

        thisClass.setMetaData(playlist, this);
      });
    }

    //disable other player on play this audio
    $(playlist)
      .find('.plyr__control[data-plyr="play"]')
      .on("click", () => {
        if (player.playing) {
          this.disableOtherPlayer(player);
        }
      });
  }

  setMetaData(playlist, selector) {
    const $ = jQuery;
    const title = $(selector).find("h3.title").text();
    const artist = $(selector).find("span.singer").text();
    let poster = $(selector).attr("data-poster");

    if (poster) $(playlist).find(".poster").attr("src", poster);
    $(playlist).find(".left .plyr__meta h2.title").text(title);
    $(playlist).find(".left .plyr__meta h3.artist").text(artist);
  }

  /**
   *
   * @param {*} time
   * @returns
   */
  toHHMMSS(time) {
    if (isNaN(time) || time === Infinity) {
      return "00:00";
    }
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}

export default BAudioPlaylist;
