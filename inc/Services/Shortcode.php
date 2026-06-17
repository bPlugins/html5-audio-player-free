<?php

namespace H5APPlayer\Services;

use H5APPlayer\Helper\Functions;

class Shortcode
{
    protected static $_instance = null;

    public function __construct()
    {
        add_shortcode('audio_player', [$this, 'audioPlayer']);
        add_shortcode('bypass_audio_player', [$this, 'audioPlayer']);
        add_shortcode('h5ap_radio_player', [$this, 'radio_player']);
    }

    /**
     * construct function
     */
    function register()
    {
        self::instance();
    }

    /**
     * Create instance function
     */
    static function instance()
    {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * [audio_player] shotcode
     */
    public function audioPlayer($atts) {
        extract(shortcode_atts($this->audio_player_attrs(), $atts));

        if (empty($id)) {
            $id = uniqid();
        }

        if (empty($file)) {
            $file = get_post_meta($id, '_ahp_quick-audio-file', true);
        }

        $width = $width ? $width : Functions::settings('h5ap_player_width', ['width' => '100', 'unit' => '%']);
        $repeat = $repeat ? ($repeat === 'true' ? ' loop' : '')  : (Functions::settings('h5ap_repeat', 'loop') === 'loop' ? ' loop ' : '');
        // $autoplay = Functions::settings('h5ap_autoplay', '0') === '1' ? ' autoplay ' : '';
        // $muted = Functions::settings('h5ap_muted', '0') === '1' ? ' muted ' : '';
        $autoplay = Functions::settings('h5ap_autoplay', '0') === '1';
        $muted = Functions::settings('h5ap_muted', '0') === '1';
        $preload = $preload ? $preload : Functions::settings('h5ap_preload', 'metadata');
        $stime = (int)Functions::settings('h5ap_seektime', '10');
        $global_lazy_load = Functions::settings('h5ap_lazy_load', '0') === '1';
        $lazy_load = isset($lazy_load) ? ($lazy_load === 'true' || $lazy_load === '1' || $lazy_load === 1) : $global_lazy_load;

        if ($file) {
            $src = $file;
        }

        if (empty($src)) {
            return false;
        }

        if (is_array($width) && isset($width['width'])) {
            if ($width['width'] === 0) {
                $width = '100%';
            } else {
                $width = $width['width'] . $width['unit'];
            }
        }

        $code_controls = $controls ? explode(',', $controls) : null;
        $final_controls = [];

        if (is_array($code_controls)) {
            foreach ($code_controls as $control) {
                array_push($final_controls, trim($control));
            }
        }

        // return $width;

        $controls = $final_controls ? $final_controls : Functions::settings('h5ap_controls', ['play', 'progress', 'current-time', 'mute', 'volume', 'settings']);
        $shuffle = $shuffle ? ($shuffle === 'true') : (Functions::settings('h5ap_shuffle', '0') === '1');


        $block  = [
            'blockName' => 'h5ap/audioplayer',
            'attrs' => [
                'source'        => $src,
                'controls' => array_fill_keys($controls, true),
                'width' => $width,
                'seekTime' => $stime,
                'repeat' => (bool)$repeat,
                'shuffle' => (bool)$shuffle,
                'skin' => isset($atts['skin']) ? ucfirst($atts['skin']) : 'Default',
                'autoplay' => $autoplay,
                'muted' => $muted,
                'preload' => $preload,
                'startTime' => (int)$start_time,
                'lazyLoad' => (bool)$lazy_load,
                'options' => [
                    'volume' => 0.5
                ]
            ]
        ];

        return render_block($block);
    }

    function audio_player_attrs() {
        return array(
            'id' => null,
            'file' => null,
            'src' => null,
            'width' => null,
            'controls' => null,
            // 'skin' => 'Default',
            'preload' => null,
            'repeat' => null,
            'shuffle' => null,
            'start_time' => 0,
            'lazy_load' => null,
        );
    }

    /**
     * [audio_player] shotcode
     */
    public function radio_player($atts)
    {
        extract(shortcode_atts(array(
            'id' => null,
        ), $atts));

        $post_id = esc_html($atts['id']);
        $post = get_post($id);
        if (!$post) {
            return '';
        }

        if ($post->post_type !== 'radioplayer') {
            return '';
        }

        if (post_password_required($post)) {
            return get_the_password_form($post);
        }

        $content = $post->post_content ?? ' ';
        $blocks = parse_blocks($content);


        switch ($post->post_status) {
            case 'publish':
                return render_block($blocks[0]);
            case 'private':
                if (current_user_can('read_private_posts')) {
                    return render_block($blocks[0]);
                }
                return '';
            case 'draft':
            case 'pending':
            case 'future':
                if (current_user_can('edit_post', $post_id)) {
                    return render_block($blocks[0]);
                }
                return '';
            default:
                return '';
        }
    }
}
