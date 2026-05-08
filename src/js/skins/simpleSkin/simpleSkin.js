import "./style.scss";
const simpleSkin = ({ audios = [], theme = "light", hideDownload = false }) => {
  return `<div class="${`audioPlaylist theme-${theme?.toLowerCase()}`}">
      <div class="h5ap_playlist">
        
      </div>
    </div>`;
};

export default simpleSkin;
