import { __ } from '@wordpress/i18n';
import { formatTime } from '../../../utils/transcript';

// Editor-only preview. It uses the same markup and classes as render.php so it looks the same as the front end.
const TranscriptPreview = ({ attributes }) => {
  const { transcript = [], transcriptSearch, alignment = 'left', width, transcriptRadius = 0 } = attributes;

  return (
    <details className={`h5ap-transcript h5ap-transcript--${alignment}`} open style={{ width: typeof width === 'string' ? width : undefined, '--h5ap-tr-radius': `${transcriptRadius}px` }}>
      <summary className="h5ap-transcript__summary">{__('Transcript', 'html5-audio-player')}</summary>
      {transcriptSearch !== false && (
        <div className="h5ap-transcript__search">
          <input type="search" className="h5ap-transcript__input" placeholder={__('Search in audio', 'html5-audio-player')} disabled />
        </div>
      )}
      <ol className="h5ap-transcript__lines">
        {transcript.map((cue, index) => (
          <li className="h5ap-transcript__line" key={index}>
            <span className="h5ap-transcript__time">{formatTime(cue.start)}</span>
            <span className="h5ap-transcript__text">{cue.text}</span>
          </li>
        ))}
      </ol>
    </details>
  );
};

export default TranscriptPreview;
