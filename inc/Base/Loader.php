<?php

namespace H5APPlayer\Base;

class Loader
{

    public function register()
    {
        add_action('wp_head', [$this, 'loadAssets']);
    }

    public function loadAssets()
    {
?>
        <script>
            function h5vpLoader({
                id,
                source,
                type
            }) {
                const element = document.getElementById(id);
                if (!element && !window.srcLoaded) {
                    if (type === 'script') {
                        const script = document.createElement('script');
                        script.src = `<?php echo esc_url(H5AP_PRO_PLUGIN_DIR) ?>${source}`;
                        script.id = id;
                        document.getElementsByTagName("head")[0].appendChild(script);
                    }
                    if (type === 'css') {
                        const link = document.createElement('link');
                        link.href = `<?php echo esc_url(H5AP_PRO_PLUGIN_DIR) ?>${source}`;
                        link.rel = 'stylesheet';
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                }
            }

            function loadHVPAssets() {
                const assets = [{
                        id: 'h5ap-public-css',
                        source: 'assets/css/style.css',
                        type: 'css'
                    },
                    {
                        id: 'bplugins-plyrio-css',
                        source: 'assets/css/plyr-v3.7.2.css',
                        type: 'css'
                    },
                    {
                        id: 'bplugins-plyrio-js',
                        source: 'assets/js/plyr-v3.7.2.js',
                        type: 'script'
                    },
                    {
                        id: 'h5ap-player-js',
                        source: 'dist/player.js',
                        type: 'script'
                    },
                ];

                if (typeof hpublic === 'undefined') {
                    const script = document.createElement('script');
                    script.innerText = `var hpublic = {siteUrl: '<?php echo esc_url(site_url()) ?>', userId: <?php echo esc_html(get_current_user_id()) ?>}`;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                assets.map(item => h5vpLoader(item));
            }
            document.addEventListener('DOMContentLoaded', function() {
                const isPlayer = document.querySelector(".h5ap_player");
                if (isPlayer) {
                    loadHVPAssets();
                }
            })
        </script>
<?php
    }
}
