import { Fragment, useEffect, useRef, useState } from 'react'
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import Settings from "./Settings";
import RadioPlayer from '../Common/RadioPlayer';
import OnlyBackend from '../../components/OnlyBackend';
import ShortCode from './ShortCode/ShortCode';

const Edit = (props) => {
  const { attributes, setAttributes, clientId, postType, postId } = props;
  const { skin, defaultValue, uniqueId } = attributes;
  const [isPremium] = useState(window.h5apPlayer?.isPipe);
  const containerRef = useRef(null);
  const isSkinMounted = useRef(false);

  useEffect(() => {
    if (!uniqueId) {
      setAttributes({ uniqueId: "h5ap" + clientId.substr(0, 8) });
    }
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

  const blockProps = useBlockProps();

  return (
    <Fragment>
      <Settings {...props} isPremium={isPremium} />

      {postType == "radioplayer" && (
        <ShortCode shortCode={`[h5ap_radio_player id=${postId}]`} />
      )}

      <div {...blockProps}>
        <OnlyBackend />
        <RadioPlayer {...{ attributes, containerRef, id: `block-${clientId}`, nonce: window.wpApiSettings?.nonce }} />
      </div>
    </Fragment>
  );
};


export default withSelect((select) => {
  const { getCurrentPostId, getCurrentPostType } = select("core/editor");
  return {
    isSaving: select('core/editor').isSavingPost(),
    isSavingPost: select('core/editor').isSavingPost,
    postType: getCurrentPostType(),
    postId: getCurrentPostId(),
  }
})(Edit);
