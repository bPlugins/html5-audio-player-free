<?php

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
