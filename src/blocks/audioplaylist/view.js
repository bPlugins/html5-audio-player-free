
import { createRoot } from '@wordpress/element';

import './../tailwind.scss'
import Playlist from './Common/Playlist';

document.addEventListener('DOMContentLoaded', function () {

    const blocks = document.querySelectorAll('.wp-block-h5ap-audioplaylist');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        const renderPlayer = () => {
            createRoot(block).render(<Playlist attributes={attributers} id={id} />);
            block.removeAttribute('data-attributes');
            block.removeAttribute('data-id');
        };

        const isLazyLoad = attributers.lazyLoad !== undefined ? attributers.lazyLoad : (window.h5apPlayer?.lazyLoad === true);

        if (isLazyLoad && typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        renderPlayer();
                        observer.unobserve(block);
                    }
                });
            }, { rootMargin: '200px' });
            observer.observe(block);
        } else {
            renderPlayer();
        }

    })

})