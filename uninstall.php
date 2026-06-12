<?php
/**
 * Uninstall handler for HTML5 Audio Player.
 *
 * Runs automatically when the plugin is deleted from Plugins > Installed Plugins.
 * Only removes data if the user has opted in via Settings > Delete Data on Uninstall.
 *
 * @package H5APPlayer
 */

// Exit if not called by WordPress uninstall routine.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Run the uninstall process within a function scope to avoid global variable warnings.
 */
function h5ap_uninstall_plugin() {
	// Respect the user's choice — only delete if they opted in.
	$delete_data = get_option( 'h5ap_delete_data_on_uninstall', false );

	if ( ! $delete_data ) {
		return; // User chose to keep data. Exit without deleting anything.
	}

	global $wpdb;

	// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.SlowDBQuery

	// -------------------------------------------------------------------------
	// 1. Delete all 'audioplayer' posts and their post meta.
	// -------------------------------------------------------------------------
	$audioplayer_ids = $wpdb->get_col(
		$wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = %s", 'audioplayer' )
	);

	if ( ! empty( $audioplayer_ids ) ) {
		foreach ( $audioplayer_ids as $post_id ) {
			wp_delete_post( (int) $post_id, true ); // Force delete — bypass trash.
		}
	}

	// -------------------------------------------------------------------------
	// 2. Delete all 'radioplayer' posts and their post meta.
	// -------------------------------------------------------------------------
	$radioplayer_ids = $wpdb->get_col(
		$wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = %s", 'radioplayer' )
	);

	if ( ! empty( $radioplayer_ids ) ) {
		foreach ( $radioplayer_ids as $post_id ) {
			wp_delete_post( (int) $post_id, true ); // Force delete — bypass trash.
		}
	}

	// -------------------------------------------------------------------------
	// 3. Delete any orphaned post meta (safety net for meta on other post types).
	// -------------------------------------------------------------------------
	$h5ap_meta_keys = array(
		'_h5ap_plyr',
		'_h5ap_plyr_skins',
		'_h5applaylist',
		'h5ap_radio_sources',
		'_ahp_quick-audio-file',
	);

	foreach ( $h5ap_meta_keys as $meta_key ) {
		$wpdb->delete(
			$wpdb->postmeta,
			array( 'meta_key' => $meta_key ),
			array( '%s' )
		);
	}

	// -------------------------------------------------------------------------
	// 4. Delete taxonomy terms created by this plugin.
	// -------------------------------------------------------------------------
	$h5ap_taxonomies = array(
		'audio-player-category',
		'audio-player-tags',
		'radioplayer-category',
		'radioplayer-tags',
	);

	foreach ( $h5ap_taxonomies as $taxonomy ) {
		$term_ids = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT term_id FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
				$taxonomy
			)
		);

		if ( ! empty( $term_ids ) ) {
			foreach ( $term_ids as $term_id ) {
				$wpdb->delete( $wpdb->term_relationships, array( 'term_taxonomy_id' => (int) $term_id ) );
				$wpdb->delete( $wpdb->term_taxonomy, array( 'term_taxonomy_id' => (int) $term_id ) );
				$wpdb->delete( $wpdb->terms, array( 'term_id' => (int) $term_id ) );
			}
		}
	}

	// -------------------------------------------------------------------------
	// 5. Delete plugin options from wp_options.
	// -------------------------------------------------------------------------
	$h5ap_options = array(
		'h5ap_settings',
		'h5ap-notice-import',
		'h5ap_delete_data_on_uninstall', // The setting itself.
	);

	foreach ( $h5ap_options as $option_key ) {
		delete_option( $option_key );
	}

	// -------------------------------------------------------------------------
	// 6. Delete transients.
	// -------------------------------------------------------------------------
	delete_transient( 'h5ap_license_status' );

	// phpcs:enable WordPress.DB.DirectDatabaseQuery, WordPress.DB.SlowDBQuery
}

h5ap_uninstall_plugin();
