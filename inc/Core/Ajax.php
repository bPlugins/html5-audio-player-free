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
    }

    public function getStreamData()
    {
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
}