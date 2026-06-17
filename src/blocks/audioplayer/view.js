import { createRoot } from '@wordpress/element';

import './styles.scss'
import AudioPlayer from './Common/AudioPlayer';
import './../tailwind.scss'

document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.wp-block-h5ap-audioplayer');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        const renderPlayer = () => {
            createRoot(block).render(<AudioPlayer attributes={attributers} id={id} />);
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
});


