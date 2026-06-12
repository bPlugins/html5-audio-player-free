<?php

use H5APPlayer\Helper\Functions;

extract($attributes);
$uniqueId = wp_unique_id('h5ap-playlist-');
$settings = h5ap_get_settings('h5ap_settings');

$attributes['multiple_audio'] = $settings('multipleAudio', false) === '1';

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-h5ap-tailwind']);

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo $encoded_attributes; ?>"
    <?php echo $wrapper_attributes; ?>>
</div>