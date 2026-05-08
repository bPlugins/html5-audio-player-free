import { useState, useEffect } from 'react';

import { getBorderCSS, getColorsCSS, getTypoCSS, isValidCSS } from './../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id }) => {
  const { primaryColor, styles, radius, width, align, alignment } = attributes;
  const [CSS, setCSS] = useState();
  const { playIcon, title, statusText, background, progressbarColor, iconColor, radioIconColor, 
    secondaryBackground, border, subtitle, track } = styles;
  
  useEffect(() => {
    const CSS = `
    ${getTypoCSS(``, title?.typography || {}).googleFontLink}
    ${getTypoCSS(`#${id} .title`, title?.typography || {}).styles}
    ${getTypoCSS(``, subtitle?.typography || {}).googleFontLink}
    ${getTypoCSS(`#${id} .subtitle`, subtitle?.typography || {}).styles}
    ${getTypoCSS(``, track?.typography || {}).googleFontLink}
    ${getTypoCSS(`#${id} [data-plyr=current-track]`, track?.typography || {}).styles}
    #${id}{
      display: flex;
      justify-content: ${alignment};
      --h5ap-radio-primary-color: ${primaryColor};
      --h5ap-radio-icon-color: ${radioIconColor};
      --h5ap-radio-progress-color: ${progressbarColor};
      --h5ap-radio-icons-color: ${iconColor};
    }
    #${id} .play-icon {
      ${getColorsCSS(playIcon)}
    }
    #${id} .status-text {
      ${getColorsCSS(statusText)}
    }

    #${id} .title, #${id} .subtitle  {
      color: ${title?.color}
    }
    
    #${id} [data-plyr=current-track] {
      ${isValidCSS('color', track?.color)}
    }
   
    #${id} .radio-wrapper{
      width: ${width};
    }
    #${id} .secondary-container {
      ${isValidCSS('background', secondaryBackground)}
    }
    
    #${id} .skin_container {
      ${isValidCSS('background', background)}
      ${getBorderCSS(border)}
    }
     
    #${id} .radius{
      border-radius: ${radius}
    }
    
    `.replace(/\s+/g, " ").trim();

    setCSS(CSS);

  }, [width, background, radius, id, secondaryBackground, primaryColor, align, alignment, radioIconColor, styles]);

  return <style>{CSS}</style>;
};

export default Style;
