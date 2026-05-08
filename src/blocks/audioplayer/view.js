import { createRoot } from '@wordpress/element';

import './styles.scss'
import AudioPlayer from './Common/AudioPlayer';
import './../tailwind.scss'

document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.wp-block-h5ap-audioplayer');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        createRoot(block).render(<AudioPlayer attributes={attributers} id={id} />);

        block.removeAttribute('data-attributes');
        block.removeAttribute('data-id');

    })
});


