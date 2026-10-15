/**
 * Front-end transcript: highlights the line being spoken, jumps the audio when a line is
 * clicked, and filters lines by a search term. The markup comes from H5APPlayer\Helper\Transcript::render().
 * Loaded only on pages that show a transcript.
 */
import '../css/transcript.scss';

const AUTO_SCROLL_PAUSE = 4000;

const setupTranscript = (box) => {
    box.dataset.ready = '1';

    const list = box.querySelector('.h5ap-transcript__lines');
    const lines = Array.from(box.querySelectorAll('.h5ap-transcript__line'));
    if (!list || !lines.length) {
        return;
    }

    const starts = lines.map((line) => parseFloat(line.dataset.start) || 0);
    const texts = lines.map((line) => line.querySelector('.h5ap-transcript__text')?.textContent || '');
    let audio = null;
    let active = -1;
    let userScrolledAt = 0;

    const scrollToLine = (line) => {
        if (Date.now() - userScrolledAt < AUTO_SCROLL_PAUSE || !box.open) {
            return;
        }
        list.scrollTo({ top: line.offsetTop - list.clientHeight / 3, behavior: 'smooth' });
    };

    const sync = () => {
        const time = audio.currentTime;
        let index = -1;
        // Nothing is highlighted until the audio has started (the player sets the time to 0 when it loads).
        if (!(audio.paused && time === 0)) {
            for (let i = 0; i < starts.length && starts[i] <= time + 0.05; i++) {
                index = i;
            }
        }
        if (index === active) {
            return;
        }
        if (active > -1) {
            lines[active].classList.remove('is-active');
            lines[active].removeAttribute('aria-current');
        }
        active = index;
        if (index > -1) {
            lines[index].classList.add('is-active');
            lines[index].setAttribute('aria-current', 'true');
            scrollToLine(lines[index]);
        }
    };

    // The player is mounted by React (sometimes lazily), so look for its <audio> when needed.
    const getAudio = () => {
        if (audio && audio.isConnected) {
            return audio;
        }
        const root = document.getElementById(box.dataset.player);
        audio = root ? root.querySelector('audio') : null;
        if (audio) {
            audio.addEventListener('timeupdate', sync);
            audio.addEventListener('seeked', sync);
        }
        return audio;
    };

    const root = document.getElementById(box.dataset.player);
    if (!getAudio() && root && typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            if (getAudio()) {
                observer.disconnect();
            }
        });
        observer.observe(root, { childList: true, subtree: true });
    }

    // Before the audio has loaded, the player resets the time to its Start Time when metadata arrives,
    // so apply the jump right after that instead.
    let pendingTime = null;
    const seek = (media, time) => {
        if (media.readyState >= 1) {
            media.currentTime = time;
            return;
        }
        if (pendingTime === null) {
            media.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                    media.currentTime = pendingTime;
                    pendingTime = null;
                }, 0);
            }, { once: true });
        }
        pendingTime = time;
    };

    const playFrom = (index) => {
        const media = getAudio();
        if (!media || index < 0) {
            return;
        }
        userScrolledAt = 0;
        seek(media, starts[index]);
        const playing = media.play();
        if (playing && typeof playing.catch === 'function') {
            playing.catch(() => { });
        }
    };

    list.addEventListener('click', (event) => {
        const line = event.target.closest('.h5ap-transcript__line');
        // Let people select text without jumping the audio.
        if (!line || String(window.getSelection?.() || '').length > 0) {
            return;
        }
        playFrom(lines.indexOf(line));
    });

    ['wheel', 'touchmove'].forEach((type) => {
        list.addEventListener(type, () => { userScrolledAt = Date.now(); }, { passive: true });
    });

    // Search
    const input = box.querySelector('.h5ap-transcript__input');
    const count = box.querySelector('.h5ap-transcript__count');
    if (!input) {
        return;
    }

    const paint = (line, text, term) => {
        const target = line.querySelector('.h5ap-transcript__text');
        target.textContent = '';
        if (!term) {
            target.textContent = text;
            return 0;
        }
        const lower = text.toLocaleLowerCase();
        let from = 0;
        let found = 0;
        let at = lower.indexOf(term);
        while (at !== -1) {
            target.append(text.slice(from, at));
            const mark = document.createElement('mark');
            mark.textContent = text.slice(at, at + term.length);
            target.append(mark);
            from = at + term.length;
            found++;
            at = lower.indexOf(term, from);
        }
        target.append(text.slice(from));
        return found;
    };

    let timer;
    const search = () => {
        const term = input.value.trim().toLocaleLowerCase();
        let total = 0;
        lines.forEach((line, i) => {
            const found = paint(line, texts[i], term);
            total += found;
            line.hidden = Boolean(term) && found === 0;
        });
        if (count) {
            const label = !term ? '' : total === 0 ? count.dataset.none : (total === 1 ? count.dataset.one : count.dataset.many);
            count.textContent = (label || '').replace('%d', total);
        }
    };

    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(search, 120);
    });

    // Enter plays from the first matching line.
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
            playFrom(lines.findIndex((line) => !line.hidden));
        }
    });
};

const initTranscripts = () => {
    document.querySelectorAll('.h5ap-transcript[data-player]:not([data-ready])').forEach(setupTranscript);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranscripts);
} else {
    initTranscripts();
}
document.addEventListener('h5ap_init', initTranscripts);

// Elementor re-renders widgets while editing; set up any new transcript it adds.
if (window.jQuery) {
    window.jQuery(window).on('elementor/frontend/init', () => {
        window.elementorFrontend?.hooks?.addAction('frontend/element_ready/global', initTranscripts);
    });
}
