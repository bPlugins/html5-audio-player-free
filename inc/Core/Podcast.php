<?php
// phpcs:disable WordPress.WP.AlternativeFunctions

namespace H5APPlayer\Core;

class Podcast
{
    public static function parse_feed($url, $limit = 5)
    {
        if (empty($url)) {
            return [];
        }

        // Enforce the 5-item limit for the Free version
        $limit = ($limit > 0) ? min($limit, 5) : 5;

        $cache_key = 'h5ap_podcast_feed_v2_' . md5($url . '_' . $limit);
        $cached_data = get_transient($cache_key);

        if ($cached_data !== false) {
            return $cached_data;
        }

        require_once ABSPATH . WPINC . '/class-simplepie.php';
        $feed = fetch_feed($url);

        if (is_wp_error($feed)) {
            return [];
        }

        $items = $feed->get_items();
        $tracks = [];

        $channel_poster = $feed->get_image_url();

        $count = 0;
        foreach ($items as $item) {
            if ($count >= $limit) {
                break;
            }

            $enclosure = $item->get_enclosure();
            if (!$enclosure || !$enclosure->get_link()) {
                continue;
            }

            $title = $item->get_title();
            $audio_url = $enclosure->get_link();
            $description = wp_strip_all_tags($item->get_description());
            $pub_date = $item->get_date('F j, Y');

            $artist = '';
            $author = $item->get_author();
            if ($author && $author->get_name()) {
                $artist = $author->get_name();
            } else {
                $channel_author = $feed->get_author();
                if ($channel_author && $channel_author->get_name()) {
                    $artist = $channel_author->get_name();
                } else {
                    $artist = $feed->get_title();
                }
            }

            $poster = '';
            $itunes_image = $item->get_item_tags(SIMPLEPIE_NAMESPACE_ITUNES, 'image');
            if (!empty($itunes_image[0]['attribs']['']['href'])) {
                $poster = $itunes_image[0]['attribs']['']['href'];
            } elseif ($channel_poster) {
                $poster = $channel_poster;
            }

            $tracks[] = [
                'title'       => html_entity_decode($title),
                'artist'      => html_entity_decode($artist),
                'source'      => esc_url_raw($audio_url),
                'description' => html_entity_decode($description),
                'date'        => $pub_date,
                'poster'      => $poster ? esc_url_raw($poster) : '',
            ];

            $count++;
        }

        set_transient($cache_key, $tracks, 12 * HOUR_IN_SECONDS);

        return $tracks;
    }
}
