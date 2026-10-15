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

if (isset($attributes['sourceType']) && $attributes['sourceType'] === 'podcast') {
    $attributes['audios'] = [];
    if (!empty($attributes['podcastRssUrl'])) {
        $limit = isset($attributes['podcastLimit']) ? intval($attributes['podcastLimit']) : 0;
        $podcast_tracks = \H5APPlayer\Core\Podcast::parse_feed($attributes['podcastRssUrl'], $limit);
        if (!empty($podcast_tracks)) {
            $attributes['audios'] = $podcast_tracks;
        }
    }
}

// Transcripts (off unless "Show transcript" is on): one box per track, printed after the player;
// transcript.js shows the box of the track that is playing. Podcast episodes come from the feed, so they have none.
$h5ap_transcript_tracks = (!empty($attributes['showTranscript']) && ($attributes['sourceType'] ?? '') !== 'podcast' && isset($attributes['audios']) && is_array($attributes['audios'])) ? $attributes['audios'] : [];
$h5ap_transcript_width = $attributes['width'] ?? '100%';
if (is_array($h5ap_transcript_width)) {
    $h5ap_transcript_width = isset($h5ap_transcript_width['number'], $h5ap_transcript_width['unit']) ? $h5ap_transcript_width['number'] . $h5ap_transcript_width['unit'] : '100%';
}
$h5ap_transcript_args = [
    'align'  => $attributes['alignment'] ?? 'left',
    'width'  => is_string($h5ap_transcript_width) ? $h5ap_transcript_width : '100%',
    'search' => ($attributes['transcriptSearch'] ?? true) !== false,
    'open'   => ($attributes['transcriptOpen'] ?? true) !== false,
    'radius' => (int) ($attributes['transcriptRadius'] ?? 0),
];
if (isset($attributes['audios'])) {
    $attributes['audios'] = \H5APPlayer\Helper\Transcript::strip_track_transcripts($attributes['audios']);
}
unset($attributes['showTranscript'], $attributes['transcriptSearch'], $attributes['transcriptOpen'], $attributes['transcriptRadius']);

$encoded_attributes = esc_attr(wp_json_encode($attributes, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'wp-block-h5ap-tailwind']);

?>
<div
    id="<?php echo esc_attr($uniqueId); ?>"
    data-id="<?php echo esc_attr($uniqueId); ?>"
    data-attributes="<?php echo esc_attr($encoded_attributes); ?>"
    <?php echo class_exists('\H5APPlayer\Analytics\Analytics') ? \H5APPlayer\Analytics\Analytics::ref_attr($attributes) : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- value escaped inside ref_attr(). ?>
    <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
</div>
<?php
if ($h5ap_transcript_tracks) {
    echo \H5APPlayer\Helper\Transcript::render_playlist($h5ap_transcript_tracks, $uniqueId, $h5ap_transcript_args); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside render().
}
