import { __, _n, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { useState } from 'react';
import { PanelBody, ToggleControl, FormFileUpload, Button, Notice as WPNotice, Modal, TextareaControl } from '@wordpress/components';
import { Notice } from './../../../../../bpl-tools/Components';
import NewBadge from '../../components/NewBadge/NewBadge.js';
import { parseCaptions, parseTranscriptText, cuesToText, formatTime } from '../../../utils/transcript';
import LabelWithHelp from '../../components/LabelWithHelp/LabelWithHelp.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const TranscriptPanel = ({ attributes, setAttributes }) => {
  const { transcript = [], showTranscript, transcriptSearch, transcriptOpen } = attributes;
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

    const cues = parseCaptions(await file.text());
    if (!cues.length) {
      setError(__('No timed lines were found. Please choose a valid SRT or VTT file.', 'html5-audio-player'));
      return;
    }

    setError('');
    setAttributes({ transcript: cues, showTranscript: true });
  };

  const openEditor = () => {
    setDraft(cuesToText(transcript));
    setDraftError('');
    setIsEditing(true);
  };

  const saveDraft = () => {
    if (!draft.trim()) {
      setAttributes({ transcript: [], showTranscript: false });
      setIsEditing(false);
      return;
    }
    const cues = parseTranscriptText(draft);
    if (!cues.length) {
      setDraftError(__('No lines with a time were found. Start each line with its time, for example: 1:15 Welcome to the show.', 'html5-audio-player'));
      return;
    }
    setAttributes({ transcript: cues, showTranscript: true });
    setIsEditing(false);
  };

  const hasTranscript = transcript.length > 0;
  const lastCue = transcript[transcript.length - 1];

  return (
    <PanelBody className="bPlPanelBody h5ap-transcript-panel" title={<>{__('Transcript', 'html5-audio-player')}<NewBadge /></>} initialOpen={hasTranscript}>
      <ToggleControl
        __nextHasNoMarginBottom
        label={<LabelWithHelp label={__('Show transcript', 'html5-audio-player')} help={__('Shows the text of the audio under the player. Visitors can read along, search it, and click a line to jump to that moment.', 'html5-audio-player')} />}
        checked={!!showTranscript}
        onChange={(value) => setAttributes({ showTranscript: value })}
      />

      <div className="h5ap-transcript-panel__section">
        <h3 className="h5ap-transcript-panel__title">{__('Transcript text', 'html5-audio-player')}</h3>

        <div className={`h5ap-transcript-panel__summary${hasTranscript ? ' is-ready' : ''}`}>
          {hasTranscript
            ? sprintf(
              /* translators: 1: number of transcript lines, 2: time of the last line */
              _n('%1$d line added, up to %2$s', '%1$d lines added, up to %2$s', transcript.length, 'html5-audio-player'),
              transcript.length,
              formatTime(lastCue?.end || lastCue?.start)
            )
            : __('No transcript yet. Import a caption file (SRT or VTT) or type it in.', 'html5-audio-player')}
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
          <Button className="h5ap-transcript-panel__remove" variant="link" isDestructive onClick={() => setAttributes({ transcript: [], showTranscript: false })}>
            {__('Remove transcript', 'html5-audio-player')}
          </Button>
        )}
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
        </div>
      </div>


      <Notice status='premium' isIcon={true} className="h5ap-transcript-panel__pro">
        {createInterpolateElement(
          __('Features like <ai>AI Transcript Generator</ai> and <dl>Transcript Download (.vtt / .txt)</dl> are available in the Pro version.', 'html5-audio-player'),
          { ai: <strong className="h5ap-transcript-panel__highlight" />, dl: <strong /> }
        )}
      </Notice>
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
    </PanelBody>
  );
};

export default TranscriptPanel;
