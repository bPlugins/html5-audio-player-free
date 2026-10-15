import { Fragment, useEffect, useRef } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from "./settings";
import AudioPlayer from '../Common/AudioPlayer';
import OnlyBackend from '../../components/OnlyBackend';
import TranscriptPreview from './TranscriptPreview';

const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;
  const { skin, defaultValue } = attributes;
  const containerRef = useRef(null);
  const isSkinMounted = useRef(false);

  useEffect(() => {
    setAttributes({ uniqueId: "h5ap" + clientId.substr(0, 8) });
  }, []);

  useEffect(() => {
    if (!isSkinMounted.current) {
      isSkinMounted.current = true;
      return;
    }
    if (defaultValue[skin]) {
      setAttributes(defaultValue[skin])
    }
  }, [skin])

  const hasTranscript = attributes.showTranscript && attributes.transcript?.length > 0;

  // The player wrapper is a flex row; let the transcript preview wrap onto its own line.
  const blockProps = useBlockProps({ className: 'wp-block-h5ap-tailwind', style: hasTranscript ? { flexWrap: 'wrap' } : undefined });

  return (
    <Fragment>
      <Settings {...{ attributes, setAttributes }} />
      <div {...blockProps}>
        <OnlyBackend />
        <AudioPlayer {...{ attributes, containerRef, id: `block-${clientId}`, isBackend: true }} />
        {hasTranscript && <TranscriptPreview attributes={attributes} />}
      </div>
    </Fragment>
  );
};

export default Edit;
