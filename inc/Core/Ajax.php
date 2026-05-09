<?php

namespace H5APPlayer\Core;

if (!defined('ABSPATH')) {
    exit;
}


class Ajax
{
    public function __construct()
    {
        add_action('wp_ajax_h5ap_get_stream_data', [$this, 'getStreamData']);
        add_action('wp_ajax_nopriv_h5ap_get_stream_data', [$this, 'getStreamData']);

        add_action('wp_ajax_h5apSaveUninstallOption', [$this, 'saveUninstallOption']);
    }

    public function getStreamData()  {
        $nonce = sanitize_text_field(wp_unslash($_POST['nonce']));

        if (!wp_verify_nonce($nonce, 'h5ap_radio_player_rest')) {
            wp_send_json_error('Invalid nonce');
        }

        $streamUrl = sanitize_url(wp_unslash($_POST['url']));

        $settings = get_option('h5ap_settings', []);
        $allowed_domains = isset($settings['white_listed_stream_url']) ? $settings['white_listed_stream_url'] : [];
        $allowed_domains = array_map(function($item){
            return $item['url'];
        }, $allowed_domains);

        if(!\H5APPlayer\Helper\Functions::isDomainAllowed($streamUrl, $allowed_domains)){
            wp_send_json_error('Domain not allowed');
        }

        $stream = new Stream();
        $streamData = $stream->getStreamData($streamUrl);

        if ($streamData) {
            wp_send_json_success($streamData);
        }

        wp_send_json_success($streamUrl);
    }

    public function saveUninstallOption() {
        // Verify nonce.
        $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
        if ( ! wp_verify_nonce( $nonce, 'h5ap_uninstall_nonce' ) ) {
            wp_send_json_error( 'Invalid nonce.' );
        }

        // Only admins can change this setting.
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Insufficient permissions.' );
        }

        $enabled = isset( $_POST['enabled'] ) && sanitize_text_field( wp_unslash( $_POST['enabled'] ) ) === 'true';

        update_option( 'h5ap_delete_data_on_uninstall', $enabled );

        wp_send_json_success( [
            'enabled' => $enabled,
            'message' => $enabled
                ? __( 'Setting saved. Data will be deleted on uninstall.', 'h5ap' )
                : __( 'Setting saved. Data will be preserved on uninstall.', 'h5ap' ),
        ] );
    }
}