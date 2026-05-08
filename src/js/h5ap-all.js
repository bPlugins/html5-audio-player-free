document.addEventListener("DOMContentLoaded", () => {
  const mainScript = document.getElementById("bplugins-plyrio-js");

  const audios = document.querySelectorAll("audio:not(.h5ap_standard_player audio, .b_free, .h5ap_single_button audio)");

  if (!mainScript && audios?.length) {
    var stylesheet = document.createElement("link");
    stylesheet.href = window?.h5apAll?.plyrio_css || false;
    stylesheet.rel = "stylesheet";
    stylesheet.type = "text/css";
    stylesheet.id = "bplugins-plyrio-css";
    stylesheet.href && document.getElementsByTagName("head")[0].append(stylesheet);

    const ioScript = document.createElement("script");
    ioScript.type = "text/javascript";
    ioScript.id = "bplugins-plyrio-js";
    ioScript.src = window?.h5apAll?.plyrio_js || false;
    ioScript.src && document.getElementsByTagName("head")[0].append(ioScript);
  }

  const myInterval = setInterval(() => {
    if (typeof window.Plyr !== "undefined") {
      clearInterval(myInterval);

      const players = Plyr.setup(audios, window.h5apAll?.options);

      players?.forEach((player) => player.elements?.container?.classList?.add("h5ap_all"));
    }
  }, 100);
});
