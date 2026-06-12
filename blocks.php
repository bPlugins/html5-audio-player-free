<?php
if (!defined('ABSPATH')) {
    return;
}

use H5APPlayer\Helper\Functions;

if (!class_exists('H5AP_Block')) {
    class H5AP_Block
    {
        function __construct()
        {
            add_action('init', [$this, 'init']);
            add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
        }

        function enqueue_block_editor_assets()
        {
            wp_localize_script('h5ap-audioplayer-editor-script', 'h5apPlayer', [
                'speed' => explode(',', Functions::getSetting('speed', '0.5, 1, 1.5, 2.0, 2.5')),
                'multipleAudio' => (bool) Functions::getSetting('multipleAudio', false),
                'plyrio_js' => H5AP_PRO_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js',
                'plyr_js' => H5AP_PRO_PLUGIN_DIR . 'build/player.js',
                'isPipe' => false,
                'ajaxUrl' => admin_url('admin-ajax.php')
            ]);
        }

        function enqueue_block_assets()
        {
            // plyrio library 
            wp_register_script('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array(), '3.7.2', false);
            wp_register_style('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), '3.7.2', 'all');
        }

        function init() {
            register_block_type(__DIR__ . '/build/blocks/audioplayer');
            register_block_type(__DIR__ . '/build/blocks/audioplaylist');
            register_block_type(__DIR__ . '/build/blocks/radio-player');
        }
    }

    new H5AP_Block();
}
