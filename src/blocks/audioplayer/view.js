import { createRoot } from '@wordpress/element';

import './styles.scss'
import AudioPlayer from './Common/AudioPlayer';
import './../tailwind.scss'

function initAudioPlayers() {
    const blocks = document.querySelectorAll('.wp-block-h5ap-audioplayer[data-attributes]');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;

        const renderPlayer = () => {
            // console.log(`[H5AP LazyLoad] Mounting Standard Player: ${id}`);
            createRoot(block).render(<AudioPlayer attributes={attributers} id={id} />);
            block.removeAttribute('data-attributes');
            block.removeAttribute('data-id');
        };

        const isLazyLoad = attributers.lazyLoad !== undefined ? attributers.lazyLoad : (window.h5apPlayer?.lazyLoad === true);
        // console.log(`[H5AP LazyLoad Check] Standard Player ${id} - lazyLoad setting is: ${isLazyLoad}`);

        if (isLazyLoad && typeof IntersectionObserver !== 'undefined') {
            // console.log(`[H5AP LazyLoad] Observing Standard Player: ${id}`);
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
}

document.addEventListener('DOMContentLoaded', initAudioPlayers);
document.addEventListener('h5ap_init', initAudioPlayers);

if (typeof window.h5apInit === 'undefined') {
    window.h5apInit = function () {
        document.dispatchEvent(new Event('h5ap_init'));
    };
}

// Elementor adds widgets (for example a Shortcode widget with [player]) after the page has loaded,
// so start any player it adds.
if (window.jQuery) {
    const onElementorReady = () => window.elementorFrontend?.hooks?.addAction('frontend/element_ready/global', initAudioPlayers);
    if (window.elementorFrontend?.hooks) {
        onElementorReady();
    } else {
        window.jQuery(window).on('elementor/frontend/init', onElementorReady);
    }
}
