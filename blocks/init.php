<?php

add_action('init', function () {
    // Register block editor script for backend.
    wp_register_script(
        'h5ap_block_free-js', 
        H5AP_PRO_PLUGIN_DIR . '/blocks/dist/blocks.build.js', 
        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'), 
        null, 
        true
    );

    wp_localize_script(
        'h5ap_block_free-js',
        'cgbGlobal', 
        [
            'pluginDirPath' => plugin_dir_path(__DIR__),
            'pluginDirUrl'  => plugin_dir_url(__DIR__),
        ]
    );

    // Register Gutenberg block on server-side.
    register_block_type('h5ap/free', array(
        'style'         => 'h5ap_block_free-style-css',
        'editor_script' => 'h5ap_block_free-js',
        'editor_style'  => 'h5ap_block_free-editor-css',
    ));

    register_block_type('h5ap/existing', [
        'render_callback' => 'h5ap_pro_render_h5ap_block_free_existing',
    ]);
});

function h5ap_pro_render_h5ap_block_free_existing($attributes){
    extract($attributes);

    isset($selectedPlayer) ? $selectedPlayer : $selectedPlayer = 'empty';
    isset($contentAlign) ? $contentAlign : $contentAlign = 'left';

    ob_start();
    echo '<div class="h5ap_block_free_existing" style="text-align:' . esc_attr($contentAlign) . ';">';

    if ('empty' == $selectedPlayer && current_user_can('edit_posts')) {
        echo 'No Audio Player is Selected';
    } elseif (!$selectedPlayer && current_user_can('edit_posts')) {
        echo 'No Audio Player is Selected';
    } elseif ('empty' == $selectedPlayer || !$selectedPlayer) {
        echo '';
    } else {
        echo do_shortcode("[player id=$selectedPlayer]");
    }

    echo '</div>';
    return ob_get_clean();
}
