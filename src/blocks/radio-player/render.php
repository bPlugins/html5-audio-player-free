<?php

use H5APPlayer\Helper\Functions;

extract($attributes);

$uniqueId = wp_unique_id('h5ap-player-');
$settings = h5ap_get_settings('h5ap_settings');

$attributes['multiple_audio'] = $settings('multipleAudio', false) === '1';

global $post_id;

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes();

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo esc_attr($encoded_attributes); ?>"
    data-nonce="<?php echo esc_attr(wp_create_nonce('h5ap_radio_player_rest')); ?>"
    <?php echo wp_kses_post($wrapper_attributes); ?>>
    <?php if ($loader) { ?>
        <div class='h5ap_lp'>
            <div class='bar bar-1'></div>
            <div class='bar bar-1'></div>
        </div>
    <?php } ?>
</div>