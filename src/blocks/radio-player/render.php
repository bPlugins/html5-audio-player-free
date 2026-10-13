<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

use H5APPlayer\Helper\Functions;

// Plain-text fields are rendered by JS skins; strip any markup coming from post authors.
foreach (['title', 'subtitle', 'artist', 'statusText'] as $h5ap_text_key) {
    if (isset($attributes[$h5ap_text_key]) && is_string($attributes[$h5ap_text_key])) {
        $attributes[$h5ap_text_key] = sanitize_text_field($attributes[$h5ap_text_key]);
    }
}

extract($attributes);

$uniqueId = wp_unique_id('h5ap-player-');
$settings = h5ap_get_settings('h5ap_settings');

$attributes['multiple_audio'] = $settings('multipleAudio', false) === '1';
$lazy_load_attr = isset($attributes['lazyLoad']) ? $attributes['lazyLoad'] : 'default';
if ($lazy_load_attr === 'default') {
    $lazy_load = $settings('h5ap_lazy_load', '0') === '1';
} else {
    $lazy_load = $lazy_load_attr === 'on';
}
$attributes['lazyLoad'] = $lazy_load;

global $post_id;

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes();

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo esc_attr($encoded_attributes); ?>"
    <?php echo class_exists('\H5APPlayer\Analytics\Analytics') ? \H5APPlayer\Analytics\Analytics::ref_attr($attributes) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- value escaped inside ref_attr(). ?>
    data-nonce="<?php echo esc_attr(wp_create_nonce('h5ap_radio_player_rest')); ?>"
    <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php if ($loader) { ?>
        <div class='h5ap_lp'>
            <div class='bar bar-1'></div>
            <div class='bar bar-1'></div>
        </div>
    <?php } ?>
</div>