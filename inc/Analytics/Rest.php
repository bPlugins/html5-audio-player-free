<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Rest
{
	const NAMESPACE_V1 = 'h5ap/v1';

	public static function register_routes()
	{
		// Public by design: pages are often fully cached, so no nonce can be required here. Collector validates everything.
		register_rest_route(self::NAMESPACE_V1, '/listen', [
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => [Collector::class, 'handle'],
			'permission_callback' => '__return_true',
		]);

		register_rest_route(self::NAMESPACE_V1, '/stats/overview', [
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => [__CLASS__, 'overview'],
			'permission_callback' => [__CLASS__, 'can_view'],
			'args'                => self::range_args(),
		]);

		register_rest_route(self::NAMESPACE_V1, '/stats/tracks', [
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => [__CLASS__, 'tracks'],
			'permission_callback' => [__CLASS__, 'can_view'],
			'args'                => self::range_args(),
		]);

		register_rest_route(self::NAMESPACE_V1, '/stats/broken/dismiss', [
			'methods'             => \WP_REST_Server::CREATABLE,
			'callback'            => [__CLASS__, 'dismiss_broken'],
			'permission_callback' => [__CLASS__, 'can_view'],
			'args'                => [
				'ids' => ['type' => 'array', 'items' => ['type' => 'integer'], 'default' => []],
			],
		]);

		register_rest_route(self::NAMESPACE_V1, '/stats/purge', [
			'methods'             => \WP_REST_Server::DELETABLE,
			'callback'            => [__CLASS__, 'purge'],
			'permission_callback' => [__CLASS__, 'can_view'],
		]);
	}

	public static function can_view()
	{
		return current_user_can('manage_options');
	}

	private static function range_args()
	{
		return ['range' => ['type' => 'string', 'default' => '7d', 'enum' => ['today', '7d']]];
	}

	private static function not_installed()
	{
		return new \WP_Error('h5ap_analytics_not_ready', __('Analytics storage is not ready yet. Reload this page to finish setting it up.', 'html5-audio-player'), ['status' => 503]);
	}

	public static function overview(\WP_REST_Request $request)
	{
		if (!Installer::is_installed()) {
			return self::not_installed();
		}
		return rest_ensure_response(Stats::overview((string) $request['range']));
	}

	public static function tracks(\WP_REST_Request $request)
	{
		if (!Installer::is_installed()) {
			return self::not_installed();
		}
		return rest_ensure_response(Stats::tracks((string) $request['range']));
	}

	public static function dismiss_broken(\WP_REST_Request $request)
	{
		if (!Installer::is_installed()) {
			return self::not_installed();
		}
		// Free shows only a count, so it always clears every flagged file.
		$ids = [];
		Stats::dismiss_broken($ids);
		return rest_ensure_response(['broken' => Stats::broken_count()]);
	}

	public static function purge()
	{
		if (!Installer::is_installed()) {
			return self::not_installed();
		}
		Installer::purge_data();
		return rest_ensure_response(['purged' => true]);
	}
}
