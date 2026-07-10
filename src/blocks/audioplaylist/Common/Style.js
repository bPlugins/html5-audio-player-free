
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
    #${id} .plyr__controls {
      background: ${bgColor};
      border-radius:${radius}
    }
      
    #${id} [data-plyr="playlist-title"] {
      color: ${textColor || '#fff'} !important;
    }

    #${id} .skin_default .plyr__control,
    #${id} .plyr__time{
      color: red;
    }
    #${id} .plyr{
      --theme-skin-wave-color: ${primaryColor};
      --plyr-color-main: ${primaryColor};
      color: ${textColor};
    } 
    #${id}.skin_default .plyr__control:hover {
      background: ${hoverColor}
    }
    #${id} .plyr__controls__item input {
      color: ${hoverColor}
    }
    #${id} .plyr .ring-amber-500 {
      --tw-ring-color:${primaryColor};
    }
    
    #${id} .plyr-wrapper {
      background-color: ${bgColor}
    }

      
    `;

    setCSS(CSS);
  }, [width, bgColor, radius, id, hoverColor, primaryColor, alignment, primaryColor, textColor]);

  return <style>{CSS}</style>;
};

export default Style;
