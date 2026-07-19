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
        // Public read-only endpoint, bypassing nonce check to support static/page caching plugins.

        $streamUrl = isset($_POST['url']) ? sanitize_url(wp_unslash($_POST['url'])) : '';

        // Skip fetching stream metadata for Google Drive, SoundCloud, and static files
        $lower_url = strtolower($streamUrl);
        if (
            strpos($lower_url, 'drive.google.com') !== false ||
            strpos($lower_url, 'docs.google.com') !== false ||
            strpos($lower_url, 'googleapis.com') !== false ||
            strpos($lower_url, 'soundcloud.com') !== false ||
            preg_match('/\.(mp3|wav|m4a|ogg|aac|m3u8)(?:\?.*)?$/i', $lower_url)
        ) {
            wp_send_json_success(['trackTitle' => '']);
        }

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
     * Checks if the host is a valid Google Drive API or CDN domain.
     *
     * @param string $host
     * @return bool
     */
    private static function isAllowedGDriveHost($host) {
        $host = strtolower($host);
        if ($host === 'googleapis.com' || $host === 'www.googleapis.com') {
            return true;
        }
        // Allow Google Drive direct-download / sharing domains.
        if (
            $host === 'docs.google.com' ||
            $host === 'drive.google.com' ||
            $host === 'drive.usercontent.google.com'
        ) {
            return true;
        }
        // Allow Google Drive CDN / User Content domains (e.g. *.googleusercontent.com)
        if ($host === 'googleusercontent.com' || substr($host, -22) === '.googleusercontent.com') {
            return true;
        }
        return false;
    }

    /**
     * Resolves a relative URL against a base URL.
     *
     * @param string $base
     * @param string $relative
     * @return string
     */
    private static function resolveRelativeUrl($base, $relative) {
        $pbase = wp_parse_url($base);
        if (empty($pbase)) {
            return $relative;
        }
        $scheme = isset($pbase['scheme']) ? $pbase['scheme'] . '://' : 'https://';
        $host = isset($pbase['host']) ? $pbase['host'] : '';
        
        if (strpos($relative, '//') === 0) {
            return $scheme . substr($relative, 2);
        }
        if (strpos($relative, '/') === 0) {
            return $scheme . $host . $relative;
        }
        
        $path = isset($pbase['path']) ? $pbase['path'] : '';
        $dir = dirname($path);
        if ($dir === '/' || $dir === '\\') {
            $dir = '';
        }
        return $scheme . $host . $dir . '/' . $relative;
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

        // Handle OPTIONS request for CORS (before cURL or session handling)
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
            header('Access-Control-Allow-Headers: Range');
            exit;
        }

        // Close session once before the loop to prevent session locking (which blocks subsequent requests)
        if (session_id()) {
            session_write_close();
        }

        $current_url = $url;
        $max_redirects = 5;
        $redirect_count = 0;

        // phpcs:disable WordPress.WP.AlternativeFunctions
        while ($redirect_count < $max_redirects) {
            $parsed = wp_parse_url($current_url);
            $host   = isset($parsed['host']) ? strtolower($parsed['host']) : '';

            // Security check on every redirect hop
            if ($redirect_count === 0) {
                // First hop must be either a googleapis.com/drive API URL or a
                // Google Drive direct-download URL (docs.google.com/uc | drive.google.com/uc).
                $path = isset($parsed['path']) ? $parsed['path'] : '';
                $is_api_url = ($host === 'www.googleapis.com' || $host === 'googleapis.com') && strpos($path, '/drive/') === 0;
                $is_direct_url = ($host === 'docs.google.com' || $host === 'drive.google.com') && strpos($path, '/uc') === 0;
                if (!$is_api_url && !$is_direct_url) {
                    status_header(403);
                    exit('Only Google Drive / Google APIs URLs are allowed.');
                }
            } else {
                // Subsequent redirects must be googleusercontent.com or googleapis.com
                if (!self::isAllowedGDriveHost($host)) {
                    status_header(403);
                    exit('Redirect to an unauthorized host: ' . esc_html($host));
                }
            }

            // Forward Range header for seek support
            $request_headers = [];
            if (isset($_SERVER['HTTP_RANGE'])) {
                $request_headers[] = 'Range: ' . sanitize_text_field(wp_unslash($_SERVER['HTTP_RANGE']));
            }

            $ch = curl_init($current_url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // Handle manually!
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $status_code = 200;
            $redirect_url = '';
            $content_type_verified = false;
            $is_audio = false;

            // Pass through headers
            curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$status_code, &$redirect_url, &$content_type_verified, &$is_audio) {
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

                // If we are currently in a redirect response, capture Location header and ignore others
                if ($status_code >= 300 && $status_code < 400) {
                    if (strpos($header_lower, 'location:') === 0) {
                        $redirect_url = trim(substr($header, 9));
                    }
                    return strlen($header);
                }

                // Verify content type for 200/206 status codes
                if ($status_code === 200 || $status_code === 206) {
                    if (strpos($header_lower, 'content-type:') === 0) {
                        $content_type = trim(substr($header, 13));
                        $content_type_verified = true;
                        
                        // Validate MIME type starts with audio/
                        if (strpos(strtolower($content_type), 'audio/') === 0) {
                            $is_audio = true;
                            // Send custom headers to secure the audio download
                            header('Content-Type: ' . $content_type);
                            header('X-Content-Type-Options: nosniff');
                            header('Content-Disposition: inline');
                        }
                    }
                    
                    // Only forward specific safe headers to the browser if we know it's audio
                    if ($is_audio) {
                        if (
                            strpos($header_lower, 'content-length:') === 0 ||
                            strpos($header_lower, 'content-range:') === 0 ||
                            strpos($header_lower, 'accept-ranges:') === 0
                        ) {
                            header($trimmed_header);
                        }
                    }
                }
                
                return strlen($header);
            });

            // Pass through body chunks immediately
            curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) use (&$status_code, &$content_type_verified, &$is_audio) {
                // Ignore redirect bodies to prevent flushing headers prematurely
                if ($status_code >= 300 && $status_code < 400) {
                    return strlen($data);
                }

                // Abort if we have parsed headers but the file isn't audio
                if ($content_type_verified && !$is_audio) {
                    return 0; // Aborts cURL execution
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
            
            $curl_error = curl_errno($ch);
            $curl_error_msg = curl_error($ch);
            curl_close($ch);

            // If it is a redirect, follow manually
            if ($status_code >= 300 && $status_code < 400 && !empty($redirect_url)) {
                if (strpos($redirect_url, 'https://') === 0 || strpos($redirect_url, 'http://') === 0) {
                    $current_url = $redirect_url;
                } else {
                    $current_url = self::resolveRelativeUrl($current_url, $redirect_url);
                }
                $redirect_count++;
                continue;
            }

            if ($curl_error) {
                // If we aborted intentionally due to content-type verification failing, curl_exec will return CURLE_WRITE_ERROR (23)
                if ($curl_error === 23 && $content_type_verified && !$is_audio) {
                    status_header(403);
                    exit('Access denied: The requested file is not a valid audio format.');
                }
                status_header(502);
                exit('Proxy Error: ' . esc_html($curl_error_msg));
            }

            // Fallback safety check: if we somehow finished without content-type verification succeeding or it wasn't audio
            if (!$content_type_verified || !$is_audio) {
                status_header(403);
                exit('Access denied: The requested file is not a valid audio format.');
            }

            // Exit successfully since transfer has finished
            exit;
        }
        // phpcs:enable WordPress.WP.AlternativeFunctions

        // If we exceeded max redirects
        status_header(508);
        exit('Too many redirects.');
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