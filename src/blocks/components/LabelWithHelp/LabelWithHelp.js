import { Tooltip } from '@wordpress/components';
import './LabelWithHelp.scss';

/**
 * Control label with a "?" that shows the help text on hover or keyboard focus,
 * instead of a help line under the control. Clicking the "?" does not change the control.
 */
const LabelWithHelp = ({ label, help }) => (
  <span className="h5ap-label-help">
    {label}
    <Tooltip text={help} placement="top" className="h5ap-label-help__tip">
      <span className="h5ap-label-help__icon" tabIndex={0} role="img" aria-label={typeof help === 'string' ? help : undefined} onClick={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 15.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm1.3-5.1c-.6.3-.8.6-.8 1.1v.4h-2v-.5c0-1.3.6-2.1 1.7-2.6.7-.3 1-.7 1-1.3 0-.7-.6-1.2-1.3-1.2-.8 0-1.3.5-1.4 1.3H8.6C8.7 7.8 10.1 6.5 12 6.5c1.9 0 3.3 1.2 3.3 2.9 0 1.3-.7 2.3-2 3z" /></svg>
      </span>
    </Tooltip>
  </span>
);

export default LabelWithHelp;
