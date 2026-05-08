<?php

namespace H5APPlayer\Services;

if (!defined('ABSPATH')) {
    exit;
}

class ShortcodePro extends Shortcode
{
    protected static $_instance = null;

    /**
     * construct function
     */
    public function __construct()
    {
        add_shortcode('h5ap_search_form', [$this, 'searchForm']);
        add_shortcode('audio_player', [$this, 'audioPlayer']);
        add_shortcode('bypass_audio_player', [$this, 'audioPlayer']);
        add_shortcode('single_button', [$this, 'h5ap_single_button_shortcode']);
        add_shortcode('h5ap_radio_player', [$this, 'radio_player']);
    }

    public function register(){
        self::instance();
    }

    public static function instance() {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function searchForm($atts){
        extract(shortcode_atts([
            'placeholder' => 'Search Audio',
            'width' => '400px'
        ], $atts, 'h5ap_search_form'));
        $query = isset($_GET['bps']) ? sanitize_text_field(wp_unslash($_GET['bps'])) : '';
        $id = 'h5aps' . uniqid();

        ob_start();
        ?>
        <style>
            <?php echo esc_html("#$id ") ?>form {
                width: <?php echo esc_html($width); ?>;
            }
        </style>
        <div id="<?php echo esc_html($id); ?>">
            <form action="#" id="h5ap_search_form">
                <input type="text" name="bps" placeholder="<?php echo esc_html($placeholder) ?>" value="<?php echo esc_html($query) ?>">
                <button type="submit" value=''>
                    <!-- <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="#444444" d="M15.7 14.3l-4.2-4.2c-0.2-0.2-0.5-0.3-0.8-0.3 0.8-1 1.3-2.4 1.3-3.8 0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6c1.4 0 2.8-0.5 3.8-1.4 0 0.3 0 0.6 0.3 0.8l4.2 4.2c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.3 0.4-0.9 0-1.3zM6 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"></path>
                    </svg> -->

                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M5 12h14M13 6l6 6-6 6"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"/>
                    </svg>
                </button>
            </form>
        </div>
    <?php
        $output = ob_get_contents();
        ob_get_clean();
        return $output;
    }



    public function h5ap_single_button_shortcode($atts)
    {
        $settings = h5ap_get_settings('h5ap_settings', []);
        extract(shortcode_atts(array(
            'file' => null,
            'height' => $settings('dimention', ['height' => 50])['height'] . $settings('dimention', ['unit' => 'px'])['unit'],
            'width' => $settings('dimention', ['width' => 50])['width'] . $settings('dimention', ['unit' => 'px'])['unit'],
            'font_size'  => $settings('button_size', 25) . 'px',
            'border_radius' => $settings('radius', ['width' => 50])['width'] . $settings('radius', ['unit' => 'px'])['unit'],
            'color' => $settings('button_color', '#ffffff'),
            'background' => $settings('button_background', '#000'),
        ), $atts));

        $uid = "a" . uniqid();

        if ($file === null) {
            return false;
        }

    ?>
        <?php ob_start(); ?>
        <style>
            <?php echo esc_html(".$uid") ?>.h5ap_single_button {
                height: <?php echo esc_html($height); ?>;
                width: <?php echo esc_html($width); ?>;
                border-radius: <?php echo esc_html($border_radius); ?>;
                background: <?php echo esc_html($background); ?>;
            }

            <?php echo esc_html(".$uid") ?>.h5ap_single_button svg {
                height: <?php echo esc_html($font_size); ?>;
                width: <?php echo esc_html($font_size); ?>;
                fill: <?php echo esc_html($color); ?>;
            }
        </style>
        <span id="h5ap_single_button" class="h5ap_single_button <?php echo esc_attr($uid);  ?>">
            <audio>
                <source src="<?php echo esc_attr($file); ?>" type="audio/<?php echo esc_attr(pathinfo($file, PATHINFO_EXTENSION) === 'm4a' ? 'mp4' : 'mp3') ?>" />
            </audio>
            <span class='play'><svg viewBox='0 0 163.861 163.861'>
                    <path d='M34.857,3.613C20.084-4.861,8.107,2.081,8.107,19.106v125.637c0,17.042,11.977,23.975,26.75,15.509L144.67,97.275 c14.778-8.477,14.778-22.211,0-30.686L34.857,3.613z' />
                </svg></span><span class='pause h5ap_svg_hidden'><svg version='1.1' viewBox='0 0 47.607 47.607'>
                    <path d='M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0 l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z' />
                    <path d='M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631 C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z' />
                </svg></span>
        </span>

        <?php $output = ob_get_clean();
        return $output; ?>
<?php
    }

    function audio_player_attrs()
    {
        return array(
            'id' => null,
            'file' => null,
            'src' => null,
            'width' => null,
            'controls' => null,
            'skin' => 'Default',
            'preload' => null,
            'repeat' => null,
            'start_time' => 0,
        );
    }
}
