import { __ } from '@wordpress/i18n';
import { formatTime } from '../../../utils/transcript';
import '../../../css/transcript.scss';

/**
 * Editor-only preview for the playlist blocks: the transcript of the first track that has one.
 * Same markup and classes as Transcript::render(), so it looks like the front end (where the box follows the playing track).
 */
const PlaylistTranscriptPreview = ({ attributes }) => {
  const { audios = [], showTranscript, sourceType, transcriptSearch, alignment = 'left', width, transcriptRadius = 0 } = attributes;
  if (!showTranscript || sourceType === 'podcast' || !Array.isArray(audios)) {
    return null;
  }
  const track = audios.find((item) => Array.isArray(item?.transcript) && item.transcript.length);
  if (!track) {
    return null;
  }
  const boxWidth = typeof width === 'string' ? width : (width?.number && width?.unit ? `${width.number}${width.unit}` : undefined);

  return (
    <details className={`h5ap-transcript h5ap-transcript--${alignment}`} open style={{ width: boxWidth, '--h5ap-tr-radius': `${transcriptRadius}px` }}>
      <summary className="h5ap-transcript__summary">
        {__('Transcript', 'html5-audio-player')}
        {track.title && <> <span className="h5ap-transcript__track">{track.title}</span></>}
      </summary>
      {transcriptSearch !== false && (
        <div className="h5ap-transcript__search">
          <input type="search" className="h5ap-transcript__input" placeholder={__('Search in audio', 'html5-audio-player')} disabled />
        </div>
      )}
      <ol className="h5ap-transcript__lines">
        {track.transcript.map((cue, index) => (
          <li className="h5ap-transcript__line" key={index}>
            <span className="h5ap-transcript__time">{formatTime(cue.start)}</span>
            <span className="h5ap-transcript__text">{cue.text}</span>
          </li>
        ))}
      </ol>
    </details>
  );
};

export default PlaylistTranscriptPreview;
