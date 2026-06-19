<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if (!class_exists('H5APAdmin')) {
	class H5APAdmin
	{
		function __construct()
		{
			add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
			add_action('admin_menu', [$this, 'adminMenu']);
			add_action('admin_menu', [$this, 'h5ap_rename_submenus'], 999);
			add_filter('submenu_file', [$this, 'h5ap_active_submenu_file'], 10, 2);
		}

		function adminEnqueueScripts($hook){
			if (strpos($hook, 'html5-audio-player') !== false) {
				wp_enqueue_style('h5ap-admin-style', H5AP_PLUGIN_DIR . 'build/dashboard.css', [], H5AP_VERSION);

				wp_enqueue_script('h5ap-admin-script', H5AP_PLUGIN_DIR . 'build/dashboard.js', ['react', 'react-dom',  'wp-components', 'wp-i18n', 'wp-api', 'wp-util', 'lodash', 'wp-media-utils', 'wp-data', 'wp-core-data', 'wp-api-request'], H5AP_VERSION, true);
				
				wp_localize_script( 'h5ap-admin-script', 'h5apDashboard', [
					'dir' => H5AP_PLUGIN_DIR,
				] );
			}
		}
		

		function adminMenu() {

			add_menu_page(
				__('HTML5 Audio Player', 'html5-audio-player'),
				__('HTML5 Audio Player', 'html5-audio-player'),
				'manage_options',
				'html5-audio-player',
				 [$this, 'dashboardPage'],
				H5AP_PLUGIN_DIR . '/assets/images/icn.png',
				14
			);

			add_submenu_page(
				'html5-audio-player',
				__('Help & Demos', 'html5-audio-player'),
				'<span style="color: #f18500; font-weight: 600;">Help & Demos</span>', 
				'manage_options',
				'html5-audio-player-help-demo',
				[$this, 'dashboardPage'],
				50
			);

			add_submenu_page(
				'html5-audio-player',
				__('Add New', 'html5-audio-player'),
				__(' &#8627; Add New', 'html5-audio-player'),
				'edit_posts',
				'html5-audio-player-add-new',
				[$this, 'redirectToAddNew'],
				1
			);

			add_submenu_page(
				'html5-audio-player',
				__('Add New', 'html5-audio-player'),
				__(' &#8627; Add New', 'html5-audio-player'),
				'edit_posts',
				'html5-radio-player-add-new',
				[$this, 'redirectToAddNewRadio'],
				3
			);

		}

		function dashboardPage(){ 
		 ?>
			<div
				id='h5apAdminDashboard'
				data-info='<?php echo esc_attr(wp_json_encode([
								'version'               => H5AP_VERSION,
								'isPremium'             => false,
								'hasPro'                => false,
								'adminUrl' => admin_url(),
								'isElementorActive'     => class_exists( '\Elementor\Plugin' ),
								'deleteDataOnUninstall' => (bool) get_option( 'h5ap_delete_data_on_uninstall', false ),
								'uninstallNonce'        => wp_create_nonce( 'h5ap_uninstall_nonce' ),
							])); ?>'></div>
		 <?php 
		}


		
		function redirectToAddNew()
				{
					if (function_exists('headers_sent') && headers_sent()) {
					?>
						<script>
							window.location.href = "<?php echo esc_url(admin_url('post-new.php?post_type=audioplayer')); ?>";
						</script>
					<?php
					} else {
						wp_safe_redirect(admin_url('post-new.php?post_type=audioplayer'));
					}
				}

				/**	
				 * Redirect to add new Model Viewer
				 * */
				function redirectToAddNewRadio(){
					if (function_exists('headers_sent') && headers_sent()) {
					?>
						<script>
							window.location.href = "<?php echo esc_url(admin_url('post-new.php?post_type=radioplayer')); ?>";
						</script>
		<?php
			} else {
				wp_safe_redirect(admin_url('post-new.php?post_type=radioplayer'));
			}
		}

		function h5ap_active_submenu_file($submenu_file, $parent_file) {
			global $pagenow;
			if ($parent_file === 'html5-audio-player' && $pagenow === 'post-new.php') {
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
				if (isset($_GET['post_type'])) {
					// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
					$post_type = sanitize_text_field(wp_unslash($_GET['post_type']));
					if ($post_type === 'audioplayer') {
						return 'html5-audio-player-add-new';
					} elseif ($post_type === 'radioplayer') {
						return 'html5-radio-player-add-new';
					}
				}
			}
			return $submenu_file;
		}

		function h5ap_rename_submenus() {
			global $submenu;
			if (isset($submenu['html5-audio-player'])) {
				foreach ($submenu['html5-audio-player'] as $key => $item) {
					if ($item[2] === 'edit.php?post_type=audioplayer' || $item[2] === 'html5-audio-player') {
						$submenu['html5-audio-player'][$key][0] = __('All players', 'html5-audio-player');
					} elseif ($item[2] === 'html5-audio-player-add-new') {
						$submenu['html5-audio-player'][$key][0] = __('Add player', 'html5-audio-player');
					} elseif ($item[2] === 'edit.php?post_type=radioplayer') {
						$submenu['html5-audio-player'][$key][0] = __('Radio players', 'html5-audio-player');
					} elseif ($item[2] === 'html5-radio-player-add-new') {
						$submenu['html5-audio-player'][$key][0] = __('Add radio', 'html5-audio-player');
					} elseif ($item[2] === 'html5-audio-player-help-demo') {
						$submenu['html5-audio-player'][$key][0] = __('Help & Demos', 'html5-audio-player');
					} elseif ($item[2] === 'html5-audio-player-settings') {
						$submenu['html5-audio-player'][$key][0] = __('Settings', 'html5-audio-player');
					}
				}
			}
		}
	}
	new H5APAdmin;
}
