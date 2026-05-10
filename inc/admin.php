<?php

if (!class_exists('H5APAdmin')) {
	class H5APAdmin
	{
		function __construct()
		{
			add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
			add_action('admin_menu', [$this, 'adminMenu']);
		}

		function adminEnqueueScripts($hook){
			if (str_contains($hook, 'html5-audio-player')) {
				wp_enqueue_style('h5ap-admin-style', H5AP_PRO_PLUGIN_DIR . 'build/dashboard.css', [], H5AP_PRO_VERSION);

				wp_enqueue_script('h5ap-admin-script', H5AP_PRO_PLUGIN_DIR . 'build/dashboard.js', ['react', 'react-dom',  'wp-components', 'wp-i18n', 'wp-api', 'wp-util', 'lodash', 'wp-media-utils', 'wp-data', 'wp-core-data', 'wp-api-request'], H5AP_PRO_VERSION, true);
				
				wp_localize_script( 'h5ap-admin-script', 'h5apDashboard', [
					'dir' => H5AP_PRO_PLUGIN_DIR,
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
				H5AP_PRO_PLUGIN_DIR . '/assets/images/icn.png',
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
								'version'               => H5AP_PRO_VERSION,
								'isPremium'             => false,
								'hasPro'                => false,
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
	}
	new H5APAdmin;
}
