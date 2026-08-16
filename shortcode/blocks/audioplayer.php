<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

use H5APPlayer\Helper\LocalizeScript;

$standard_skin = $meta('standard_skin', "Default");
$standard_skin_lower = strtolower($standard_skin);

$skin_defaults = [
    'default' => ['bg' => '#F5F5F5', 'control' => '#4A5464', 'primary' => '#4A5464'],
    'fusion'  => ['bg' => '#161616', 'control' => '#fff',    'primary' => '#fff'],
    'stamp'   => ['bg' => '#161616', 'control' => '#fff',    'primary' => '#fff'],
    'wave'    => ['bg' => '#161616', 'control' => '#fff',    'primary' => '#fff'],
];

$defaults = $skin_defaults[$standard_skin_lower] ?? ['bg' => '#161616', 'control' => '#fff', 'primary' => '#195FF6'];

$background     = $meta('background', $defaults['bg']);
$sticky_simple_background = $meta('sticky_simple_background');
$primary_color  = $meta('primary_color', $defaults['primary']);
$sticky_download = $meta('sticky_download', false, true);
$download       = $meta('fusion_download', false, true);
$sticky_skin    = $meta('sticky_skin', 'Fusion');

// settings
$settings = h5ap_get_settings('h5ap_settings', []);
$settings_primary_color = $settings('h5ap_primary_color');
$settings_background = $settings('h5ap_background_color');

$bgColor = $background;
if ($type === 'opt-3') {
    $bgColor = !empty($sticky_simple_background) ? $sticky_simple_background : $bgColor;
    $download = $sticky_download;
}

if ($standard_skin_lower === 'default' && !empty($settings_background)) {
    $bgColor = $settings_background;
}

$saved_control_color = $meta('control_color', null);
if ($saved_control_color !== null && $saved_control_color !== '' && $saved_control_color !== '#fff' && $saved_control_color !== '#4A5464') {
    $control_color = $saved_control_color;
} else {
    $control_color = $defaults['control'];
}

$all_control_keys = [
    'restart',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'duration',
    'current-time',
    'mute',
    'volume',
    'settings',
    'download',
];

$default_controls = ['play', 'progress', 'mute', 'volume', 'current-time', 'settings'];
$raw_controls = $meta('controls', null);

$lazy_load_meta = $meta('lazy_load', 'default');
if ($lazy_load_meta === null || $lazy_load_meta === '') {
    $lazy_load_meta = 'default';
}

if ($raw_controls === null || $raw_controls === '') {
    $selected_controls = $default_controls;
} elseif (is_array($raw_controls)) {
    $selected_controls = $raw_controls;
} else {
    $selected_controls = $default_controls;
}

// force play always ON
if (!in_array('play', $selected_controls, true)) {
    $selected_controls[] = 'play';
}

$controls_attr = [];
foreach ($all_control_keys as $ctrl_key) {
    $controls_attr[$ctrl_key] = in_array($ctrl_key, $selected_controls, true);
}

$block = [
    'blockName' => 'h5ap/audioplayer',
    'attrs' => [
        'uniqueId'      => "player$post_id",
        'clientId'      => '',
        'align'         => '',
        'alignment'     => $meta('plp_align', 'left'),
        'source'        => h5ap_resolve_gdrive_url(h5ap_resolve_soundcloud_url($h5vp_default_audio)),
        'poster'        => $type === 'opt-3' ? $meta('poster_sticky') : $meta('sticky_poster'),
        'title'         => $type === 'opt-3' ? $meta('title_sticky') : $meta('title'),
        'artist'        => $meta('author'),
        'color'         => $meta('color', '#fff'),
        'textColor'     => $meta('color', '#fff'),
        'primaryColor'  => $primary_color,
        'hoverColor'    => '#00B3FF',
        'controlColor'  => $control_color,
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
        'lazyLoad'      => $lazy_load_meta,
        'controls'      => $controls_attr,
        'waveType'      => $meta('waveType', 'equalizer'),
        'options'       => [
            'volume' => (float) $meta($type === 'opt-3' ? 'sticky_volume' : 'plp_volume', 0.5),
        ],
        'style'         => null,
        'CSS'           => '',
        'i18n'          => LocalizeScript::translatedText(),
        'speed'         => $settings('h5ap_speed', '0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4'),
    ],
    'innerBlocks' => [],
    'innerHTML' => '',
    'innerContent' => [],
];
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound