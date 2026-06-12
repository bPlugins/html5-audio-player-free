const { registerBlockType } = wp.blocks;
// import "./style.scss";
import "./../../css/editor.scss";

import Edit from "./Backend/Edit";
// import Save from "./Save";

import metadata from "./block.json";

registerBlockType(metadata, {
  edit: Edit,
  save: () => null,
  getEditWrapperProps: () => {
    return {
      className: "h5ap-playlist-block-wrapper h5ap-block-wrapper",
    };
  },
});
