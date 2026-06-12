<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

use H5APPlayer\Helper\LocalizeScript;

$standard_skin = $meta('standard_skin', "Default");
// $background = $meta('background', '#f2f2f2');
$background     = $meta('background', $standard_skin === 'wave' ? '#000' : '#f2f2f2');
$sticky_simple_background     = $meta('sticky_simple_background');
$control_color     = $meta('control_color', $standard_skin === 'default' ? '#fff' : '#4a5464');
$primary_color     = $meta('primary_color', '#195FF5');
$sticky_download     = $meta('sticky_download', false, true);
$download     = $meta('fusion_download', false, true);
$sticky_skin = $meta('sticky_skin', 'Fusion');

// settings
$settings = h5ap_get_settings('h5ap_settings', []);
$settings_primary_color = $settings('h5ap_primary_color');
$settings_background = $settings('h5ap_background_color');


$bgColor = $background;
if ($type === 'opt-3') {
    $bgColor = $sticky_simple_background;
    $download = $sticky_download;
}

if ($standard_skin === 'default' && $primary_color === '#195FF5') {
    $bgColor = $settings_background;
    $control_color = $settings_primary_color;
}

$controls = $meta('controls', []);

if (!is_array($controls)) {
    $controls = [];
}

// force play always ON
$controls[] = 'play';

$controls = array_unique($controls);

$block = [
    'blockName' => 'h5ap/audioplayer',
    'attrs' => [
        'uniqueId'      => "player$post_id",
        'clientId'      => '',
        'align'         => '',
        'alignment'         => $meta('plp_align', 'left'),
        'source'        => h5ap_resolve_soundcloud_url($h5vp_default_audio),
        'poster'        => $type === 'opt-3' ? $meta('poster_sticky') : $meta('sticky_poster'),
        'title'         => $type === 'opt-3' ? $meta('title_sticky') : $meta('title'),
        'artist'        => $meta('author'),
        'color'         => $meta('color', '#fff'),
        'textColor'     => $meta('color', '#fff'),
        'primaryColor'  => $primary_color,
        'hoverColor'    => '#00B3FF',
        'controlColor'  =>  $control_color,
        'bgColor'       => $bgColor,
        'skin'          => $type === 'opt-1' ? ucfirst($standard_skin) : ucfirst($sticky_skin),
        'repeat'        => $meta('repeat', false, true),
        'autoplay'      => $meta('autoplay', false, true),
        'isSticky'      => $type === 'opt-3' || $meta('enable_sticky', false),
        'muted'         => $meta('muted', false, true),
        'loader'        => !$meta('disable_loader', true, true),
        'saveState'     => $meta('save_state', false, true),
        'disablePause'  => $meta('disable_pause', false, true),
        'seekTime'      => (int) $meta('seektime', 10),
        'startTime'     => (int)$meta('startTime', 0),
        'preload'       => $meta('preload', 'metadata'),
        'download'      => $download,
        'width'         => $width['width'] . $width['unit'],
        'radius'        => $type === 'opt-3' ? 0 : $meta('radius', '5') . 'px',
        'controls' => array_fill_keys(array_unique($controls), true),
        'options'       => [
            'volume' => (float) $meta($type === 'opt-3' ? 'sticky_volume' : 'plp_volume', 0.5),
        ],
        'style'         => null,
        'CSS'           => '',
        'i18n'          => LocalizeScript::translatedText(),
        'speed'         =>  $settings('h5ap_speed', '0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4'),
    ],
    'innerBlocks' => [],
    'innerHTML' => '',
    'innerContent' => [],
];
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound