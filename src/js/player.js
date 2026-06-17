import "./../css/player.scss";
import H5AP from "./player/single";
const H5AP_Obj = new H5AP();

(function ($) {
  $(document).ready(function () {
    // if script not exists or extract
    const mainScript = document.getElementById("h5ap-player-js");
    if (!mainScript && typeof h5apPlayer !== "undefined") {
      const ioScript = document.createElement("script");
      ioScript.src = window?.h5apPlayer?.plyrio_js || false;
      ioScript.src && document.getElementsByTagName("head")[0].appendChild(ioScript);
      ioScript.id = "bplugins-plyrio-js";

      var script = document.createElement("script");
      script.src = window?.h5apPlayer?.plyr_js || false;
      script.id = "h5ap-player-js";
      script.src && document.getElementsByTagName("head")[0].appendChild(script);
    }

    /**
     * for single video
     */
    const h5apAudios = document.querySelectorAll(".h5ap_standard_player");

    Object.keys(h5apAudios).map((item) => {
      const audioPlayer = $(h5apAudios[item])[0];
      let options = audioPlayer.dataset.options;
      try {
        options = options == "{" ? {} : JSON.parse(options);
      } catch (error) {
        options = {};
      }

      // console.log(options);
      options.poster = options.poster ?? audioPlayer.dataset?.poster;
      options.source = options.source ?? audioPlayer.dataset?.song;
      options.skin = options.skin ?? audioPlayer.dataset?.skin;
      options.title = options.title ?? audioPlayer.dataset?.title;

      //remove attribute
      audioPlayer.removeAttribute("data-options");
      audioPlayer.removeAttribute("data-song");

      const initPlayer = () => {
        if (options) H5AP_Obj.audioPlayer(audioPlayer, options);
      };

      const isLazyLoad = options.lazy_load !== undefined ? (options.lazy_load === true || options.lazy_load === "1" || options.lazy_load === 1) : (window.h5apPlayer?.lazyLoad === true);

      if (isLazyLoad && typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initPlayer();
              observer.unobserve(audioPlayer);
            }
          });
        }, { rootMargin: '200px' });
        observer.observe(audioPlayer);
      } else {
        initPlayer();
      }
    });

    H5AP_Obj.stickyPlayer2($(".h5ap_sticky_player"));

    /**
     * for playlist
     */

    /**
     * for quick Player
     */
    const quickPlayers = document.querySelectorAll(".h5ap_quick_player");
    Object.keys(quickPlayers).map((item) => {
      const quickPlayer = $(quickPlayers[item]);
      H5AP_Obj.quickPlayer(quickPlayer);
    });

    // Single Play button
  });

  /**
   * This is for Elementor
   */
  $(window).on("elementor/frontend/init", function () {
    //this is for Stamp Auudio Player
    elementorFrontend.hooks.addAction("frontend/element_ready/StampAudioPlayer.default", function (scope, $) {
      const players = $(scope).find(".stampAudioPlayer");
      players.map((index, item) => {
        item = $(players[index]);
        let options = $(item).data("option");
        options.source = options.source ?? $(item).data("song");
        options.poster = options.poster ?? $(item).data("poster");
        H5AP_Obj.audioPlayer(item[0], options);
      });
    });

    // this is form fusion player
    elementorFrontend.hooks.addAction("frontend/element_ready/FusionAudioPlayer.default", function (scope, $) {
      const players = $(scope).find(".h5ap_fusion_player");
      players.map((index, item) => {
        item = $(players[index]);
        const options = $(item).data("option");
        options.source = options.source ?? $(item).data("song");
        options.poster = options.poster ?? $(item).data("poster");
        H5AP_Obj.audioPlayer(item[0], options);
      });
    });

    //This is for simple audio player
    elementorFrontend.hooks.addAction("frontend/element_ready/SimpleAudioPlayer.default", function (scope, $) {
      const players = $(scope).find(".h5ap_standard_player");
      // window.players = players;
      players.map((index, item) => {
        item = $(players[index]);
        const options = $(item).data("options") || {};
        $(item).removeAttr("data-options");
        options.source = options?.source ?? $(item).data("song");
        options.poster = options?.poster ?? $(item).data("poster");
        H5AP_Obj.audioPlayer(item[0], options);
      });
    });
  });
})(jQuery);
