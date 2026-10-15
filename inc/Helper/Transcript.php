<?php

namespace H5APPlayer\Helper;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Transcript ("AI Listen & Read") helpers shared by the block, the [player] shortcode and the Elementor widget.
 *
 * A transcript is a list of cues: [ ['start' => 12.5, 'end' => 18.0, 'text' => '...'], ... ] with times in seconds.
 * Editors can paste SRT, WebVTT or simple "1:15 Some text" lines; everything is turned into cues here.
 */
class Transcript
{
    const MAX_CUES = 5000;

    // Plugin folder path and URL. Worked out here so this file is the same in the Free and Pro plugins.
    private static function path($file = '')
    {
        return trailingslashit(dirname(__DIR__, 2)) . $file;
    }

    private static function url($file = '')
    {
        return plugin_dir_url(dirname(__DIR__, 2) . '/html5-audio-player.php') . $file;
    }

    private static function asset($name)
    {
        $file = self::path("build/{$name}.asset.php");
        return file_exists($file) ? include $file : ['dependencies' => [], 'version' => false];
    }

    /**
     * Parse SRT, WebVTT or simple timestamped lines into cues.
     */
    public static function parse($raw)
    {
        $raw = preg_replace('/^\xEF\xBB\xBF/', '', (string) $raw);
        $raw = str_replace(["\r\n", "\r"], "\n", $raw);

        $cues = strpos($raw, '-->') !== false ? self::parse_captions($raw) : self::parse_simple($raw);
        return self::sanitize_cues($cues);
    }

    /**
     * "01:02:03,450", "02:03.45" or "2:03" to seconds. Returns null for anything else.
     */
    public static function to_seconds($value)
    {
        if (!preg_match('/^(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:[.,](\d{1,3}))?$/', trim((string) $value), $m)) {
            return null;
        }
        $fraction = isset($m[4]) ? (int) str_pad($m[4], 3, '0') / 1000 : 0;
        return (int) $m[1] * 3600 + (int) $m[2] * 60 + (int) $m[3] + $fraction;
    }

    /**
     * 75 to "1:15", 3725 to "1:02:05".
     */
    public static function format_time($seconds)
    {
        $total = max(0, (int) floor((float) $seconds));
        $hours = intdiv($total, 3600);
        if ($hours) {
            return sprintf('%d:%02d:%02d', $hours, intdiv($total % 3600, 60), $total % 60);
        }
        return sprintf('%d:%02d', intdiv($total, 60), $total % 60);
    }

