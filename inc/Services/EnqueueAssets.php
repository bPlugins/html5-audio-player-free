<?php

namespace H5APPlayer\Services;

use H5APPlayer\Helper\LocalizeScript;
use H5APPlayer\Helper\Functions;

class EnqueueAssets
{
    protected static $_instance = null;

    /**
     * construct function
     */
    public function register()
    {
        add_action("wp_enqueue_scripts", [$this, 'publicAssets']);
        add_action("admin_enqueue_scripts", [$this, 'adminAssets']);
    }

    /**
     * Create instance function
     */
    public static function instance()
    {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Public Assets
     */
    public function publicAssets() {
        wp_enqueue_style('h5ap-public', H5AP_PLUGIN_DIR . 'assets/css/style.css', array(), H5AP_VERSION);
        wp_register_script('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array('jquery'), H5AP_VERSION, false);

        wp_register_script('h5ap-all', H5AP_PLUGIN_DIR . 'build/h5ap-all.js', array(), H5AP_VERSION, true);

        wp_enqueue_style('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), H5AP_VERSION, 'all');

        $h5ap_settings = [
            'speed' => explode(',', Functions::getSetting('speed', '0.5, 1, 1.5, 2.0, 2.5')),
            'multipleAudio' => (bool) Functions::getSetting('multipleAudio', false),
            'lazyLoad' => (bool) Functions::getSetting('h5ap_lazy_load', false),
            'plyrio_js' => H5AP_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js',
            'plyrio_css' => H5AP_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css',
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'options' => [
                'controls' => Functions::getSetting('h5ap_controls', []),
                'preload' => Functions::getSetting('h5ap_preload', 'metadata'),
                'seekTime' => (int) Functions::getSetting('h5ap_seektime', 10),
                'loop' => ['active' => Functions::getSetting('h5ap_repeat', false) === '1'],
            ]
        ];

        wp_localize_script('h5ap-all', 'h5apPlayer', $h5ap_settings);
        wp_localize_script('h5ap-all', 'h5apAll', $h5ap_settings);
        // Also expose on the Plyr library script so window.h5apPlayer.ajaxUrl
        // (used to build the Google Drive proxy URL) is available wherever Plyr loads.
        wp_localize_script('bplugins-plyrio', 'h5apPlayer', $h5ap_settings);

    }

    /**
     * Admin Assets
     */
    public function adminAssets($screen) {
        $current_screen = get_current_screen();

        // Enqueue custom sidebar navigation menu styles globally in admin
        $menu_css_path = dirname(dirname(__DIR__)) . '/assets/css/admin-menu.css';
        $menu_css_version = file_exists($menu_css_path) ? filemtime($menu_css_path) . '-' . time() : H5AP_VERSION;
        wp_enqueue_style('h5ap-admin-menu', H5AP_PLUGIN_DIR . 'assets/css/admin-menu.css', array(), $menu_css_version);

        // Menu colour theme on top of admin-menu.css. Return false from this filter (or delete the file) to get the previous look back.
        $menu_theme_path = dirname(dirname(__DIR__)) . '/assets/css/admin-menu-theme.css';
        if (apply_filters('h5ap_admin_menu_theme', true) && file_exists($menu_theme_path)) {
            wp_enqueue_style('h5ap-admin-menu-theme', H5AP_PLUGIN_DIR . 'assets/css/admin-menu-theme.css', array('h5ap-admin-menu'), filemtime($menu_theme_path));
        }

        if (strpos($screen, 'html5-audio-player') !== false || (isset($current_screen->post_type) && ($current_screen->post_type === 'audioplayer' || $current_screen->post_type === 'radioplayer')) || $screen === 'plugins.php') {
            wp_enqueue_style('h5ap-admin', H5AP_PLUGIN_DIR . 'assets/css/style.css', array(), H5AP_VERSION);
            
            // player assets for preview and sticky player logic
            wp_enqueue_style('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), H5AP_VERSION);
            wp_enqueue_style('h5ap-player', H5AP_PLUGIN_DIR . 'build/player.css', array(), H5AP_VERSION);

            wp_enqueue_script('h5ap-admin',  H5AP_PLUGIN_DIR . 'build/admin.js', array('jquery'), H5AP_VERSION, true);
            wp_enqueue_script('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array('jquery'), H5AP_VERSION, false);
            wp_enqueue_script('h5ap-player', H5AP_PLUGIN_DIR . 'build/player.js', array('jquery', 'bplugins-plyrio'), H5AP_VERSION, true);

            wp_localize_script('h5ap-admin', 'h5apAdmin', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'website' => site_url()
            ));

            // Expose player settings (incl. ajaxUrl) on the admin player/Plyr scripts so the
            // CPT (dashboard) preview can build the Google Drive proxy URL just like the frontend.
            $h5ap_admin_player_settings = [
                'speed' => explode(',', Functions::getSetting('speed', '0.5, 1, 1.5, 2.0, 2.5')),
                'multipleAudio' => (bool) Functions::getSetting('multipleAudio', false),
                'lazyLoad' => (bool) Functions::getSetting('h5ap_lazy_load', false),
                'ajaxUrl' => admin_url('admin-ajax.php'),
            ];
            wp_localize_script('bplugins-plyrio', 'h5apPlayer', $h5ap_admin_player_settings);
            wp_localize_script('h5ap-player', 'h5apPlayer', $h5ap_admin_player_settings);
            wp_enqueue_style('h5ap-help', H5AP_PLUGIN_DIR . 'admin/css/style.css', array(), H5AP_VERSION);
        }

        if ('settings_page_html5ap_settings' == $screen) {
            $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/css'));
            wp_localize_script('jquery', 'cm_settings', $cm_settings);
            wp_enqueue_script('wp-theme-plugin-editor');
            wp_enqueue_style('wp-codemirror');
        }

        // Shortcode chip with copy button: player/radio lists and the player edit screen.
        $is_player_screen = isset($current_screen->post_type) && ($current_screen->post_type === 'audioplayer' || $current_screen->post_type === 'radioplayer');
        if ($is_player_screen && in_array($screen, array('edit.php', 'post.php', 'post-new.php'), true)) {
            $plugin_path = dirname(dirname(__DIR__));
            $chip_css = $plugin_path . '/assets/css/shortcode-chip.css';
            $chip_js = $plugin_path . '/assets/js/shortcode-chip.js';
            wp_enqueue_style('h5ap-shortcode-chip', H5AP_PLUGIN_DIR . 'assets/css/shortcode-chip.css', array(), file_exists($chip_css) ? filemtime($chip_css) : H5AP_VERSION);
            wp_enqueue_script('h5ap-shortcode-chip', H5AP_PLUGIN_DIR . 'assets/js/shortcode-chip.js', array(), file_exists($chip_js) ? filemtime($chip_js) : H5AP_VERSION, true);
        }

        $settings = get_option('h5ap_settings', []);

        wp_localize_script('h5ap-audioplayer-editor-script', 'h5apEditor', [
            'color' => [
                'primary' => $settings['h5ap_primary_color'] ?? '#4a5464',
                'bg' => $settings['h5ap_background_color'] ?? '#EEEEEE',
            ]
        ]);
    }

}
