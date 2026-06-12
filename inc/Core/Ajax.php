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

        // Google Drive audio proxy — allows browser to stream googleapis.com/drive audio
        add_action('wp_ajax_h5ap_gdrive_proxy', [$this, 'gDriveProxy']);
        add_action('wp_ajax_nopriv_h5ap_gdrive_proxy', [$this, 'gDriveProxy']);

        // SoundCloud audio stream redirect proxy
        add_action('wp_ajax_h5ap_soundcloud_stream', [$this, 'soundcloudStream']);
        add_action('wp_ajax_nopriv_h5ap_soundcloud_stream', [$this, 'soundcloudStream']);
    }

    public function getStreamData()  {
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

        if (!wp_verify_nonce($nonce, 'h5ap_radio_player_rest')) {
            wp_send_json_error('Invalid nonce');
        }

        $streamUrl = isset($_POST['url']) ? sanitize_url(wp_unslash($_POST['url'])) : '';

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
                ? __( 'Setting saved. Data will be deleted on uninstall.', 'html5-audio-player' )
                : __( 'Setting saved. Data will be preserved on uninstall.', 'html5-audio-player' ),
        ] );
    }

     /**
     * Google Drive Audio Proxy
     *
     * Streams googleapis.com/drive audio through WordPress server so browsers
     * can load audio metadata (duration) and seek correctly.
     * Only accepts URLs from googleapis.com/drive — all others are rejected.
     */
    public function gDriveProxy() {
        // Only allow googleapis.com/drive URLs — block everything else
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $url = isset($_GET['url']) ? esc_url_raw(wp_unslash($_GET['url'])) : '';
        $url = html_entity_decode($url); // Fix user pasted &amp; instead of &

        if (empty($url)) {
            status_header(400);
            exit('Missing URL parameter.');
        }

        $parsed = wp_parse_url($url);
        $host   = isset($parsed['host']) ? strtolower($parsed['host']) : '';
        $path   = isset($parsed['path']) ? $parsed['path'] : '';

        // Security: only proxy googleapis.com/drive paths
        if ($host !== 'www.googleapis.com' && $host !== 'googleapis.com') {
            status_header(403);
            exit('Only googleapis.com URLs are allowed.');
        }

        if (strpos($path, '/drive/') !== 0) {
            status_header(403);
            exit('Only Google Drive API paths are allowed.');
        }

        // Handle OPTIONS request for CORS
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
            header('Access-Control-Allow-Headers: Range');
            exit;
        }

        // Close session to prevent blocking other requests
        session_write_close();

        // Forward Range header for seek support
        $request_headers = [];
        if (isset($_SERVER['HTTP_RANGE'])) {
            $request_headers[] = 'Range: ' . sanitize_text_field(wp_unslash($_SERVER['HTTP_RANGE']));
        }

        // phpcs:disable WordPress.WP.AlternativeFunctions
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        // Close the session to prevent session locking (which blocks subsequent requests)
        if (session_id()) {
            session_write_close();
        }

        $status_code = 200; // Track current HTTP status

        // Pass through headers
        curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$status_code) {
            $header_lower = strtolower($header);
            $trimmed_header = trim($header);
            
            if (empty($trimmed_header)) {
                return strlen($header);
            }

            // Parse HTTP status code
            if (strpos($header_lower, 'http/') === 0) {
                $parts = explode(' ', $trimmed_header, 3);
                if (count($parts) >= 2) {
                    $status_code = (int) $parts[1];
                    // Only send status header if it's NOT a redirect
                    if ($status_code < 300 || $status_code >= 400) {
                        status_header($status_code);
                    }
                }
                return strlen($header);
            }

            // If we are currently in a redirect response, ignore all headers
            if ($status_code >= 300 && $status_code < 400) {
                return strlen($header);
            }

            // Only forward specific headers to the browser
            if (
                strpos($header_lower, 'content-type:') === 0 ||
                strpos($header_lower, 'content-length:') === 0 ||
                strpos($header_lower, 'content-range:') === 0 ||
                strpos($header_lower, 'accept-ranges:') === 0
            ) {
                header($trimmed_header);
            }
            
            return strlen($header);
        });

        // Pass through body chunks immediately
        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) use (&$status_code) {
            // Ignore redirect bodies to prevent flushing headers prematurely
            if ($status_code >= 300 && $status_code < 400) {
                return strlen($data);
            }
            
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo $data;
            flush();
            ob_flush(); // Ensure output buffers are also flushed
            
            // If the browser closed the connection, abort the cURL download immediately
            if (connection_aborted()) {
                return 0; // Returning 0 causes cURL to abort the transfer
            }

            return strlen($data);
        });

        // Add explicit CORS and Accept-Ranges headers
        header('Access-Control-Allow-Origin: *');
        header('Accept-Ranges: bytes');

        curl_exec($ch);
        
        if(curl_errno($ch)) {
            status_header(502);
            echo esc_html('Proxy Error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        // phpcs:enable WordPress.WP.AlternativeFunctions
        exit;
    }

    /**
     * SoundCloud Stream Proxy
     *
     * Resolves soundcloud track page URL to progressive stream URL and redirects 302
     * to the direct temporary CDN mp3 stream URL.
     */
    public function soundcloudStream() {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $url = isset($_GET['sc_url']) ? esc_url_raw(wp_unslash($_GET['sc_url'])) : '';
        $url = html_entity_decode($url);

        if (empty($url)) {
            status_header(400);
            exit('Missing sc_url parameter.');
        }


        // Restrict proxy to soundcloud domains only for security
        $parsed = wp_parse_url($url);
        $host   = isset($parsed['host']) ? strtolower($parsed['host']) : '';
        if (strpos($host, 'soundcloud.com') === false) {
            status_header(403);
            exit('Only soundcloud.com URLs are allowed.');
        }

        // Handle OPTIONS request for CORS (if any)
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, OPTIONS');
            exit;
        }

        // Close session if open to prevent blocking other concurrent requests
        if (session_id()) {
            session_write_close();
        }

        $cache_key = 'h5ap_sc_prog_url_' . md5($url);
        $prog_url = get_transient($cache_key);
        $client_id = h5ap_get_soundcloud_client_id();

        if (empty($prog_url)) {
            $resolve_url = 'https://api-v2.soundcloud.com/resolve?url=' . urlencode($url) . '&client_id=' . $client_id;
            $response = wp_safe_remote_get($resolve_url, [
                'timeout'    => 15,
                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            ]);

            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code === 401 || $response_code === 403) {
                delete_transient('h5ap_soundcloud_client_id');
                $client_id = h5ap_get_soundcloud_client_id();
                $resolve_url = 'https://api-v2.soundcloud.com/resolve?url=' . urlencode($url) . '&client_id=' . $client_id;
                $response = wp_safe_remote_get($resolve_url, [
                    'timeout'    => 15,
                    'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                ]);
            }

            if (!is_wp_error($response)) {
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);
                if (isset($data['media']['transcodings']) && is_array($data['media']['transcodings'])) {
                    foreach ($data['media']['transcodings'] as $transcoding) {
                        if (isset($transcoding['format']['protocol']) && $transcoding['format']['protocol'] === 'progressive') {
                            $prog_url = $transcoding['url'];
                            break;
                        }
                    }
                }

                if (!empty($prog_url)) {
                    set_transient($cache_key, $prog_url, 30 * DAY_IN_SECONDS);
                }
            }
        }

        if (empty($prog_url)) {
            status_header(404);
            exit('Could not resolve progressive stream for this URL.');
        }

        // Now fetch the actual CDN URL
        $stream_url = $prog_url . '?client_id=' . $client_id;
        $response = wp_safe_remote_get($stream_url, [
            'timeout'    => 15,
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        ]);

        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code === 401 || $response_code === 403) {
            // client_id might be expired/invalid. Delete cache and fetch new client_id.
            delete_transient('h5ap_soundcloud_client_id');
            $client_id = h5ap_get_soundcloud_client_id();
            
            $stream_url = $prog_url . '?client_id=' . $client_id;
            $response = wp_safe_remote_get($stream_url, [
                'timeout'    => 15,
                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            ]);
        }

        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $stream_data = json_decode($body, true);
            if (isset($stream_data['url'])) {
                $cdn_url = $stream_data['url'];
                header('Access-Control-Allow-Origin: *');
                header('Location: ' . $cdn_url, true, 302);
                exit;
            }
        }

        status_header(502);
        exit('Failed to fetch CDN streaming URL from SoundCloud.');
    }
}