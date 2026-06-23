<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_shortcode('player', function ($atts) {
  extract(shortcode_atts(array(
    'id' => null,
  ), $atts));


  $post_id = esc_html($atts['id']);
  $post = get_post($id);
  if (!$post) {
    return '';
  }

  // Enqueue necessary assets for the player to function
  wp_enqueue_style('h5ap-public');
  wp_enqueue_style('bplugins-plyrio');
  wp_enqueue_script('bplugins-plyrio');

  // Enqueue block assets manually as render_block doesn't handle it for shortcodes
  wp_enqueue_script('h5ap-audioplayer-view-script');
  wp_enqueue_style('h5ap-audioplayer-style');
  wp_enqueue_script('h5ap-radio-player-view-script');
  wp_enqueue_style('h5ap-radio-player-style');

  if (post_password_required($post)) {
    return get_the_password_form($post);
  }
  switch ($post->post_status) {
    case 'publish':
      return h5ap_player_shortcode_content($post_id);
    case 'private':
      if (current_user_can('read_private_posts')) {
        return h5ap_player_shortcode_content($post_id);
      }
      return '';
    case 'draft':
    case 'pending':
    case 'future':
      if (current_user_can('edit_post', $post_id)) {
        return h5ap_player_shortcode_content($post_id);
      }
      return '';
    default:
      return '';
  }
});

if (!function_exists('h5ap_player_shortcode_content')) {
  function h5ap_player_shortcode_content($post_id)
  {

    $meta = h5ap_get_post_meta($post_id, '_h5ap_plyr');
    $type = $meta('h5ap_player_type', 'opt-1');
    $player_theme = $meta('player_theme');
    $player_skin = $meta('player_skin');
    $h5vp_default_audio = $meta('h5vp_default_audio');
    $width = $meta('width', ['width' =>  '100', 'unit' =>  '%']);
    $playlist_type = $meta('playlist_type');
    $playlist_in_metabox = $meta('playlist_in_metabox', []);

    $sticky_simple_background = $meta('sticky_simple_background');
    $forward_rewind_change_audio     = $meta('forward_rewind_change_audio');
    $plp_width                      = $meta('plp_width', ['width' => '100', 'unit' => '%']);
    $plp_align                      = $meta('plp_align');
    $plp_volume                     = $meta('plp_volume');
    $sticky_download                = $meta('sticky_download');
    $sticky_volume                  = $meta('sticky_volume');
    $selected_audio                 = $meta('selected_audio');

    $tracks = [];


    if ($playlist_type !== 'create' && is_array($selected_audio)) {
      foreach ($selected_audio as $id) {
        $playlist_ids = get_post_meta($id, '_h5applaylist');

        foreach ($playlist_ids as $audios) {
          foreach ($audios as $audio) {
            if ($audio['audio'] !== '') {
              $tracks[] = wp_parse_args(['source' => h5ap_resolve_soundcloud_url($audio['audio'])], $audio);
            }
          }
        }
      }
    } else {
      if (is_array($playlist_in_metabox) && !empty($playlist_in_metabox)) {
        foreach ($playlist_in_metabox as $audio) {
          $tracks[] = [
            'title' => $audio['pl_audio_title'],
            'source' => h5ap_resolve_soundcloud_url($audio['pl_audio_file']),
            'poster' => $audio['pl_audio_poster'],
            'artist' => $audio['pl_audio_artist']
          ];
        }
      } 
    }



    $block_types = [
      'opt-1' => 'audioplayer',
      'opt-2' => 'playlist' . $player_skin,
      'opt-3' => 'audioplayer',
    ];

    if (file_exists(__DIR__ . '/blocks/' . $block_types[$type] . '.php')) {
      $block = [];
      include __DIR__ . '/blocks/' . $block_types[$type] . '.php';
      return render_block($block);
    }
  }
}
