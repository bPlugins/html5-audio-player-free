/**
 * Global Play Handler (Free Version)
 * Ensures that only one audio player plays at a time on the page.
 */
export const initGlobalPlayHandler = () => {
    // Avoid double initialization
    if (window.h5ap_global_handler_initialized) return;
    window.h5ap_global_handler_initialized = true;

    window.addEventListener('play', (event) => {
        const activeMedia = event.target;

        // Ensure it's a media element (AUDIO or VIDEO)
        if (!activeMedia || (activeMedia.tagName !== 'AUDIO' && activeMedia.tagName !== 'VIDEO')) {
            return;
        }

        // Find all audio and video elements on the page
        const allMedia = document.querySelectorAll('audio, video');
        
        for (let i = 0; i < allMedia.length; i++) {
            const media = allMedia[i];
            // Pause if it's not the active media that just started playing and is currently playing
            if (media !== activeMedia && !media.paused) {
                media.pause();
            }
        }
    }, true); // Use capture phase
};
