import getRandomNumber from "../../../utils/getRandomNumber";
import toHHMMSS from "../../../utils/toHHMMSS";
import jsonParse from "../../../wp-utils/v1/jsonParse";

class BAudioPlaylist {
  constructor(dom, options = {}, items = []) {
    this.shuffle = false;
    this.repeat = false;
    this.currentIndex = 0;
    this.player = null;
    this.isAdmin = options?.isAdmin;
    this.prevIndex = null;
    return this.playlist(dom, options, items);
  }

  playlist(dom, options = {}, items = []) {
    if (!dom) return null;
    const audioTag = dom?.tagName === "AUDIO" ? dom : dom.querySelector("audio");

    const player = new Plyr(audioTag, options);
    this.player = player;
    const infos = dom?.dataset?.infos ? jsonParse(dom.dataset.infos) || {} : {};

    // elements
    const play2 = dom.querySelector("[data-plyr=play2]");
    const artistEl = dom.querySelector("[data-plyr=artist]");
    const titleEl = dom.querySelector("[data-plyr=title]");
    const prevEl = dom.querySelector("[data-plyr=prev]");
    const nextEl = dom.querySelector("[data-plyr=next]");
    const shuffleEl = dom.querySelector("[data-plyr=shuffle]");
    const repeatEl = dom.querySelector("[data-plyr=repeat]");
    const itemsEl = dom.querySelectorAll("[data-audio-item]");
    const coverEl = dom.querySelector("[data-plyr=cover]");

    repeatEl?.addEventListener("click", (e) => {
      this.handleFeature(e);
    });
    shuffleEl?.addEventListener("click", (e) => this.handleFeature(e));

    if (!items.length) {
      itemsEl.forEach((item) =>
        items.push({
          source: item.dataset?.audioSource,
          title: item.querySelector(".title")?.innerText || item.dataset?.title,
          artist: item.querySelector(".artist, .singer")?.innerText || item.dataset?.artist,
          poster: coverEl?.getAttribute("src") || item.dataset?.poster,
        })
      );
    }

    if (!items.length) {
      return false;
    }

    player.on("ready", () => {
      if (!this.isAdmin) {
        this.dispatchEvent(this.currentIndex, false);
      }
    });

    // pause other player if playing and multiple off
    if (!window.h5apPlayer?.multipleAudio) {
      player.on("play", () => {
        const players = document.querySelectorAll("audio");
        players.forEach((item) => {
          if (!item.isEqualNode(audioTag)) {
            item.pause();
          }
        });
      });
    }

    window.player = player;
    window.dom = dom;

    itemsEl.forEach((item, index) => {
      const audio = document.createElement("audio");
      if (items[index]?.source) {
        audio.src = items[index]?.source;

        const updateDuration = () => {
          if (item.querySelector(".duration") && !isNaN(audio.duration) && audio.duration !== Infinity) {
            item.querySelector(".duration").innerText = toHHMMSS(audio.duration);
          }
        };

        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("durationchange", updateDuration);
      }
      item.addEventListener("click", () => {


        window.player = player;
        if (this.currentIndex === index) {
          if (player.playing) {
            player.pause();
          } else {
            player.play();
          }
        } else {
          this.prevIndex = index > 0 ? index - 1 : items.length - 1;
          this.currentIndex = index;
          this.dispatchEvent(this.currentIndex);
        }
      });
    });

    // update audio
    player.on("updateTrack", ({ detail }) => {
      // player.pause();
      const { title, artist, source, poster } = items[detail?.index];

      if (this.prevIndex === detail.index && player.playing) {
        player.pause();
      } else {
        // update src
        if (coverEl && poster) coverEl.src = poster;
        if (audioTag) audioTag.src = source;
        if (titleEl && typeof title !== "undefined") titleEl.innerText = title;
        if (artistEl && typeof artist !== "undefined") artistEl.innerText = artist;
        if (detail.play) {
          player.play();
        }
      }

      // remove active class from all item
      itemsEl.forEach((item) => {
        item.classList.remove("item-active");
        item.classList.remove("item-playing");
      });

      // add active class on current item
      itemsEl[detail?.index].classList.add("item-active");
    });

    player.on("ended", () => {
      if (this.repeat) {
        this.dispatchEvent(this.currentIndex);
      } else {
        if (infos?.autoplayNextTrack) {
          this.prevIndex = this.currentIndex;
          if (this.shuffle) {
            this.currentIndex = getRandomNumber(items.length, this.currentIndex);
            this.dispatchEvent(this.currentIndex);
          } else {
            this.currentIndex = items.length > this.currentIndex + 1 ? this.currentIndex + 1 : 0;
            this.dispatchEvent(this.currentIndex);
          }
        }
      }
    });

    // handle progress ber
    const progressEl = dom.querySelector(".song-played-progress");
    progressEl?.addEventListener("click", function (e) {
      if (player.duration && !isNaN(player.duration) && player.duration !== Infinity) {
        const position = player.duration / progressEl.offsetWidth;
        player.currentTime = e.offsetX * position;
      }
    });

    player.on("timeupdate", function () {
      if (player.duration && !isNaN(player.duration) && player.duration !== Infinity) {
        progressEl?.setAttribute("value", (100 / player.duration) * player.currentTime);
      }
    });

    // handle second play button
    play2?.addEventListener("click", function () {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    });
    player.on("play", () => {
      play2?.classList.add("playing");
      play2?.classList.remove("paused");
      itemsEl[this.currentIndex]?.classList.add("item-playing");
    });
    player.on("pause", () => {
      play2?.classList.add("paused");
      play2?.classList.remove("playing");
      itemsEl[this.currentIndex]?.classList.remove("item-playing");
    });

    // handle next track button
    nextEl?.addEventListener("click", () => {
      const nextIndex = items.length > this.currentIndex + 1 ? this.currentIndex + 1 : 0;
      this.prevIndex = this.currentIndex;
      this.currentIndex = nextIndex;
      this.dispatchEvent(nextIndex);
    });

    // handle prev track button
    prevEl?.addEventListener("click", () => {
      const prevIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.currentIndex;
      if (this.currentIndex !== prevIndex) {
        this.prevIndex = this.currentIndex;
        this.currentIndex = prevIndex;
      }
      this.dispatchEvent(prevIndex);
    });

    return player;
  }

  /**
   * handle repeat/shuffle feature
   * @param {event} e
   */
  handleFeature(e) {
    const active = e.target?.dataset.active || "false";
    if (active !== "false") {
      e.target.dataset.active = false;
      this[e.target?.dataset?.plyr] = false;
    } else {
      e.target.dataset.active = true;
      this[e.target?.dataset?.plyr] = true;
    }
    window.event = e;
  }

  /**
   * Dispatch updateTrack event
   * @param {*} index
   */
  dispatchEvent(index, play = true) {
    const event = new CustomEvent("updateTrack", { detail: { index, play } });
    this.player?.elements?.container?.dispatchEvent(event);
  }
}

export default BAudioPlaylist;
