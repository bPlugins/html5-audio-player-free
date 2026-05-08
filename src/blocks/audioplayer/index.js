
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./Backend/Edit";
import "./../../css/editor.scss";


registerBlockType(metadata, {
  edit: Edit,
  save: () => null,
  getEditWrapperProps: () => {
    return {
      // className: "h5ap-block-wrapper",
    };
  },
});
