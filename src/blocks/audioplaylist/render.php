<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

use H5APPlayer\Helper\Functions;

extract($attributes);
$uniqueId = wp_unique_id('h5ap-playlist-');
$settings = h5ap_get_settings('h5ap_settings');

$attributes['multiple_audio'] = $settings('multipleAudio', false) === '1';
$lazy_load_attr = isset($attributes['lazyLoad']) ? $attributes['lazyLoad'] : 'default';
if ($lazy_load_attr === 'default') {
    $lazy_load = $settings('h5ap_lazy_load', '0') === '1';
} else {
    $lazy_load = $lazy_load_attr === 'on';
}
$attributes['lazyLoad'] = $lazy_load;

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-h5ap-tailwind']);

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo esc_attr($encoded_attributes); ?>"
    <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
</div>