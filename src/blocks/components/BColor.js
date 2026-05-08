const { useState, Fragment } = wp.element;
const { Dropdown, ColorPicker, Button, PanelRow } = wp.components;
// import styles from "./styles.module.scss";

/**
 *
 * @props
 * value: (String) --required
 * defaultColor: (String)
 * onChange: (Function) required
 * className: (String)
 * disableAlpha: (Boolean)
 * @boxPosition: 'top left' (String)
 *
 * return rgba color code
 */
const BColor = (props) => {
  const { value, title = "", label, defaultColor, onChange, disableAlpha, boxPosition = "top left", globalColors = [], className } = props;
  const [state, setState] = useState(value);
  return (
    <>
      <PanelRow className={className}>
        <label htmlFor="" className="label">
          {label}
        </label>
        <Dropdown
          position={boxPosition}
          renderToggle={({ isOpen, onToggle }) => {
            return (
              <div style={{ display: "flex" }}>
                {defaultColor && defaultColor != state && (
                  <Button
                    icon="image-rotate"
                    className={"bColorReset"}
                    onClick={() => {
                      onChange(defaultColor);
                      setState(defaultColor);
                    }}
                  />
                )}
                <div className={"BColorButtonContainer"}>
                  <button
                    className={"BColorButton"}
                    title={title}
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    style={value ? { backgroundColor: value } : { backgroundColor: "transparent" }}
                  />
                </div>
              </div>
            );
          }}
          renderContent={({ isOpen, onClose }) => (
            <Fragment>
              <ColorPicker
                color={value || ""}
                onChangeComplete={(c) => {
                  onChange(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`);
                  setState(c.hex);
                }}
                disableAlpha={disableAlpha ? disableAlpha : false}
              />
              {globalColors.length > 0 && (
                <div style={{ display: "flex" }} className="globalColors">
                  {globalColors.map((color) => {
                    return (
                      <div key={color} className={"BColorButtonContainer"}>
                        <button
                          className={"BColorButton"}
                          onClick={() => {
                            onChange(color.color);
                            setState(color);
                            onClose;
                          }}
                          aria-expanded={isOpen}
                          style={value ? { backgroundColor: color.color } : { backgroundColor: "transparent" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Fragment>
          )}
        />
      </PanelRow>
    </>
  );
};

export default BColor;
