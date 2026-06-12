<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if (!function_exists('h5ap_register_taxonomy')) {
    function h5ap_register_taxonomy($slug, $post_type, $is_hierarchical, $title)
    {
        $plural = $title === 'Category' ? 'Categories' : $title . 's';
        register_taxonomy(
            $slug,
            $post_type,
            array(
                'labels' => array(
                    'name' => $plural,
                    'singular_name' => $title,
                    'search_items' => "Search " . $plural,
                    'all_items' => "All " . $plural,
                    'edit_item' => "Edit $title",
                    'update_item' => "Update $title",
                    'add_new_item' => "Add New $title",
                    'new_item_name' => "New $title Name",
                    'menu_name' =>  $plural
                ),
                'hierarchical' => $is_hierarchical,
                'show_ui' => true,
                'show_admin_column' => true,
                'query_var' => true,
                'rewrite' => array('slug' => $slug),
                'show_in_rest' => true
            )
        );
    }
}


if (!function_exists('h5ap_get_audio_type')) {
    function h5ap_get_audio_type($src)
    {
        $ext = pathinfo($src, PATHINFO_EXTENSION);
        if ($ext === 'm4a') {
            return 'audio/mp4';
        }
        return "audio/$ext";
    }
}

if (!function_exists('h5ap_get_post_meta')) {
    function h5ap_get_post_meta($id, $key)
    {
        $meta = get_post_meta($id, $key, true);
        return function ($key, $default = null, $isBoolean = false, $key2 = null) use (&$meta) {
            //If $key2 is provided, check for nested key
            if ($key2 !== null) {
                if (isset($meta[$key][$key2])) {
                    return $isBoolean ? (bool) $meta[$key][$key2] : $meta[$key][$key2];
                }
                return $default;
            }

            // If only $key is provided, check in $meta
            if (isset($meta[$key])) {
                return $isBoolean ? (bool) $meta[$key] : $meta[$key];
            }

            return $default;
        };
    }
}

if (!function_exists('h5ap_get_settings')) {
    function h5ap_get_settings($key, $default = null)
    {
        $settings = get_option($key, $default);
        return function ($key, $default = null) use (&$settings) {
            if (isset($settings[$key])) {
                return $settings[$key];
            }
            return $default;
        };
    }
}

if (!function_exists('h5ap_get_soundcloud_client_id')) {
    function h5ap_get_soundcloud_client_id()
    {
        $cached_client_id = get_transient('h5ap_soundcloud_client_id');
        if ($cached_client_id) {
            return $cached_client_id;
        }

        $fallback_client_id = 'tUy37JutyVy6r6JSMLnScSmBwA5DoTXE';
        $homepage_url = 'https://soundcloud.com';
        $response = wp_safe_remote_get($homepage_url, [
            'timeout'    => 10,
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        ]);

        if (is_wp_error($response)) {
            return $fallback_client_id;
        }

        $html = wp_remote_retrieve_body($response);
        if (empty($html)) {
            return $fallback_client_id;
        }

        // Find script tags
        preg_match_all('/<script[^>]+src="([^"]+)"/i', $html, $matches);
        $scripts = isset($matches[1]) ? $matches[1] : [];

        // Sort to prioritize scripts with 'assets/'
        usort($scripts, function($a, $b) {
            $a_asset = strpos($a, 'assets/') !== false;
            $b_asset = strpos($b, 'assets/') !== false;
            if ($a_asset && !$b_asset) return -1;
            if (!$a_asset && $b_asset) return 1;
            return 0;
        });

        foreach ($scripts as $script_url) {
            if (strpos($script_url, 'sndcdn.com') === false && strpos($script_url, 'soundcloud.com') === false) {
                continue;
            }

            $script_res = wp_safe_remote_get($script_url, [
                'timeout'    => 10,
                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            ]);

            if (is_wp_error($script_res)) {
                continue;
            }

            $content = wp_remote_retrieve_body($script_res);
            if (!empty($content)) {
                if (preg_match('/client_id\s*:\s*["\']([a-zA-Z0-9]{32})["\']/i', $content, $m)) {
                    $client_id = $m[1];
                    set_transient('h5ap_soundcloud_client_id', $client_id, DAY_IN_SECONDS);
                    return $client_id;
                }
                if (preg_match('/client_id\s*=\s*["\']([a-zA-Z0-9]{32})["\']/i', $content, $m)) {
                    $client_id = $m[1];
                    set_transient('h5ap_soundcloud_client_id', $client_id, DAY_IN_SECONDS);
                    return $client_id;
                }
            }
        }

        // Return fallback if extraction fails but do not cache it long term
        return $fallback_client_id;
    }
}

if (!function_exists('h5ap_resolve_soundcloud_url')) {
    function h5ap_resolve_soundcloud_url($url)
    {
        if (empty($url) || !is_string($url)) {
            return $url;
        }

        $url = trim($url);

        if (stripos($url, 'soundcloud.com') !== false && stripos($url, 'api.soundcloud.com') === false && stripos($url, 'h5ap_soundcloud_stream') === false) {
            return admin_url('admin-ajax.php?action=h5ap_soundcloud_stream&sc_url=' . urlencode($url));
        }

        return $url;
    }
}

