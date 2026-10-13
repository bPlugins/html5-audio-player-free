<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Collector
{
	const MAX_BODY_BYTES = 32768;
	const MAX_EVENTS = 50;
	const MAX_BEAT_SECONDS = 35;
	const PLAY_THRESHOLD = 3;
	const COMPLETE_PERCENT = 95;
	const MAX_LISTENS_PER_VISITOR_DAY = 300;
	const MAX_NEW_TRACKS_PER_HOUR = 300;
	const MILESTONES = [25, 50, 75];

	private static $track_cache = [];

	public static function handle(\WP_REST_Request $request)
	{
		if (!Options::enabled() || !Installer::is_installed()) {
			return new \WP_REST_Response(null, 204);
		}

		$body = $request->get_body();
		if (!is_string($body) || $body === '' || strlen($body) > self::MAX_BODY_BYTES) {
			return new \WP_REST_Response(null, 400);
		}

		$data = json_decode($body, true);
		if (!is_array($data) || empty($data['ev']) || !is_array($data['ev'])) {
			return new \WP_REST_Response(null, 400);
		}

		$user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? substr(sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])), 0, 512) : '';
		if (self::is_bot($user_agent)) {
			return new \WP_REST_Response(null, 204);
		}

		$session = isset($data['sk']) && is_string($data['sk']) && preg_match('/^[a-f0-9]{16}$/', $data['sk']) ? $data['sk'] : '';
		if ($session === '') {
			return new \WP_REST_Response(null, 400);
		}

		$visitor = self::visitor_hash($user_agent);
		if (!self::within_rate_limit($visitor)) {
			return new \WP_REST_Response(null, 429);
		}

		$context = [
			'session'   => $session,
			'visitor'   => $visitor,
			'page_id'   => self::valid_page_id(isset($data['pid']) ? $data['pid'] : 0),
			'page_type' => isset($data['pt']) && in_array($data['pt'], ['single', 'archive', 'home', 'other'], true) ? $data['pt'] : 'other',
			'ref'       => self::ref_domain(isset($data['ref']) ? $data['ref'] : ''),
		];
		list($context['device'], $context['browser']) = self::parse_user_agent($user_agent);

		foreach (array_slice($data['ev'], 0, self::MAX_EVENTS) as $event) {
			if (is_array($event) && isset($event['t'])) {
				self::handle_event($event, $context);
			}
		}

		return new \WP_REST_Response(null, 204);
	}

	private static function handle_event(array $event, array $context)
	{
		$type = isset($event['k']) && $event['k'] === 'radio' ? 'radio' : 'audio';
		$track_id = self::track_id(isset($event['s']) ? $event['s'] : '', isset($event['n']) ? $event['n'] : '', $type);
		if (!$track_id) {
			return;
		}

		$player_ref = isset($event['r']) ? absint($event['r']) : 0;
		$surface = isset($event['u']) && in_array($event['u'], ['player', 'playlist', 'radio', 'elementor'], true) ? $event['u'] : 'player';

		switch ($event['t']) {
			case 'imp':
				self::bump($track_id, $context['page_id'], $player_ref, 'imp');
				break;

			case 'beat':
				self::record_listen($event, $track_id, $player_ref, $surface, $context);
				break;

			case 'err':
				// One row per visitor, so "how many different visitors hit this error" is a row count.
				self::bump($track_id, 0, 0, 'error', $context['visitor']);
				break;
		}
	}

	private static function record_listen(array $event, $track_id, $player_ref, $surface, array $context)
	{
		global $wpdb;
		$listens = Installer::table('listens');
		$now = current_time('mysql', true);

		$seconds = isset($event['sec']) ? (int) round((float) $event['sec']) : 0;
		$seconds = max(0, min(self::MAX_BEAT_SECONDS, $seconds));
		$percent = isset($event['pct']) ? max(0, min(100, (int) $event['pct'])) : 0;
		$ended = !empty($event['end']);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$row = $wpdb->get_row($wpdb->prepare(
			"SELECT id, seconds, progress_max, completed, created_at FROM %i WHERE session_key = %s AND track_id = %d AND page_id = %d AND player_ref = %d",
			$listens,
			$context['session'],
			$track_id,
			$context['page_id'],
			$player_ref
		));

		$old_seconds = 0;
		$old_percent = 0;
		$old_completed = false;

		if ($row) {
			$old_seconds = (int) $row->seconds;
			$old_percent = (int) $row->progress_max;
			$old_completed = (bool) $row->completed;

			// A listen can't be longer than the time since it started (plus slack for clock and batching).
			$elapsed = time() - strtotime($row->created_at . ' UTC') + 60;
			$seconds = max(0, min($seconds, $elapsed - $old_seconds));
		} else {
			if (self::visitor_listens_today($context['visitor']) >= self::MAX_LISTENS_PER_VISITOR_DAY) {
				return;
			}
		}

		$new_seconds = $old_seconds + $seconds;
		$new_percent = max($old_percent, $percent);
		$new_completed = $old_completed || $ended || $new_percent >= self::COMPLETE_PERCENT;

		if ($row) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
			$wpdb->update(
				$listens,
				['seconds' => $new_seconds, 'progress_max' => $new_percent, 'completed' => $new_completed ? 1 : 0, 'updated_at' => $now],
				['id' => (int) $row->id],
				['%d', '%d', '%d', '%s'],
				['%d']
			);
			$listen_id = (int) $row->id;
		} else {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
			$inserted = $wpdb->query($wpdb->prepare(
				"INSERT IGNORE INTO %i (track_id, page_id, player_ref, page_type, surface, visitor_hash, session_key, seconds, progress_max, completed, device, browser, ref_domain, created_at, updated_at) VALUES (%d, %d, %d, %s, %s, %s, %s, %d, %d, %d, %s, %s, %s, %s, %s)",
				$listens,
				$track_id,
				$context['page_id'],
				$player_ref,
				$context['page_type'],
				$surface,
				$context['visitor'],
				$context['session'],
				$new_seconds,
				$new_percent,
				$new_completed ? 1 : 0,
				$context['device'],
				$context['browser'],
				$context['ref'],
				$now,
				$now
			));
			if (!$inserted) {
				return;
			}
			$listen_id = (int) $wpdb->insert_id;
		}

		$page_id = $context['page_id'];

		if ($seconds > 0) {
			self::bump($track_id, $page_id, $player_ref, 'seconds', '', $seconds);
		}

		if ($old_seconds < self::PLAY_THRESHOLD && $new_seconds >= self::PLAY_THRESHOLD) {
			self::bump($track_id, $page_id, $player_ref, 'play');
			self::count_unique_listener($context['visitor'], $track_id, $listen_id);
		}

		foreach (self::MILESTONES as $milestone) {
			if ($old_percent < $milestone && $new_percent >= $milestone) {
				self::bump($track_id, $page_id, $player_ref, 'p' . $milestone);
			}
		}

		if (!$old_completed && $new_completed) {
			self::bump($track_id, $page_id, $player_ref, 'complete');
		}
	}

	// Called once per counted play; adds the visitor to today's unique totals (site-wide and per track) the first time only.
	private static function count_unique_listener($visitor, $track_id, $listen_id)
	{
		global $wpdb;
		$listens = Installer::table('listens');
		$since = self::today_start_utc();

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$seen_today = (int) $wpdb->get_var($wpdb->prepare(
			"SELECT COUNT(*) FROM %i WHERE visitor_hash = %s AND created_at >= %s AND seconds >= %d AND id <> %d",
			$listens,
			$visitor,
			$since,
			self::PLAY_THRESHOLD,
			$listen_id
		));
		if ($seen_today === 0) {
			self::bump(0, 0, 0, 'unique');
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$seen_track_today = (int) $wpdb->get_var($wpdb->prepare(
			"SELECT COUNT(*) FROM %i WHERE visitor_hash = %s AND track_id = %d AND created_at >= %s AND seconds >= %d AND id <> %d",
			$listens,
			$visitor,
			$track_id,
			$since,
			self::PLAY_THRESHOLD,
			$listen_id
		));
		if ($seen_track_today === 0) {
			self::bump($track_id, 0, 0, 'unique');
		}
	}

	public static function bump($track_id, $page_id, $player_ref, $metric, $label = '', $amount = 1)
	{
		global $wpdb;
		$daily = Installer::table('daily');
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$wpdb->query($wpdb->prepare(
			"INSERT INTO %i (date, track_id, page_id, player_ref, metric, label, value) VALUES (%s, %d, %d, %d, %s, %s, %d) ON DUPLICATE KEY UPDATE value = value + %d",
			$daily,
			current_time('Y-m-d'),
			$track_id,
			$page_id,
			$player_ref,
			$metric,
			substr($label, 0, 100),
			$amount,
			$amount
		));
	}

	private static function track_id($source, $title, $type)
	{
		if (!is_string($source)) {
			return 0;
		}
		$normalized = Url::normalize($source);
		if ($normalized === '') {
			return 0;
		}
		$key = sha1($normalized);
		if (isset(self::$track_cache[$key])) {
			return self::$track_cache[$key];
		}

		global $wpdb;
		$tracks = Installer::table('tracks');
		$title = is_string($title) ? mb_substr(sanitize_text_field($title), 0, 200) : '';
		// The block's placeholder title isn't a real name; leave it empty so the file name is shown instead.
		if (strtolower($title) === 'audio title') {
			$title = '';
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$row = $wpdb->get_row($wpdb->prepare(
			"SELECT id, title FROM %i WHERE track_key = %s",
			$tracks,
			$key
		));

		if ($row) {
			if ($row->title === '' && $title !== '') {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
				$wpdb->update($tracks, ['title' => $title], ['id' => (int) $row->id], ['%s'], ['%d']);
			}
			return self::$track_cache[$key] = (int) $row->id;
		}

		if (!self::can_create_track()) {
			return 0;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$wpdb->query($wpdb->prepare(
			"INSERT IGNORE INTO %i (track_key, source, title, type, created_at) VALUES (%s, %s, %s, %s, %s)",
			$tracks,
			$key,
			esc_url_raw(substr($source, 0, 2048)) ?: substr(sanitize_text_field($source), 0, 2048),
			$title,
			$type,
			current_time('mysql', true)
		));

		$id = (int) $wpdb->insert_id;
		if (!$id) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
			$id = (int) $wpdb->get_var($wpdb->prepare(
				"SELECT id FROM %i WHERE track_key = %s",
				$tracks,
				$key
			));
		}
		return self::$track_cache[$key] = $id;
	}

	// Caps how many brand-new tracks can be registered per hour, so junk URLs can't flood the table.
	private static function can_create_track()
	{
		$count = (int) get_transient('h5ap_analytics_new_tracks');
		if ($count >= self::MAX_NEW_TRACKS_PER_HOUR) {
			return false;
		}
		set_transient('h5ap_analytics_new_tracks', $count + 1, HOUR_IN_SECONDS);
		return true;
	}

	private static function visitor_listens_today($visitor)
	{
		global $wpdb;
		$listens = Installer::table('listens');
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		return (int) $wpdb->get_var($wpdb->prepare(
			"SELECT COUNT(*) FROM %i WHERE visitor_hash = %s AND created_at >= %s",
			$listens,
			$visitor,
			self::today_start_utc()
		));
	}

	// Per-minute request cap; only enforced when a persistent object cache makes it cheap.
	private static function within_rate_limit($visitor)
	{
		if (!wp_using_ext_object_cache()) {
			return true;
		}
		$key = 'rl_' . $visitor . '_' . gmdate('YmdHi');
		$count = wp_cache_incr($key, 1, 'h5ap_analytics');
		if ($count === false) {
			wp_cache_set($key, 1, 'h5ap_analytics', MINUTE_IN_SECONDS * 2);
			$count = 1;
		}
		return $count <= 120;
	}

	private static function today_start_utc()
	{
		return get_gmt_from_date(current_time('Y-m-d') . ' 00:00:00');
	}

	private static function valid_page_id($page_id)
	{
		$page_id = absint($page_id);
		if (!$page_id) {
			return 0;
		}
		return get_post_status($page_id) === 'publish' ? $page_id : 0;
	}

	public static function visitor_hash($user_agent)
	{
		$ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
		$ip = (string) apply_filters('h5ap_analytics_client_ip', $ip);
		return substr(hash('sha256', $ip . '|' . $user_agent . '|' . self::daily_salt()), 0, 16);
	}

	// The salt changes every day, so a visitor can't be followed from one day to the next.
	private static function daily_salt()
	{
		$today = current_time('Y-m-d');
		$stored = get_option('h5ap_analytics_salt');
		if (is_array($stored) && isset($stored['date'], $stored['salt']) && $stored['date'] === $today) {
			return $stored['salt'];
		}
		$salt = wp_generate_password(32, true, true);
		update_option('h5ap_analytics_salt', ['date' => $today, 'salt' => $salt], false);
		return $salt;
	}

	private static function is_bot($user_agent)
	{
		if ($user_agent === '') {
			return true;
		}
		return (bool) preg_match('/bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|python-requests|curl\/|wget|httpclient|scrapy|phantomjs/i', $user_agent);
	}

	private static function parse_user_agent($user_agent)
	{
		if (preg_match('/iPad|Tablet|Android(?!.*Mobile)/i', $user_agent)) {
			$device = 'tablet';
		} elseif (preg_match('/Mobi|iPhone|iPod|Android/i', $user_agent)) {
			$device = 'mobile';
		} else {
			$device = 'desktop';
		}

		$browsers = [
			'edge'    => '/Edg(e|A|iOS)?\//',
			'opera'   => '/OPR\/|Opera/',
			'samsung' => '/SamsungBrowser/',
			'firefox' => '/Firefox\/|FxiOS/',
			'chrome'  => '/Chrome\/|CriOS/',
			'safari'  => '/Safari\//',
		];
		$browser = 'other';
		foreach ($browsers as $name => $pattern) {
			if (preg_match($pattern, $user_agent)) {
				$browser = $name;
				break;
			}
		}
		return [$device, $browser];
	}

	private static function ref_domain($referrer)
	{
		if (!is_string($referrer) || $referrer === '') {
			return '';
		}
		$host = wp_parse_url($referrer, PHP_URL_HOST);
		if (!is_string($host) || $host === '') {
			return '';
		}
		$host = strtolower(preg_replace('/^www\./i', '', $host));
		$own = strtolower(preg_replace('/^www\./i', '', (string) wp_parse_url(home_url(), PHP_URL_HOST)));
		return $host === $own ? '' : substr(sanitize_text_field($host), 0, 100);
	}
}
