<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Installer
{
	// 2: a listen is unique per player too, so the same file in two players on one page counts for both.
	const DB_VERSION = '2';
	const VERSION_OPTION = 'h5ap_analytics_db_version';

	public static function table($name)
	{
		global $wpdb;
		return $wpdb->prefix . 'h5ap_' . $name;
	}

	public static function is_installed()
	{
		return get_option(self::VERSION_OPTION) === self::DB_VERSION;
	}

	// Runs on admin_init only, so schema work never happens on a visitor's request.
	public static function maybe_install()
	{
		if (self::is_installed()) {
			return;
		}

		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset = $wpdb->get_charset_collate();
		$tracks = self::table('tracks');
		$listens = self::table('listens');
		$daily = self::table('daily');

		// Version 1 had the listen key without player_ref. dbDelta never changes an existing index, so drop it and let dbDelta add the new one.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- the plugin's own analytics tables.
		if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($listens))) === $listens) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- the plugin's own analytics tables.
			$key_columns = $wpdb->get_col($wpdb->prepare('SHOW INDEX FROM %i WHERE Key_name = %s', $listens, 'listen'), 4);
			if ($key_columns && !in_array('player_ref', $key_columns, true)) {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange -- the plugin's own analytics tables.
				$wpdb->query($wpdb->prepare('ALTER TABLE %i DROP INDEX listen', $listens));
			}
		}

		dbDelta("CREATE TABLE {$tracks} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  track_key char(40) NOT NULL,
  source text NOT NULL,
  title varchar(255) NOT NULL DEFAULT '',
  type varchar(10) NOT NULL DEFAULT 'audio',
  created_at datetime NOT NULL,
  PRIMARY KEY  (id),
  UNIQUE KEY track_key (track_key)
) {$charset};");

		dbDelta("CREATE TABLE {$listens} (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  track_id bigint(20) unsigned NOT NULL,
  page_id bigint(20) unsigned NOT NULL DEFAULT 0,
  player_ref bigint(20) unsigned NOT NULL DEFAULT 0,
  page_type varchar(10) NOT NULL DEFAULT '',
  surface varchar(12) NOT NULL DEFAULT '',
  visitor_hash char(16) NOT NULL,
  session_key char(16) NOT NULL,
  seconds int(10) unsigned NOT NULL DEFAULT 0,
  progress_max tinyint(3) unsigned NOT NULL DEFAULT 0,
  completed tinyint(1) unsigned NOT NULL DEFAULT 0,
  device varchar(8) NOT NULL DEFAULT '',
  browser varchar(16) NOT NULL DEFAULT '',
  ref_domain varchar(100) NOT NULL DEFAULT '',
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  PRIMARY KEY  (id),
  UNIQUE KEY listen (session_key,track_id,page_id,player_ref),
  KEY track_created (track_id,created_at),
  KEY visitor_created (visitor_hash,created_at),
  KEY created_at (created_at)
) {$charset};");

		dbDelta("CREATE TABLE {$daily} (
  date date NOT NULL,
  track_id bigint(20) unsigned NOT NULL DEFAULT 0,
  page_id bigint(20) unsigned NOT NULL DEFAULT 0,
  player_ref bigint(20) unsigned NOT NULL DEFAULT 0,
  metric varchar(12) NOT NULL,
  label varchar(100) NOT NULL DEFAULT '',
  value bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY  (date,track_id,page_id,player_ref,metric,label),
  KEY metric_date (metric,date),
  KEY player_metric (player_ref,metric)
) {$charset};");

		// Only mark as installed when every table really exists, so a failed run retries next time.
		foreach ([$tracks, $listens, $daily] as $name) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- the plugin's own analytics tables.
			if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($name))) !== $name) {
				return;
			}
		}
		update_option(self::VERSION_OPTION, self::DB_VERSION, false);
	}

	public static function purge_data()
	{
		global $wpdb;
		foreach (['listens', 'daily', 'tracks'] as $name) {
			$table = self::table($name);
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- the plugin's own analytics tables.
			$wpdb->query($wpdb->prepare('TRUNCATE TABLE %i', $table));
		}
	}

	public static function uninstall()
	{
		global $wpdb;
		foreach (['listens', 'daily', 'tracks'] as $name) {
			$table = self::table($name);
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange -- the plugin's own analytics tables.
			$wpdb->query($wpdb->prepare('DROP TABLE IF EXISTS %i', $table));
		}
		delete_option(self::VERSION_OPTION);
		delete_option('h5ap_analytics_salt');
		delete_transient('h5ap_analytics_new_tracks');
		wp_clear_scheduled_hook(Analytics::CRON_HOOK);
	}
}
