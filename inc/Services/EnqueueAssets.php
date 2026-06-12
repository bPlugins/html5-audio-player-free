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
        wp_enqueue_style('h5ap-public', H5AP_PRO_PLUGIN_DIR . 'assets/css/style.css', array(), H5AP_PRO_VERSION);
        wp_register_script('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array('jquery'), H5AP_PRO_VERSION, false);

        wp_register_script('h5ap-all', H5AP_PRO_PLUGIN_DIR . 'build/h5ap-all.js', array(), H5AP_PRO_VERSION, true);

        wp_register_style('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), H5AP_PRO_VERSION, 'all');

        wp_localize_script('h5ap-all', 'h5apAll', [
            'speed' => explode(',', Functions::getSetting('speed', '0.5, 1, 1.5, 2.0, 2.5')),
            'multipleAudio' => (bool) Functions::getSetting('multipleAudio', false),
            'plyrio_js' => H5AP_PRO_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js',
            'plyrio_css' => H5AP_PRO_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css',
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'options' => [
                'controls' => Functions::getSetting('h5ap_controls', []),
                'preload' => Functions::getSetting('h5ap_preload', 'metadata'),
                'seekTime' => (int) Functions::getSetting('h5ap_seektime', 10),
                'loop' => ['active' => Functions::getSetting('h5ap_repeat', false) === '1'],
            ]
        ]);

    }

    /**
     * Admin Assets
     */
    public function adminAssets($screen) {
        $current_screen = get_current_screen();

        if (strpos($screen, 'html5-audio-player') !== false || $current_screen->post_type === 'audioplayer' || $current_screen->post_type === 'radioplayer' || $screen === 'plugins.php') {
            wp_enqueue_style('h5ap-admin', H5AP_PRO_PLUGIN_DIR . 'assets/css/style.css', array(), H5AP_PRO_VERSION);
            
            // player assets for preview and sticky player logic
            wp_enqueue_style('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), H5AP_PRO_VERSION);
            wp_enqueue_style('h5ap-player', H5AP_PRO_PLUGIN_DIR . 'build/player.css', array(), H5AP_PRO_VERSION);

            wp_enqueue_script('h5ap-admin',  H5AP_PRO_PLUGIN_DIR . 'build/admin.js', array('jquery'), H5AP_PRO_VERSION, true);
            wp_enqueue_script('bplugins-plyrio', H5AP_PRO_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array('jquery'), H5AP_PRO_VERSION, false);
            wp_enqueue_script('h5ap-player', H5AP_PRO_PLUGIN_DIR . 'build/player.js', array('jquery', 'bplugins-plyrio'), H5AP_PRO_VERSION, true);

            wp_localize_script('h5ap-admin', 'h5apAdmin', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'website' => site_url()
            ));
            wp_enqueue_style('h5ap-help', H5AP_PRO_PLUGIN_DIR . 'admin/css/style.css', array(), H5AP_PRO_VERSION);
        }

        if ('settings_page_html5ap_settings' == $screen) {
            $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/css'));
            wp_localize_script('jquery', 'cm_settings', $cm_settings);
            wp_enqueue_script('wp-theme-plugin-editor');
            wp_enqueue_style('wp-codemirror');
        }

        // clipboard start
        global $post;
		if ($screen === 'post.php' || $screen === 'post-new.php') {
			if (isset($post) && $post->post_type === 'audioplayer') {
				wp_add_inline_script('jquery-core', "
                    document.addEventListener('click', function(e){
                        var el = e.target.closest('.shortcode_copy');
                        if(!el) return;

                        if (navigator.clipboard && window.isSecureContext) {
                            navigator.clipboard.writeText(el.dataset.code);
                        } else {
                            var textArea = document.createElement('textarea');
                            textArea.value = el.dataset.code;
                            textArea.style.position = 'absolute';
                            textArea.style.left = '-999999px';
                            document.body.prepend(textArea);
                            textArea.select();
                            try {
                                document.execCommand('copy');
                            } catch (error) {
                                console.error(error);
                            } finally {
                                textArea.remove();
                            }
                        }

                        var original = el.innerHTML;
                        el.innerHTML = 'Copied!';
                        setTimeout(function(){
                            el.innerHTML = original;
                        }, 1000);
                    });
                ");
			}
		}
        // clipboard end

        $settings = get_option('h5ap_settings', []);

        wp_localize_script('h5ap-audioplayer-editor-script', 'h5apEditor', [
            'color' => [
                'primary' => $settings['h5ap_primary_color'] ?? '#4a5464',
                'bg' => $settings['h5ap_background_color'] ?? '#EEEEEE',
            ]
        ]);
    }

}
