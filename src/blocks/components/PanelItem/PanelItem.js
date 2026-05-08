import { TextControl } from "@wordpress/components";

import "./style.scss";

const PanelItem = (props) => {
  const { title, onChange, ...restProps } = props;
  return (
    <div className="panelItem">
      {/* <PanelRow> */}
      <TextControl value={title} onChange={(title) => onChange(title)} {...restProps} />
      {/* </PanelRow> */}
    </div>
  );
};

export default PanelItem;
