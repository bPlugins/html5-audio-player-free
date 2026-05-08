const { useState } = wp.element;
// import BDevice from "./../BDevice";
import BUnit from "./BUnit";
const { PanelRow, RangeControl, __experimentalNumberControl: NumberControl } = wp.components;
/**
 *
 * @props {String} label
 * @props {Object} enable: {eDevice = true, eUnit = true, eNumberControl = true}
 * @props {Object} value: {number = 10, device = 'desktop', unit = 'px'}
 * @props {Array} units: ['px', 'em', '%']
 * @props {Function} onChange
 * @returns {Object}
 *
 */
const BRangeControl = (props) => {
  const { label, enable = {}, value, onChange, units = ["px", "em", "%"], max: maxValue = 100, min = 0, finalMax = 0, unit = "px", onChangeUnit, step = 1 } = props;
  const { eUnit = true, eNumberControl = true } = enable;
  const [max, setMax] = useState(finalMax ? finalMax : maxValue);

  return (
    <div>
      {label && (
        <PanelRow>
          <label className="label">{label}</label>
          {/* {eDevice && <BDevice style={{ marginRight: "auto" }} device={device} onChange={(device) => onChangeDevice(device)} />} */}
          {eUnit && <BUnit units={units} value={unit} onChange={(unit) => onChangeUnit(unit)} />}
        </PanelRow>
      )}
      <PanelRow>
        <div style={eNumberControl ? { minWidth: "140px", marginRight: "15px" } : ""}>
          <RangeControl
            withInputField={false}
            value={value}
            min={min}
            step={step}
            max={unit == "vh" ? 100 : unit == "vw" ? 100 : unit == "rem" ? 10 : unit == "em" ? 10 : unit == "%" ? 100 : maxValue}
            onChange={(value) => {
              onChange(value);
            }}
          />
        </div>
        {eNumberControl && (
          <NumberControl
            step={step}
            isShiftStepEnabled={true}
            onChange={(value) => {
              onChange(parseInt(value));
              if (value > max) {
                setMax(value);
              }
            }}
            shiftStep={10}
            value={value}
            max={finalMax ? finalMax : unit == "px" ? 9999 : 100}
            min={min}
          />
        )}
      </PanelRow>
    </div>
  );
};

export default BRangeControl;
