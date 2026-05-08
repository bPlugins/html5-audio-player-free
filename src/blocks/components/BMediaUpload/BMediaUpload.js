import "./style.scss";
const { Fragment } = wp.element;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { Button, PanelRow, TextControl } = wp.components;
function BMediaUpload({ value, label, type = [], onSelect, placeholder }) {
  return (
    <Fragment>
      {/* {label && <label>{label}</label>} */}
      <div className="bMediaUpload">
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={type}
            onSelect={(image) => onSelect(image.url)}
            render={({ open }) => <Button className="button button-primary" onClick={open} icon={"upload"}></Button>}
          />
        </MediaUploadCheck>
        <PanelRow className="width-100">
          <TextControl label={label} id="picker_field" value={value} onChange={(fileUrl) => onSelect(fileUrl)} placeholder={placeholder || label} />
        </PanelRow>
      </div>
    </Fragment>
  );
}

export default BMediaUpload;
