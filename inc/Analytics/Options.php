<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Options
{
	const OPTION = 'h5ap_settings';
	const DEFAULT_RETENTION = 90;

	private static function raw($key)
	{
		$options = get_option(self::OPTION);
		return (is_array($options) && array_key_exists($key, $options)) ? $options[$key] : null;
	}

	// CSF saves a switched-off switcher as '0' or '', so only a missing key falls back to the default.
	private static function flag($key, $default)
	{
		$value = self::raw($key);
		if ($value === null) {
			return $default;
		}
		return $value === true || $value === 1 || $value === '1';
	}

	public static function enabled()
	{
		return self::flag('analytics_enable', true);
	}

	public static function exclude_admins()
	{
		return self::flag('analytics_exclude_admins', true);
	}

	public static function retention_days()
	{
		$days = (int) self::raw('analytics_retention');
		if ($days <= 0) {
			return self::DEFAULT_RETENTION;
		}
		return max(30, min(730, $days));
	}

	public static function section_title()
	{
		return __('Analytics', 'html5-audio-player');
	}

	// Link that opens the Analytics tab directly. Codestar builds the tab hash from sanitize_title() of the section title.
	public static function settings_url()
	{
		return admin_url('admin.php?page=html5-audio-player-settings#tab=' . sanitize_title(self::section_title()));
	}

	public static function register_settings_section()
	{
		if (!class_exists('\CSF')) {
			return;
		}

		\CSF::createSection(self::OPTION, array(
			'id'     => 'h5ap_analytics_tab',
			'title'  => self::section_title(),
			'icon'   => 'fas fa-chart-bar',
			'fields' => array(
				array(
					'id'      => 'analytics_enable',
					'type'    => 'switcher',
					'title'   => __('Enable Analytics', 'html5-audio-player'),
					'desc'    => __('Count plays and listening time for every player. No cookies are used and IP addresses are never stored.', 'html5-audio-player'),
					'default' => true,
				),
				array(
					'id'         => 'analytics_exclude_admins',
					'type'       => 'switcher',
					'title'      => __('Exclude administrators', 'html5-audio-player'),
					'desc'       => __('Do not count plays from logged-in administrators.', 'html5-audio-player'),
					'default'    => true,
					'dependency' => array('analytics_enable', '==', 'true'),
				),
				array(
					'id'         => 'analytics_retention',
					'type'       => 'number',
					'title'      => __('Delete old listen records after', 'html5-audio-player'),
					'desc'       => __('Keeps the database small. Totals, charts and reports are never deleted. Between 30 and 730 days.', 'html5-audio-player'),
					'unit'       => __('days', 'html5-audio-player'),
					'default'    => self::DEFAULT_RETENTION,
					'attributes' => array('min' => 30, 'max' => 730),
					'dependency' => array('analytics_enable', '==', 'true'),
				),
			),
		));
	}
}
