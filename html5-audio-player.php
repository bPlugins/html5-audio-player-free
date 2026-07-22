<?php
/*
 * Plugin Name: HTML5 Audio Player - The Ultimate No-Code Podcast, MP3 & Audio Player
 * Plugin URI:  https://bplugins.com/products/html5-audio-player/
 * Description: You can easily integrate html5 audio player in your WordPress website using this plugin.
 * Version: 2.8.0
 * Requires at least: 6.5
 * Tested up to: 7.0
 * Requires PHP: 7.1
 * Author: bPlugins
 * Author URI: http://bPlugins.com
 * License: GPLv2 or later
 * Text Domain: html5-audio-player
 */

if (!defined('ABSPATH')) {
    exit;
}

if (function_exists('h5ap_fs')) {
	h5ap_fs()->set_basename(true, __FILE__);
} else {
	define('H5AP_PLUGIN_DIR', plugin_dir_url(__FILE__));
	define('H5AP_VERSION', isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'dev.local' ? time() : '2.8.0');

	if (file_exists(dirname(__FILE__) . '/vendor/autoload.php')) {
		require_once(dirname(__FILE__) . '/vendor/autoload.php');
	}

	if (file_exists(dirname(__FILE__) . '/inc/functions.php')) {
		require_once(dirname(__FILE__) . '/inc/functions.php');
	}

	if (!class_exists('CSF')) {
		require_once(dirname(__FILE__) . '/vendor/codestar-framework/codestar-framework.php');
	}

	if (! function_exists('h5ap_fs')) {
		// Create a helper function for easy SDK access.
		function h5ap_fs(){
			global $h5ap_fs;

			if (! isset($h5ap_fs)) {
			// Include Freemius SDK.
			// SDK is auto-loaded through composer
				$h5ap_fs = fs_dynamic_init(array(
					'id'                  => '14260',
					'slug'                => 'html5-audio-player',
					'type'                => 'plugin',
					'public_key'          => 'pk_ea4da01be073820a5edf59346b675',
					'is_premium'          => false,
					'premium_slug'        => 'html5-audio-player-pro',
					'premium_suffix'      => 'Pro',
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'has_affiliation'     => 'selected',
					'menu'                => array(
						'slug'           => 'html5-audio-player',
						'support'        => false,
						'contact'        => false,
						'affiliation'      => false,
					),
				));
			}

			return $h5ap_fs;
		}

		// Init Freemius.
		h5ap_fs();
		// Signal that SDK was initiated.
		do_action('h5ap_fs_loaded');
	}

	if (class_exists('H5APPlayer\\Init')) {
		H5APPlayer\Init::register_services();
	}

	add_action('plugins_loaded', function () {
		require_once 'shortcode/player.php';
		require_once 'inc/admin.php';
		require_once('tinymce/ewic-tinymce.php');
		require_once(__DIR__ . '/blocks.php');
		require_once(__DIR__ . '/blocks/init.php');

		add_filter('template_include', 'h5ap_search_template');
		function h5ap_search_template($template){
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if (!isset($_GET['bps']))
				return $template;

			return dirname(__FILE__) . '/inc/Template/search.php';
		} 
	});


	add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'h5ap_add_help_demo_link' );

	function h5ap_add_help_demo_link( $links ) {

		$help_link = '<a href="' . admin_url( 'admin.php?page=html5-audio-player-help-demo' ) . '" style="color:#FF7A00;font-weight:bold;">Help & Demos</a>';

		$links[] = $help_link;

		return $links;
	}
	
}


