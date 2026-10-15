import { __, _n, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { PanelBody, ToggleControl, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Notice } from '../../../../../bpl-tools/Components';
import NewBadge from '../NewBadge/NewBadge.js';
import LabelWithHelp from '../LabelWithHelp/LabelWithHelp.js';

const countTracks = (audios) => (Array.isArray(audios) ? audios : []).filter((track) => Array.isArray(track?.transcript) && track.transcript.length).length;

/**
 * Playlist blocks: the "Transcript" panel (Content tab). The text itself is added per track, in Tracks.
 */
const PlaylistTranscriptPanel = ({ attributes, setAttributes, isPremium }) => {
  const { audios = [], showTranscript, transcriptSearch, transcriptOpen, transcriptDownload } = attributes;
  const withText = countTracks(audios);
  const total = Array.isArray(audios) ? audios.length : 0;

  return (
    <PanelBody className="bPlPanelBody h5ap-transcript-panel" title={<>{__('Transcript', 'html5-audio-player')}<NewBadge /></>} initialOpen={withText > 0}>
      <ToggleControl
        __nextHasNoMarginBottom
        label={<LabelWithHelp label={__('Show transcript', 'html5-audio-player')} help={__('Shows the text of the track that is playing under the playlist. Visitors can read along, search it, and click a line to jump to that moment.', 'html5-audio-player')} />}
        checked={!!showTranscript}
        onChange={(value) => setAttributes({ showTranscript: value })}
      />

      <div className="h5ap-transcript-panel__section">
        <h3 className="h5ap-transcript-panel__title">{__('Transcript text', 'html5-audio-player')}</h3>
        <div className={`h5ap-transcript-panel__summary${withText ? ' is-ready' : ''}`}>
          {sprintf(
            /* translators: 1: tracks with a transcript, 2: all tracks */
            _n('%1$d of %2$d track has a transcript.', '%1$d of %2$d tracks have a transcript.', total, 'html5-audio-player'),
            withText,
            total
          )}
        </div>
        <p className="h5ap-transcript-panel__help">
          {__('Add the text of each track in Tracks: open a track and use its Transcript section.', 'html5-audio-player')}
        </p>
      </div>

      <div className="h5ap-transcript-panel__section">
        <h3 className="h5ap-transcript-panel__title">{__('Visitor options', 'html5-audio-player')}</h3>
        <div className="h5ap-transcript-panel__options">
          <ToggleControl
            __nextHasNoMarginBottom
            label={<LabelWithHelp label={__('Search box', 'html5-audio-player')} help={__('Let visitors search inside the transcript.', 'html5-audio-player')} />}
            checked={transcriptSearch !== false}
            onChange={(value) => setAttributes({ transcriptSearch: value })}
          />
          <ToggleControl
            __nextHasNoMarginBottom
            label={<LabelWithHelp label={__('Open by default', 'html5-audio-player')} help={__('Show the transcript expanded when the page loads.', 'html5-audio-player')} />}
            checked={transcriptOpen !== false}
            onChange={(value) => setAttributes({ transcriptOpen: value })}
          />
          {isPremium && (
            <ToggleControl
              __nextHasNoMarginBottom
              label={<LabelWithHelp label={__('Download button', 'html5-audio-player')} help={__('Let visitors download the transcript as .vtt or .txt.', 'html5-audio-player')} />}
              checked={!!transcriptDownload}
              onChange={(value) => setAttributes({ transcriptDownload: value })}
            />
          )}
        </div>
      </div>

      {!isPremium && (
        <Notice status='premium' isIcon={true} className="h5ap-transcript-panel__pro">
          {createInterpolateElement(
            __('Features like <ai>AI Transcript Generator</ai> and <dl>Transcript Download (.vtt / .txt)</dl> are available in the Pro version.', 'html5-audio-player'),
            { ai: <strong className="h5ap-transcript-panel__highlight" />, dl: <strong /> }
          )}
        </Notice>
      )}
    </PanelBody>
  );
};

/**
 * Style tab: corner radius of the transcript box (shown while the transcript is on).
 */
export const TranscriptStylePanel = ({ attributes, setAttributes }) => {
  if (!attributes.showTranscript) {
    return null;
  }
  return (
    <PanelBody className="bPlPanelBody" title={<>{__('Transcript', 'html5-audio-player')}<NewBadge /></>} initialOpen={true}>
      <PanelRow>
        <UnitControl
          label={<LabelWithHelp label={__('Radius', 'html5-audio-player')} help={__('Round the corners of the transcript box. 0 keeps them square.', 'html5-audio-player')} />}
          labelPosition="side"
          units={[{ value: 'px', label: 'px', default: 0 }]}
          min={0}
          max={40}
          value={`${attributes.transcriptRadius || 0}px`}
          onChange={(value) => setAttributes({ transcriptRadius: Math.max(0, Math.min(40, parseInt(value, 10) || 0)) })}
        />
      </PanelRow>
    </PanelBody>
  );
};

export default PlaylistTranscriptPanel;
