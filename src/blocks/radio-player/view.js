import { createRoot } from '@wordpress/element';

import './styles.scss'
import RadioPlayer from './Common/RadioPlayer';

document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.wp-block-h5ap-radio-player');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        const nonce = block.dataset.nonce;
        block.removeAttribute('data-attributes');
        block.removeAttribute('data-id');
        block.removeAttribute('data-nonce');
        createRoot(block).render(<RadioPlayer attributes={attributers} id={id} nonce={nonce} />);

    })
});


