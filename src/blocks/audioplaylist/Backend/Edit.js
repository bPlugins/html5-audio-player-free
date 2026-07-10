import { Fragment, useEffect } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import Settings from "./settings";
import Playlist from '../Common/Playlist';
import OnlyBackend from '../../components/OnlyBackend';


const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;

  useEffect(() => {
    setAttributes({ 
      clientId,
      uniqueId: "h5ap" + clientId.substr(0, 9) 
    });
  }, []);

  const blockProps = useBlockProps({ className: 'wp-block-h5ap-tailwind' });

  return (
    <Fragment>
      <Settings {...props} />
      <div {...blockProps}>
        <OnlyBackend />
        <Playlist {...{ attributes, id: `block-${clientId}` }} />
      </div>
    </Fragment>
  );
};

export default Edit;
