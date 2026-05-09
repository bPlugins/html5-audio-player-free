import { useState, useEffect } from 'react';

const Style = ({ attributes, id }) => {
  const { primaryColor, hoverColor, bgColor, controlColor, radius, width, align, alignment, textColor } = attributes;
  const [CSS, setCSS] = useState();

  useEffect(() => {
    const CSS = `
    #${id}{
      display: flex;
      justify-content: ${alignment};
    }
    #${id} .plyr__progress input{
      color: ${controlColor};
    }
    #${id} .plyr__controls__item.plyr__volume input{
      color: ${controlColor};
    }
    #${id} .plyr{
      --plyr-color-main: ${primaryColor};
      --plyr-color-bg: black;
      --theme-skin-wave-color: ${controlColor};
      --plyr-color-text: ${textColor};
      --plyr-color-control: ${controlColor};
      --plyr-color-background: black;
    }
    #${id} .h5ap_standard_player,#${id} .h5ap-sticky,#${id} .h5ap_skin
     {
      width: ${width};
    }
   
    #${id} .skin_fusion,#${id} .h5ap-sticky,#${id} .skin_wave,#${id} .skin_stamp
     {
      min-width: 500px;
      max-width: 100% !important;
    }
    @media only screen and (max-width: 767px) {
      #${id} .skin_fusion, #${id} .h5ap-sticky,#${id} .skin_wave,#${id} .skin_stamp
      {
        min-width: auto;
        max-width: 100% !important;
      }
      #${id} .h5ap-sticky,
      #${id} .skin_fusion .plyr,
      #${id} .skin_wave .plyr,
      #${id} .skin_stamp .plyr
      {
        min-width: auto;
        max-width: 100%;
      }
    }
    #${id} .plyr__controls {
      --plyr-audio-control-color: ${controlColor};
      background: ${bgColor || '#eaeaea'};
      border-radius:${radius}
    }
    #${id} .radius{
      border-radius: ${radius}
    }
    #${id} .skin_default .plyr__control,#${id}{
      --theme-skin-wave-color: ${primaryColor};
    }
    #${id} .skin_simple_sticky{
      background: ${bgColor};
    }
    `.replace(/\s+/g, " ").trim();

    setCSS(CSS);

  }, [width, bgColor, radius, id, hoverColor, primaryColor, align, controlColor, alignment, textColor]);

  return <style>{CSS}</style>;
};

export default Style;
