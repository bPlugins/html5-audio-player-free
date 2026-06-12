
import { createRoot } from '@wordpress/element';

import './../tailwind.scss'
import Playlist from './Common/Playlist';

document.addEventListener('DOMContentLoaded', function () {

    const blocks = document.querySelectorAll('.wp-block-h5ap-audioplaylist');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        createRoot(block).render(<Playlist attributes={attributers} id={id} />);

        block.removeAttribute('data-attributes');
        block.removeAttribute('data-id');

    })

})