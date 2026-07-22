import { Fragment, useEffect, useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import Settings from "./settings";
import Playlist from '../Common/Playlist';
import OnlyBackend from '../../components/OnlyBackend';


const Edit = (props) => {
  const { attributes, setAttributes, clientId } = props;
  const [podcastAudios, setPodcastAudios] = useState([]);
  const [isFetchingPodcast, setIsFetchingPodcast] = useState(false);

  useEffect(() => {
    setAttributes({ 
      clientId,
      uniqueId: "h5ap" + clientId.substr(0, 9) 
    });
  }, []);

  useEffect(() => {
    if (attributes.sourceType !== 'podcast' || !attributes.podcastRssUrl) {
      setPodcastAudios([]);
      return;
    }

    setIsFetchingPodcast(true);

    const formData = new FormData();
    formData.append('action', 'h5ap_parse_podcast_feed');
    formData.append('url', attributes.podcastRssUrl);
    formData.append('limit', 5);

    fetch(ajaxurl, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPodcastAudios(data.data);
        } else {
          setPodcastAudios([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching podcast feed:', err);
        setPodcastAudios([]);
      })
      .finally(() => {
        setIsFetchingPodcast(false);
      });
  }, [attributes.sourceType, attributes.podcastRssUrl, attributes.podcastLimit]);

  const blockProps = useBlockProps({ className: 'wp-block-h5ap-tailwind' });

  const effectiveAttributes = {
    ...attributes,
    audios: attributes.sourceType === 'podcast' 
      ? (isFetchingPodcast 
          ? [{ title: 'Loading episodes...', artist: '', source: '' }] 
          : (podcastAudios.length > 0 ? podcastAudios : [{ title: 'No episodes found', artist: '', source: '' }])) 
      : attributes.audios
  };

  return (
    <Fragment>
      <Settings {...props} />
      <div {...blockProps}>
        <OnlyBackend />
        <Playlist {...{ attributes: effectiveAttributes, id: `block-${clientId}` }} />
      </div>
    </Fragment>
  );
};

export default Edit;
