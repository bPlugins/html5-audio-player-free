import { createRoot } from '@wordpress/element';

import './styles.scss'
import RadioPlayer from './Common/RadioPlayer';

function initRadioPlayer() {
    const blocks = document.querySelectorAll('.wp-block-h5ap-radio-player[data-attributes]');

    blocks.forEach((block) => {
        const attributers = JSON.parse(block.dataset.attributes);
        const id = block.dataset.id;
        const nonce = block.dataset.nonce;
        const renderPlayer = () => {
            block.removeAttribute('data-attributes');
            block.removeAttribute('data-id');
            block.removeAttribute('data-nonce');
            createRoot(block).render(<RadioPlayer attributes={attributers} id={id} nonce={nonce} />);
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
}

document.addEventListener('DOMContentLoaded', initRadioPlayer);
document.addEventListener('h5ap_init', initRadioPlayer);

if (typeof window.h5apInit === 'undefined') {
    window.h5apInit = function () {
        document.dispatchEvent(new Event('h5ap_init'));
    };
}

// Elementor adds widgets (for example a Shortcode widget with [player]) after the page has loaded,
// so start any player it adds.
if (window.jQuery) {
    const onElementorReady = () => window.elementorFrontend?.hooks?.addAction('frontend/element_ready/global', initRadioPlayer);
    if (window.elementorFrontend?.hooks) {
        onElementorReady();
    } else {
        window.jQuery(window).on('elementor/frontend/init', onElementorReady);
    }
}
