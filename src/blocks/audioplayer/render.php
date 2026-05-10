<?php

use H5APPlayer\Helper\LocalizeScript;

extract($attributes);

$uniqueId = wp_unique_id('h5ap-player-');
$settings = h5ap_get_settings('h5ap_settings');

$attributes['i18n'] = LocalizeScript::translatedText();
$attributes['speed'] = ['selected' => 1, 'speed' => explode(',', $settings('h5ap_speed', '0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4, 8'))];
$attributes['multiple_audio'] = $settings('multipleAudio', false) === '1';

if (!isset($attributes['bgColor']) && !isset($attributes['textColor']) && isset($attributes['skin'])) {
    $attributes = wp_parse_args($attributes['defaultValue'][$skin], $attributes);
}

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-h5ap-tailwind']);

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo esc_attr($encoded_attributes); ?>"
    <?php echo $wrapper_attributes; ?>>
    <?php if ($loader) { ?>
        <div class='h5ap_lp'>
            <div class='bar bar-1'></div>
            <div class='bar bar-1'></div>
        </div>
    <?php } ?>
</div>