    private static function clean_text($text)
    {
        $text = html_entity_decode(wp_strip_all_tags((string) $text), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        return trim(preg_replace('/\s+/u', ' ', $text));
    }

    private static function parse_captions($raw)
    {
        $cues = [];
        foreach (preg_split('/\n\s*\n/', $raw) as $block) {
            $lines = array_values(array_filter(explode("\n", $block), function ($line) {
                return trim($line) !== '';
            }));
            if (empty($lines) || preg_match('/^(NOTE|STYLE|REGION)\b/', $lines[0])) {
                continue;
            }

            $timing = null;
            foreach ($lines as $i => $line) {
                if (strpos($line, '-->') !== false) {
                    $timing = $i;
                    break;
                }
            }
            if ($timing === null) {
                continue;
            }

            $parts = explode('-->', $lines[$timing]);
            $start = self::to_seconds($parts[0]);
            $end_part = isset($parts[1]) ? preg_split('/\s+/', trim($parts[1])) : [''];
            $end = self::to_seconds($end_part[0]);
            $text = self::clean_text(implode(' ', array_slice($lines, $timing + 1)));

            if ($start !== null && $text !== '') {
                $cues[] = ['start' => $start, 'end' => $end, 'text' => $text];
            }
        }
        return $cues;
    }

    /**
     * One cue per line that starts with a time: "1:15 Text", "[1:15] Text", "01:02:05 - Text".
     * Lines without a time are added to the line above.
     */
    private static function parse_simple($raw)
    {
        $cues = [];
        foreach (explode("\n", $raw) as $line) {
            if (preg_match('/^\s*\[?((?:\d+:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?)\]?\s*[-:\x{2013}\x{2014}]?\s*(.*)$/u', $line, $m)) {
                $cues[] = ['start' => self::to_seconds($m[1]), 'end' => null, 'text' => self::clean_text($m[2])];
            } elseif (trim($line) !== '' && !empty($cues)) {
                $last = count($cues) - 1;
                $cues[$last]['text'] = trim($cues[$last]['text'] . ' ' . self::clean_text($line));
            }
        }
        return $cues;
    }

    /**
     * Validate cues coming from block attributes or parsing: numbers for times, plain text, sorted by start.
     */
    public static function sanitize_cues($cues)
    {
        if (!is_array($cues)) {
            return [];
        }

        $clean = [];
        foreach ($cues as $cue) {
            if (!is_array($cue) || !isset($cue['start'], $cue['text']) || !is_numeric($cue['start'])) {
                continue;
            }
            $text = sanitize_text_field((string) $cue['text']);
            if ($text === '') {
                continue;
            }
            $clean[] = [
                'start' => round(max(0, (float) $cue['start']), 2),
                'end'   => (isset($cue['end']) && is_numeric($cue['end'])) ? round((float) $cue['end'], 2) : null,
                'text'  => $text,
            ];
            if (count($clean) >= self::MAX_CUES) {
                break;
            }
        }

        usort($clean, function ($a, $b) {
            return $a['start'] <=> $b['start'];
        });
        return $clean;
    }

    /**
     * Register the small front-end script/style. Safe to call more than once.
     */
    public static function register_assets()
    {
        if (wp_script_is('h5ap-transcript', 'registered')) {
            return;
        }
        $asset = self::asset('transcript');
        wp_register_script('h5ap-transcript', self::url('build/transcript.js'), $asset['dependencies'], $asset['version'], true);
        wp_register_style('h5ap-transcript', self::url('build/transcript.css'), [], $asset['version']);
    }

    // Upgrade page (AI transcript and download are part of HTML5 Audio Player Pro).
    public static function pro_url()
    {
        return admin_url('admin.php?page=html5-audio-player-help-demo#/pricing');
    }

    /**
     * Transcript HTML shown under a player. It is plain HTML, so search engines can read it.
     *
     * @param array  $cues      Transcript cues.
     * @param string $player_id The id of the element that contains the player's <audio>.
     * @param array  $args      align (left|center|right), width (CSS length), search (bool), open (bool),
     *                          source (track file, for playlists), title (track name), hidden (bool),
     *                          sticky (bool: show it in a dock above a sticky player).
     */
    public static function render($cues, $player_id, $args = [])
    {
        $cues = self::sanitize_cues($cues);
        if (empty($cues) || empty($player_id)) {
            return '';
        }

        $args = wp_parse_args($args, ['align' => 'left', 'width' => '100%', 'search' => true, 'open' => true, 'radius' => 0, 'source' => '', 'title' => '', 'hidden' => false, 'sticky' => false]);
        $align = in_array($args['align'], ['left', 'center', 'right'], true) ? $args['align'] : 'left';
        $width = (is_string($args['width']) && preg_match('/^\d+(\.\d+)?(px|%|em|rem|vw)$/', $args['width'])) ? $args['width'] : '100%';

        // Corner radius in px; 0 (the default) keeps square corners.
        $radius = max(0, min(40, (int) $args['radius']));
        $source = is_string($args['source']) ? $args['source'] : '';
        $title = is_string($args['title']) ? trim($args['title']) : '';
        // In a sticky dock the panel starts closed, so it never covers the page on load.
        $open = $args['open'] && !$args['sticky'];

        self::register_assets();
        wp_enqueue_script('h5ap-transcript');
        wp_enqueue_style('h5ap-transcript');

        ob_start();
        ?>
<details class="h5ap-transcript h5ap-transcript--<?php echo esc_attr($align); ?>" data-player="<?php echo esc_attr($player_id); ?>" style="width: <?php echo esc_attr($width); ?>; --h5ap-tr-radius: <?php echo esc_attr($radius); ?>px"<?php echo $source !== '' ? ' data-source="' . esc_url($source) . '"' : ''; ?><?php echo $open ? ' open' : ''; ?><?php echo $args['hidden'] ? ' hidden' : ''; ?>>
    <summary class="h5ap-transcript__summary"><?php esc_html_e('Transcript', 'html5-audio-player'); ?><?php if ($title !== '') { ?> <span class="h5ap-transcript__track"><?php echo esc_html($title); ?></span><?php } ?></summary>
    <?php if ($args['search']) { ?>
    <div class="h5ap-transcript__search">
        <input type="search" class="h5ap-transcript__input" placeholder="<?php esc_attr_e('Search in audio', 'html5-audio-player'); ?>" aria-label="<?php esc_attr_e('Search in transcript', 'html5-audio-player'); ?>">
        <span class="h5ap-transcript__count" aria-live="polite"
            data-one="<?php /* translators: %d: number of matches in the transcript */ esc_attr_e('%d match', 'html5-audio-player'); ?>"
            data-many="<?php /* translators: %d: number of matches in the transcript */ esc_attr_e('%d matches', 'html5-audio-player'); ?>"
            data-none="<?php esc_attr_e('No matches', 'html5-audio-player'); ?>"></span>
    </div>
    <?php } ?>
    <ol class="h5ap-transcript__lines">
        <?php foreach ($cues as $cue) {
            $label = self::format_time($cue['start']);
            ?>
        <li class="h5ap-transcript__line" data-start="<?php echo esc_attr($cue['start']); ?>"<?php echo $cue['end'] !== null ? ' data-end="' . esc_attr($cue['end']) . '"' : ''; ?>>
            <button type="button" class="h5ap-transcript__time" aria-label="<?php
                /* translators: %s: time in the audio, for example 1:15 */
                echo esc_attr(sprintf(__('Play from %s', 'html5-audio-player'), $label)); ?>"><?php echo esc_html($label); ?></button>
            <span class="h5ap-transcript__text"><?php echo esc_html($cue['text']); ?></span>
        </li>
        <?php } ?>
    </ol>
</details>
        <?php
        $html = ob_get_clean();
        if (!$args['sticky']) {
            return $html;
        }

        // Sticky player: a "Transcript" button above the fixed bar opens the transcript (transcript.js places it).
        return '<div class="h5ap-transcript-dock" data-player="' . esc_attr($player_id) . '" hidden>'
            . '<button type="button" class="h5ap-transcript-dock__toggle" aria-expanded="false">' . esc_html__('Transcript', 'html5-audio-player') . '</button>'
            . $html
            . '</div>';
    }

    /**
     * Transcripts of a playlist: one box per track that has one. transcript.js shows the box of the track
     * that is playing and hides the others.
     *
     * @param array  $tracks    Tracks with source, title and transcript (cues, or text in the "1:15 Text" / SRT / VTT format).
     * @param string $player_id The id of the element that contains the playlist's <audio>.
     * @param array  $args      Same as render().
     */
    public static function render_playlist($tracks, $player_id, $args = [])
    {
        $html = '';
        foreach ((array) $tracks as $track) {
            if (!is_array($track) || empty($track['transcript']) || empty($track['source']) || !is_string($track['source'])) {
                continue;
            }
            $cues = is_array($track['transcript']) ? $track['transcript'] : self::parse((string) $track['transcript']);
            $title = isset($track['title']) && is_string($track['title']) ? $track['title'] : '';
            $box = self::render($cues, $player_id, array_merge($args, [
                'source'   => $track['source'],
                'title'    => $title,
                'filename' => $title !== '' ? sanitize_title($title) : 'transcript',
                'hidden'   => $html !== '', // the first track's box shows until the player says otherwise
                'sticky'   => false,
            ]));
            $html .= $box;
        }
        return $html;
    }

    /**
     * Track transcripts were saved with the tracks; the player script does not need them.
     */
    public static function strip_track_transcripts($tracks)
    {
        if (!is_array($tracks)) {
            return $tracks;
        }
        foreach ($tracks as $i => $track) {
            if (is_array($track)) {
                unset($tracks[$i]['transcript']);
            }
        }
        return $tracks;
    }

    /**
     * Fields for the "Standard Player" metabox (Codestar). New fields are off by default, so existing players don't change.
     */
    public static function metabox_field($name, $types = ['opt-1'])
    {
        // Player types the field shows for: opt-1 Standard, opt-2 Playlist, opt-3 Sticky.
        $types = implode(',', (array) $types);
        $dependency = ['h5ap_player_type', 'any', $types];
        $shown = [
            ['h5ap_player_type', 'any', $types],
            ['show_transcript', '==', '1'],
        ];

        switch ($name) {
            case 'heading':
                return [
                    'type'       => 'content',
                    'dependency' => $dependency,
                    // Same look as the other section headers in this metabox.
                    'content'    => '<div style="margin: 24px 0 5px 0; padding: 10px 14px; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 4px; font-weight: 700; font-size: 13px; color: #1e293b; display: flex; align-items: center; gap: 8px;">'
                        . '<span>&#128221;</span> ' . ($types === 'opt-1' ? esc_html__('5. Transcript', 'html5-audio-player') : esc_html__('Transcript', 'html5-audio-player'))
                        . ' <span style="background:#04a504;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:700;letter-spacing:0.04em;">' . esc_html__('NEW', 'html5-audio-player') . '</span></div>',
                ];
            case 'show':
                return [
                    'id'         => 'show_transcript',
                    'type'       => 'switcher',
                    'title'      => __('Show Transcript', 'html5-audio-player'),
                    'desc'       => $types === 'opt-1'
                        ? __('Show the text of the audio under the player. Visitors can read along, search and click a line to jump there.', 'html5-audio-player')
                        : __('Show the text of the audio. Visitors can read along, search and click a line to jump there. In a playlist, add the text to each track; in a sticky player, a "Transcript" button opens it.', 'html5-audio-player'),
                    'default'    => false,
                    'dependency' => $dependency,
                ];
            case 'text':
                return [
                    'id'         => 'transcript_text',
                    'type'       => 'textarea',
                    'title'      => __('Transcript Text', 'html5-audio-player'),
                    'desc'       => __('Paste an SRT or VTT caption file, or write one line per sentence starting with its time, for example: 1:15 Welcome to the show.', 'html5-audio-player'),
                    'attributes' => [
                        'rows'        => 10,
                        'placeholder' => "0:00 Welcome to the show.\n0:12 Today we talk about...",
                        'class'       => 'h5ap-transcript-textarea',
                    ],
                    'sanitize'   => [__CLASS__, 'sanitize_textarea'],
                    'dependency' => $shown,
                ];
            case 'search':
                return [
                    'id'         => 'transcript_search',
                    'type'       => 'switcher',
                    'title'      => __('Transcript Search', 'html5-audio-player'),
                    'desc'       => __('Let visitors search the transcript.', 'html5-audio-player'),
                    'default'    => true,
                    'dependency' => $shown,
                ];
            case 'open':
                return [
                    'id'         => 'transcript_open',
                    'type'       => 'switcher',
                    'title'      => __('Open Transcript by Default', 'html5-audio-player'),
                    'desc'       => __('Turn off to show the transcript closed, so visitors open it when they need it.', 'html5-audio-player'),
                    'default'    => true,
                    'dependency' => $shown,
                ];
            case 'radius_list':
                // Playlist and Sticky players: the Standard Player's radius field sits in its own styling section.
                return [
                    'id'         => 'transcript_radius_list',
                    'type'       => 'slider',
                    'title'      => __('Transcript Corner Radius', 'html5-audio-player'),
                    'desc'       => __('Round the corners of the transcript box, in pixels. 0 keeps them square.', 'html5-audio-player'),
                    'min'        => 0,
                    'max'        => 40,
                    'step'       => 1,
                    'unit'       => 'px',
                    'default'    => 0,
                    'dependency' => $shown,
                ];
            case 'radius':
                return [
                    'id'         => 'transcript_radius',
                    'type'       => 'slider',
                    'title'      => __('Transcript Corner Radius', 'html5-audio-player') . ' <span class="h5ap-new-badge" style="background:#2563eb;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600;">' . esc_html__('NEW', 'html5-audio-player') . '</span>',
                    'desc'       => __('Round the corners of the transcript box. 0 keeps them square.', 'html5-audio-player'),
                    'min'        => 0,
                    'max'        => 40,
                    'step'       => 1,
                    'unit'       => 'px',
                    'default'    => 0,
                    'dependency' => $shown,
                ];
        }
        return [];
    }

    /**
     * Keep line breaks (needed for SRT/VTT) but remove markup.
     */
    public static function sanitize_textarea($value)
    {
        return sanitize_textarea_field((string) $value);
    }

    /**
     * Sub-field for a playlist track (Codestar group / repeater): the track's transcript text.
     * admin.js adds the Import (and in Pro, the AI) buttons to it.
     */
    public static function track_field($id = 'pl_transcript')
    {
        return [
            'id'         => $id,
            'type'       => 'textarea',
            'title'      => __('Transcript', 'html5-audio-player'),
            'desc'       => __('Optional. Paste an SRT or VTT caption file, or write one line per sentence starting with its time, for example: 1:15 Welcome to the show.', 'html5-audio-player'),
            'attributes' => [
                'rows'        => 5,
                'placeholder' => "0:00 Welcome to the show.\n0:12 Today we talk about...",
                'class'       => 'h5ap-transcript-textarea',
            ],
            'sanitize'   => [__CLASS__, 'sanitize_textarea'],
        ];
    }

    /**
     * Block attributes for a [player] shortcode, from the metabox values.
     *
     * @param callable $meta The getter returned by h5ap_get_post_meta().
     * @param string   $type Player type: opt-1 Standard, opt-2 Playlist (text is per track), opt-3 Sticky.
     */
    public static function block_attrs_from_meta($meta, $type = 'opt-1')
    {
        if (!$meta('show_transcript', false, true)) {
            return [];
        }
        $attrs = [
            'showTranscript'   => true,
            'transcript'       => $type === 'opt-2' ? [] : self::parse($meta('transcript_text', '')),
            'transcriptSearch' => $meta('transcript_search', true, true),
            'transcriptOpen'   => $meta('transcript_open', true, true),
            'transcriptRadius' => (int) $meta($type === 'opt-1' ? 'transcript_radius' : 'transcript_radius_list', 0),
        ];
        if ($type === 'opt-2') {
            unset($attrs['transcript']); // a playlist keeps the text with each track
        }
        return $attrs;
    }

    /**
     * Elementor controls (a "Transcript" section in the Content tab).
     *
     * @param \Elementor\Widget_Base $widget
     */
    public static function register_elementor_controls($widget)
    {
        $widget->start_controls_section('h5ap_transcript_section', [
            'label' => esc_html__('Transcript', 'html5-audio-player') . ' <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:4px;background:#2563eb;color:#fff;font-size:9px;font-weight:700;line-height:1.6;letter-spacing:0.04em;vertical-align:middle;">' . esc_html__('NEW', 'html5-audio-player') . '</span>',
            'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
        ]);

        $widget->add_control('h5ap_show_transcript', [
            'label'        => esc_html__('Show Transcript', 'html5-audio-player'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'return_value' => 'yes',
            'default'      => '',
            'description'  => esc_html__('Show the text of the audio under the player. Visitors can read along, search and click a line to jump there.', 'html5-audio-player'),
        ]);

        $widget->add_control('h5ap_transcript_text', [
            'label'       => esc_html__('Transcript Text', 'html5-audio-player'),
            'type'        => \Elementor\Controls_Manager::TEXTAREA,
            'rows'        => 10,
            'placeholder' => "0:00 Welcome to the show.\n0:12 Today we talk about...",
            'description' => esc_html__('Paste an SRT or VTT caption file, or write one line per sentence starting with its time, for example: 1:15 Welcome to the show.', 'html5-audio-player'),
            'condition'   => ['h5ap_show_transcript' => 'yes'],
        ]);

        $widget->add_control('h5ap_transcript_search', [
            'label'        => esc_html__('Transcript Search', 'html5-audio-player'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'return_value' => 'yes',
            'default'      => 'yes',
            'condition'    => ['h5ap_show_transcript' => 'yes'],
        ]);

        $widget->add_control('h5ap_transcript_open', [
            'label'        => esc_html__('Open Transcript by Default', 'html5-audio-player'),
            'type'         => \Elementor\Controls_Manager::SWITCHER,
            'return_value' => 'yes',
            'default'      => 'yes',
            'condition'    => ['h5ap_show_transcript' => 'yes'],
        ]);


        // Pro features are listed in one card at the end of the section, not as locked settings.
        $widget->add_control('h5ap_transcript_ai_pro', [
            'type'      => \Elementor\Controls_Manager::RAW_HTML,
            'raw'       => self::elementor_pro_card(),
            'separator' => 'before',
            'condition' => ['h5ap_show_transcript' => 'yes'],
        ]);

        $widget->end_controls_section();

        $widget->start_controls_section('h5ap_transcript_style_section', [
            'label'     => esc_html__('Transcript', 'html5-audio-player') . ' <span style="display:inline-block;margin-left:6px;padding:1px 6px;border-radius:4px;background:#2563eb;color:#fff;font-size:9px;font-weight:700;line-height:1.6;letter-spacing:0.04em;vertical-align:middle;">' . esc_html__('NEW', 'html5-audio-player') . '</span>',
            'tab'       => \Elementor\Controls_Manager::TAB_STYLE,
            'condition' => ['h5ap_show_transcript' => 'yes'],
        ]);

        $widget->add_control('h5ap_transcript_radius', [
            'label'       => esc_html__('Corner Radius (px)', 'html5-audio-player'),
            'type'        => \Elementor\Controls_Manager::SLIDER,
            'size_units'  => ['px'],
            'range'       => ['px' => ['min' => 0, 'max' => 40, 'step' => 1]],
            'default'     => ['unit' => 'px', 'size' => 0],
            'description' => esc_html__('Round the corners of the transcript box, in pixels. 0 keeps them square.', 'html5-audio-player'),
        ]);

        $widget->end_controls_section();
    }

    /**
     * Elementor: card that lists the Pro transcript features (shown without Pro).
     */
    private static function elementor_pro_card()
    {
        $crown = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="flex:none;fill:#f59e0b"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
        $check = '<span aria-hidden="true" style="flex:none;color:#f59e0b;font-weight:700">&#10003;</span>';
        $item = function ($text) use ($check) {
            return '<li style="display:flex;gap:8px;margin:0 0 6px;line-height:1.5">' . $check . '<span>' . esc_html($text) . '</span></li>';
        };

        return '<div style="padding:12px;border:1px solid rgba(245,158,11,.45);border-left:3px solid #f59e0b;border-radius:4px;background:rgba(245,158,11,.08);font-style:normal">'
            . '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' . $crown
            . '<strong style="font-size:13px">' . esc_html__('AI Transcript', 'html5-audio-player') . '</strong>'
            . '<span style="padding:1px 6px;border-radius:4px;background:#f59e0b;color:#1d2327;font-size:9px;font-weight:700;letter-spacing:.04em;line-height:1.6">' . esc_html__('PRO', 'html5-audio-player') . '</span></div>'
            . '<ul style="margin:0 0 10px;padding:0;list-style:none;font-size:12px">'
            . $item(__('Generate the transcript from the audio with AI, right in your browser.', 'html5-audio-player'))
            . $item(__('Let visitors download the transcript as .vtt or .txt.', 'html5-audio-player'))
            . '</ul>'
            . '<a href="' . esc_url(self::pro_url()) . '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:4px;background:#f59e0b;color:#1d2327;font-size:12px;font-weight:600;text-decoration:none">'
            . esc_html__('Upgrade to Pro', 'html5-audio-player') . ' &rarr;</a>'
            . '</div>';
    }

    /**
     * Transcript HTML for an Elementor widget, or '' when it is turned off.
     */
    public static function render_elementor($settings, $player_id, $widget = null)
    {
        if (empty($settings['h5ap_show_transcript']) || $settings['h5ap_show_transcript'] !== 'yes' || empty($settings['h5ap_transcript_text'])) {
            return '';
        }
        // Same width as the player above it (the widget's Style > Width, 500px by default) and centered like it, so the two line up.
        // A width that was never changed is not in $settings, so fall back to the control's default.
        $size = $settings['baudio_width'] ?? null;
        if (empty($size['size']) && $widget && method_exists($widget, 'get_controls')) {
            $control = $widget->get_controls('baudio_width');
            $size = $control['default'] ?? null;
        }
        $width = (!empty($size['size']) && !empty($size['unit'])) ? (float) $size['size'] . $size['unit'] : '100%';

        return self::render(self::parse($settings['h5ap_transcript_text']), $player_id, [
            'align'  => 'center',
            'width'  => $width,
            'search' => isset($settings['h5ap_transcript_search']) && $settings['h5ap_transcript_search'] === 'yes',
            'open'   => isset($settings['h5ap_transcript_open']) && $settings['h5ap_transcript_open'] === 'yes',
            'radius' => isset($settings['h5ap_transcript_radius']['size']) ? (int) $settings['h5ap_transcript_radius']['size'] : 0,
        ]);
    }
}
