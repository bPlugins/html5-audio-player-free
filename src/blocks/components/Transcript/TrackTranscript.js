import { __, _n, sprintf } from '@wordpress/i18n';
import { useState } from 'react';
import { FormFileUpload, Button, Notice as WPNotice, Modal, TextareaControl } from '@wordpress/components';
import { parseCaptions, parseTranscriptText, cuesToText, formatTime } from '../../../utils/transcript';
import NewBadge from '../NewBadge/NewBadge.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * Transcript of one playlist track (inside the track's settings). Saved with the track as cues: [{ start, end, text }].
 * The playlist's "Transcript" panel turns them on for visitors.
 */
const TrackTranscript = ({ transcript, source, onChange }) => {
  const cues = Array.isArray(transcript) ? transcript : [];
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState('');

  const onImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(__('This file is larger than 2 MB. Please choose a smaller SRT or VTT file.', 'html5-audio-player'));
      return;
    }
    const parsed = parseCaptions(await file.text());
    if (!parsed.length) {
      setError(__('No timed lines were found. Please choose a valid SRT or VTT file.', 'html5-audio-player'));
      return;
    }
    setError('');
    onChange(parsed);
  };

  const openEditor = () => {
    setDraft(cuesToText(cues));
    setDraftError('');
    setIsEditing(true);
  };

  const saveDraft = () => {
    if (!draft.trim()) {
      onChange([]);
      setIsEditing(false);
      return;
    }
    const parsed = parseTranscriptText(draft);
    if (!parsed.length) {
      setDraftError(__('No lines with a time were found. Start each line with its time, for example: 1:15 Welcome to the show.', 'html5-audio-player'));
      return;
    }
    onChange(parsed);
    setIsEditing(false);
  };

  const hasTranscript = cues.length > 0;
  const lastCue = cues[cues.length - 1];

  return (
    <div className="h5ap-transcript-panel h5ap-track-transcript">
      <div className="h5ap-transcript-panel__section">
        <h3 className="h5ap-transcript-panel__title">{__('Transcript', 'html5-audio-player')}<NewBadge /></h3>

        <div className={`h5ap-transcript-panel__summary${hasTranscript ? ' is-ready' : ''}`}>
          {hasTranscript
            ? sprintf(
              /* translators: 1: number of transcript lines, 2: time of the last line */
              _n('%1$d line added, up to %2$s', '%1$d lines added, up to %2$s', cues.length, 'html5-audio-player'),
              cues.length,
              formatTime(lastCue?.end || lastCue?.start)
            )
            : __('No transcript for this track yet. Import a caption file (SRT or VTT) or type it in.', 'html5-audio-player')}
        </div>

        {error && (
          <WPNotice status="error" isDismissible onRemove={() => setError('')}>{error}</WPNotice>
        )}

        <div className="h5ap-transcript-panel__actions">
          <FormFileUpload accept=".srt,.vtt,text/vtt,application/x-subrip" onChange={onImport} render={({ openFileDialog }) => (
            <Button variant="secondary" onClick={openFileDialog}>
              {hasTranscript ? __('Replace file', 'html5-audio-player') : __('Import SRT / VTT', 'html5-audio-player')}
            </Button>
          )} />
          <Button variant="secondary" onClick={openEditor}>
            {hasTranscript ? __('Edit text', 'html5-audio-player') : __('Type it in', 'html5-audio-player')}
          </Button>
        </div>
        {hasTranscript && (
          <Button className="h5ap-transcript-panel__remove" variant="link" isDestructive onClick={() => onChange([])}>
            {__('Remove transcript', 'html5-audio-player')}
          </Button>
        )}
      </div>


      {isEditing && (
        <Modal title={__('Edit transcript', 'html5-audio-player')} onRequestClose={() => setIsEditing(false)} className="h5ap-transcript-modal" size="medium">
          <p className="h5ap-transcript-modal__help">
            {__('One line per sentence, starting with its time. Example: 1:15 Welcome to the show. You can also paste an SRT or VTT file here.', 'html5-audio-player')}
          </p>
          <TextareaControl
            __nextHasNoMarginBottom
            label={__('Transcript', 'html5-audio-player')}
            hideLabelFromVision
            value={draft}
            onChange={(value) => { setDraft(value); setDraftError(''); }}
            rows={16}
            placeholder={'0:00 Welcome to the show.\n0:12 Today we talk about...'}
            className="h5ap-transcript-modal__textarea"
          />
          {draftError && <WPNotice status="error" isDismissible={false}>{draftError}</WPNotice>}
          <div className="h5ap-transcript-modal__actions">
            <Button variant="tertiary" onClick={() => setIsEditing(false)}>{__('Cancel', 'html5-audio-player')}</Button>
            <Button variant="primary" onClick={saveDraft}>{__('Save transcript', 'html5-audio-player')}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrackTranscript;
