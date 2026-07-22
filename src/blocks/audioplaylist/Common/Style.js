import { useEffect, useState } from 'react';

const Style = ({ attributes, id }) => {
  const { primaryColor, hoverColor, textColor, bgColor, radius, width, alignment } = attributes;
  const [CSS, setCSS] = useState("");

  useEffect(() => {
    const CSS = `#${id}{
      display: flex;
      justify-content:${alignment};
    }
    #${id} .plyr, 
    #${id} .flat-black-player-container{ 
      width: ${width};
    }
    #${id} .skin_playlist1 {
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
      --theme-skin-wave-color: ${primaryColor || '#00b2ff'};
      --plyr-color-main: ${primaryColor || '#00b2ff'};
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
      background-color: ${primaryColor || '#00b2ff'} !important;
    }
    #${id} .h5ap-pagination-btn.is-active,
    #${id} .h5ap-pagination-num.is-active,
    #${id} .h5ap-pagination-btn:hover:not(:disabled),
    #${id} .h5ap-pagination-num:hover:not(:disabled) {
      background-color: ${primaryColor || '#00b2ff'} !important;
      border-color: ${primaryColor || '#00b2ff'} !important;
    }
    #${id} .h5ap-podcast-search-input:focus {
      border-color: ${primaryColor || '#00b2ff'} !important;
    }
    #${id} .h5ap-show-more-btn {
      color: ${primaryColor || '#00b2ff'} !important;
    }
    `;

    setCSS(CSS);
  }, [width, bgColor, radius, id, hoverColor, primaryColor, alignment, textColor]);

  return <style>{CSS}</style>;
};

export default Style;
