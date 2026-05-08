<?php

namespace H5APPlayer\Base;

class GlobalAction
{

    public function register()
    {
        add_action('wp_head', [$this, 'css_for_player']);
        add_action('wp_footer', [$this, 'wp_footer']);
    }

    public function css_for_player()
    {
        $settings = h5ap_get_settings('h5ap_settings', []);
        $dimention = $settings('dimention', ['unit' => 'px', 'width' => '50']);
        $s_unit = isset($dimention['unit']) ? $dimention['unit'] : 'px';
        $s_width = isset($dimention['width']) ? $dimention['width'] : '50';
?>
        <style>
            .mejs-container:has(.plyr) {
                height: auto;
                background: transparent
            }

            .mejs-container:has(.plyr) .mejs-controls {
                display: none
            }

            .h5ap_all {
                --shadow-color: 197deg 32% 65%;
                border-radius: 6px;
                box-shadow: 0px 0px 9.6px hsl(var(--shadow-color)/.36), 0 1.7px 1.9px 0px hsl(var(--shadow-color)/.36), 0 4.3px 1.8px -1.7px hsl(var(--shadow-color)/.36), -0.1px 10.6px 11.9px -2.5px hsl(var(--shadow-color)/.36);
                margin: 16px auto;
            }

            .h5ap_single_button {
                height: <?php echo esc_attr($s_width . $s_unit) ?>;
            }
        </style>
    <?php
    }

    function wp_footer()
    {
    ?>
        <script>
            function isOldIOSDevice() {
                const userAgent = navigator.userAgent || navigator.vendor || window.opera;

                // Check if it's an iOS device
                const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

                if (!isIOS) return false;

                // Extract iOS version from userAgent
                const match = userAgent.match(/OS (\d+)_/);
                if (match && match.length > 1) {
                    const majorVersion = parseInt(match[1], 10);

                    // Example: Consider iOS 12 and below as old
                    return majorVersion <= 12;
                }

                // If version not found, assume not old
                return false;
            }
            if (isOldIOSDevice()) {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        document.querySelectorAll('audio:not(.plyr audio)').forEach(function(audio, index) {
                            audio.setAttribute('controls', '')
                        });
                    }, 3000);
                });
            }
            // ios old devices
        </script>
<?php
    }
}
