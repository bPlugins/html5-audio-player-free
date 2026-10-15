/**
 * Transcript helpers shared by the block editor and the front end.
 * A transcript is stored as an array of cues: [{ start, end, text }], times in seconds.
 */

const round = (n) => Math.round(n * 100) / 100;

// "01:02:03,450", "02:03.45" or "2:03" -> seconds
export const parseTimestamp = (value) => {
    const match = String(value).trim().replace(',', '.').match(/^(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/);
    if (!match) {
        return null;
    }
    const [, hours = 0, minutes, seconds, fraction = '0'] = match;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(fraction.padEnd(3, '0')) / 1000;
};

const decodeEntities = (text) => text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

/**
 * Parse an SRT or WebVTT file into cues. Header, NOTE and STYLE blocks are skipped,
 * and formatting tags such as <b> or <v Speaker> are removed.
 */
export const parseCaptions = (raw) => {
    const blocks = String(raw).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split(/\n\s*\n/);
    const cues = [];

    blocks.forEach((block) => {
        const lines = block.split('\n').filter((line) => line.trim() !== '');
        const timingIndex = lines.findIndex((line) => line.includes('-->'));
        if (timingIndex === -1 || /^(NOTE|STYLE|REGION)\b/.test(lines[0])) {
            return;
        }

        const [from, to = ''] = lines[timingIndex].split('-->');
        const start = parseTimestamp(from);
        const end = parseTimestamp(to.trim().split(/\s+/)[0]);
        if (start === null) {
            return;
        }

        const text = decodeEntities(lines.slice(timingIndex + 1).join(' ').replace(/<[^>]*>/g, ''))
            .replace(/\s+/g, ' ')
            .trim();
        if (!text) {
            return;
        }

        cues.push({ start: round(start), end: end === null ? null : round(end), text });
    });

    return cues.sort((a, b) => a.start - b.start);
};

/**
 * Simple format, one cue per line: "1:15 Text", "[1:15] Text" or "01:02:05 - Text".
 * Lines without a time are added to the line above. Same rules as Transcript::parse_simple() in PHP.
 */
export const parseSimpleTranscript = (raw) => {
    const cues = [];
    String(raw).replace(/\r\n?/g, '\n').split('\n').forEach((line) => {
        const match = line.match(/^\s*\[?((?:\d+:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?)\]?\s*[-:–—]?\s*(.*)$/);
        if (match) {
            cues.push({ start: round(parseTimestamp(match[1])), end: null, text: match[2].replace(/\s+/g, ' ').trim() });
        } else if (line.trim() && cues.length) {
            const last = cues[cues.length - 1];
            last.text = `${last.text} ${line.trim()}`.replace(/\s+/g, ' ').trim();
        }
    });
    return cues.filter((cue) => cue.text).sort((a, b) => a.start - b.start);
};

// SRT/VTT when the text has "-->" timings, otherwise the simple format.
export const parseTranscriptText = (raw) => (String(raw).includes('-->') ? parseCaptions(raw) : parseSimpleTranscript(raw));

// Cues -> simple format text for editing. Keeps fractions of a second (e.g. "0:12.5") so times don't drift.
export const cuesToText = (cues = []) => cues.map((cue) => {
    const fraction = Math.round((Number(cue.start) % 1) * 100);
    const time = fraction ? `${formatTime(cue.start)}.${String(fraction).padStart(2, '0').replace(/0$/, '')}` : formatTime(cue.start);
    return `${time} ${cue.text}`;
}).join('\n');

// 75 -> "1:15", 3725 -> "1:02:05"
export const formatTime = (seconds) => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};
