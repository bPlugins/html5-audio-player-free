<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Stats
{
	const DAYS = 7;
	const TRACKS = 5;
	const BROKEN_MIN_VISITORS = 3;

	// Free offers Today and the last 7 days.
	public static function range($key = '7d')
	{
		$today = current_time('Y-m-d');
		if ($key === 'today') {
			return ['key' => 'today', 'from' => $today, 'to' => $today, 'days' => 1];
		}
		return ['key' => '7d', 'from' => self::shift($today, -(self::DAYS - 1)), 'to' => $today, 'days' => self::DAYS];
	}

	public static function overview($key = '7d')
	{
		global $wpdb;
		$daily = Installer::table('daily');
		$range = self::range($key);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$rows = $wpdb->get_results($wpdb->prepare(
			"SELECT date, metric, SUM(value) AS total FROM %i WHERE date BETWEEN %s AND %s AND track_id > 0 AND metric IN ('play', 'seconds') GROUP BY date, metric",
			$daily,
			$range['from'],
			$range['to']
		));

		$series = [];
		for ($date = $range['from']; $date <= $range['to']; $date = self::shift($date, 1)) {
			$series[$date] = ['date' => $date, 'plays' => 0, 'seconds' => 0];
		}

		$totals = ['play' => 0, 'seconds' => 0];
		foreach ($rows as $row) {
			$totals[$row->metric] += (int) $row->total;
			$key = $row->metric === 'play' ? 'plays' : 'seconds';
			if (isset($series[$row->date])) {
				$series[$row->date][$key] = (int) $row->total;
			}
		}

		return [
			'range'  => $range,
			'cards'  => ['plays' => $totals['play'], 'seconds' => $totals['seconds']],
			'series' => array_values($series),
			'broken' => self::broken_count(),
		];
	}

	public static function tracks($key = '7d')
	{
		global $wpdb;
		$daily = Installer::table('daily');
		$tracks = Installer::table('tracks');
		$range = self::range($key);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$rows = $wpdb->get_results($wpdb->prepare(
			"SELECT t.id, t.title, t.source, t.type,
				SUM(CASE WHEN d.metric = 'play' THEN d.value ELSE 0 END) AS plays,
				SUM(CASE WHEN d.metric = 'seconds' THEN d.value ELSE 0 END) AS seconds
			FROM %i d INNER JOIN %i t ON t.id = d.track_id
			WHERE d.date BETWEEN %s AND %s AND d.metric IN ('play', 'seconds')
			GROUP BY t.id, t.title, t.source, t.type
			HAVING plays > 0 OR seconds > 0
			ORDER BY plays DESC, seconds DESC
			LIMIT %d",
			$daily,
			$tracks,
			$range['from'],
			$range['to'],
			self::TRACKS
		));

		$items = [];
		foreach ($rows as $row) {
			$items[] = [
				'id'      => (int) $row->id,
				'title'   => $row->title !== '' ? $row->title : Url::file_label($row->source),
				'source'  => $row->source,
				'type'    => $row->type,
				'plays'   => (int) $row->plays,
				'seconds' => (int) $row->seconds,
			];
		}

		return ['items' => $items, 'total' => count($items), 'page' => 1, 'per_page' => self::TRACKS];
	}

	public static function broken_count()
	{
		return count(self::broken_track_rows());
	}

	/**
	 * The site owner fixed the file: forget its errors so the alert goes away now.
	 * It comes back only if the file fails again for enough visitors.
	 * $track_ids empty = every file that is currently flagged.
	 */
	public static function dismiss_broken(array $track_ids = [])
	{
		global $wpdb;
		$daily = Installer::table('daily');
		$track_ids = array_filter(array_map('absint', $track_ids));
		if (!$track_ids) {
			foreach (self::broken_track_rows() as $row) {
				$track_ids[] = (int) $row->track_id;
			}
		}
		if (!$track_ids) {
			return 0;
		}
		$track_ids = array_values($track_ids);
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		return (int) $wpdb->query($wpdb->prepare(
			"DELETE FROM %i WHERE metric = 'error' AND track_id IN (" . implode(",", array_fill(0, count($track_ids), "%d")) . ")",
			array_merge([$daily], $track_ids)
		));
	}

	private static function broken_track_rows()
	{
		global $wpdb;
		$daily = Installer::table('daily');
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		return $wpdb->get_results($wpdb->prepare(
			"SELECT track_id, COUNT(DISTINCT label) AS visitors FROM %i WHERE metric = 'error' AND date >= %s GROUP BY track_id HAVING visitors >= %d",
			$daily,
			self::shift(current_time('Y-m-d'), -1),
			self::BROKEN_MIN_VISITORS
		));
	}

	private static function shift($date, $days)
	{
		return gmdate('Y-m-d', strtotime($date . ' 00:00:00 UTC') + $days * DAY_IN_SECONDS);
	}
}
