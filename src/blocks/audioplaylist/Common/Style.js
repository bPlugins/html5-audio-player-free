import { useEffect, useState } from 'react';

const Style = ({ attributes, id }) => {
  const { primaryColor, hoverColor, textColor, bgColor, radius, width, alignment } = attributes;
  const [CSS, setCSS] = useState("");

  useEffect(() => {
    const mainColor = primaryColor || '#00b2ff';
    const CSS = `#${id}{
      --theme-skin-wave-color: ${mainColor};
      --plyr-color-main: ${mainColor};
      display: flex;
      justify-content:${alignment || 'left'};
      width: 100%;
    }
    #${id} .plyr, 
    #${id} .h5ap_playlist,
    #${id} .skin_playlist1,
    #${id} .flat-black-player-container{ 
      width: ${width || '100%'};
      max-width: 100%;
      box-sizing: border-box;
    }
    #${id} .skin_playlist1 {
      --theme-skin-wave-color: ${mainColor};
      --plyr-color-main: ${mainColor};
      background-color: ${bgColor || '#18181b'} !important;
      border-radius: ${radius || '16px'} !important;
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} .plyr,
    #${id} .plyr-wrapper,
    #${id} .plyr__controls {
      background: transparent !important;
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} .plyr {
      --theme-skin-wave-color: ${mainColor};
      --plyr-color-main: ${mainColor};
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} [data-plyr="playlist-title"] {
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} [data-plyr="playlist-artist"] {
      color: ${textColor ? textColor : 'rgba(255,255,255,0.7)'} !important;
    }
    #${id} .podcast-date {
      color: ${textColor ? textColor : 'rgba(255,255,255,0.6)'} !important;
    }
    #${id} .podcast-desc-text {
      color: ${textColor ? textColor : 'rgba(255,255,255,0.75)'} !important;
    }
    #${id} .plyr__time {
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} .plyr__control {
      color: ${textColor || '#ffffff'} !important;
    }
    #${id} .h5ap-load-more-btn {
      background-color: ${mainColor} !important;
    }
    #${id} .h5ap-pagination-btn.is-active,
    #${id} .h5ap-pagination-num.is-active,
    #${id} .h5ap-pagination-btn:hover:not(:disabled),
    #${id} .h5ap-pagination-num:hover:not(:disabled) {
      background-color: ${mainColor} !important;
      border-color: ${mainColor} !important;
    }
    #${id} .h5ap-podcast-search-input:focus {
      border-color: ${mainColor} !important;
    }
    #${id} .h5ap-show-more-btn {
      color: ${mainColor} !important;
    }
    #${id} .h5ap-subscribe-btn {
      background-color: ${mainColor} !important;
      color: #ffffff !important;
    }
    #${id} input[type=range],
    #${id} .plyr__progress input[type=range],
    #${id} input[type=range][data-plyr="seek"],
    #${id} .plyr--full-ui input[type=range] {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    #${id} input[type=range]:focus,
    #${id} input[type=range]:focus-visible,
    #${id} input[type=range]:active {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    `;

    setCSS(CSS);
  }, [width, bgColor, radius, id, hoverColor, primaryColor, alignment, textColor]);

  return <style>{CSS}</style>;
};

export default Style;
