import { __ } from '@wordpress/i18n';
import { Button, PanelRow } from '@wordpress/components';
import { ColorControl } from '../../../../../bpl-tools/Components';

// Colors of the transcript lines only (not the box). Same keys and CSS variables as Transcript::color_options() in PHP.
// A color that is not set keeps the default look.
const COLORS = [
  { key: 'text', cssVar: '--h5ap-tr-line-color', label: __('Text', 'html5-audio-player') },
  { key: 'bg', cssVar: '--h5ap-tr-line-bg', label: __('Background', 'html5-audio-player') },
  { key: 'hover_text', cssVar: '--h5ap-tr-hover-color', label: __('Hover Text', 'html5-audio-player') },
  { key: 'hover', cssVar: '--h5ap-tr-hover', label: __('Hover Background', 'html5-audio-player') },
  { key: 'active', cssVar: '--h5ap-tr-active', label: __('Playing Line', 'html5-audio-player') },
];

const colorsOf = (attributes) => (attributes.transcriptColors && typeof attributes.transcriptColors === 'object' ? attributes.transcriptColors : {});

/**
 * Style values for the editor preview, for example { '--h5ap-tr-line-bg': '#fff' }.
 */
export const transcriptColorVars = (attributes) => {
  const colors = colorsOf(attributes);
  const style = COLORS.reduce((vars, { key, cssVar }) => (colors[key] ? { ...vars, [cssVar]: colors[key] } : vars), {});
  // With a line background, a small gap keeps the lines apart (same as the front end).
  return colors.bg ? { ...style, '--h5ap-tr-line-gap': '6px' } : style;
};

/**
 * Color pickers for the transcript lines (Style tab).
 */
const TranscriptColors = ({ attributes, setAttributes }) => {
  const colors = colorsOf(attributes);
  const setColor = (key, value) => {
    const next = { ...colors };
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
    setAttributes({ transcriptColors: next });
  };

  return (
    <>
      {COLORS.map(({ key, label }) => (
        <ColorControl key={key} label={label} value={colors[key] || ''} onChange={(value) => setColor(key, value)} />
      ))}
      {Object.keys(colors).length > 0 && (
        <PanelRow>
          <Button variant="secondary" size="small" onClick={() => setAttributes({ transcriptColors: {} })}>
            {__('Reset colors', 'html5-audio-player')}
          </Button>
        </PanelRow>
      )}
    </>
  );
};

export default TranscriptColors;
