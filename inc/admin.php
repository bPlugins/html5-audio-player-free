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
			add_filter('parent_file', [$this, 'h5ap_active_parent_file']);
			add_action('all_admin_notices', [$this, 'render_taxonomy_tabs']);
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

			add_submenu_page(
				'html5-audio-player',
				__('Categories', 'html5-audio-player'),
				__('Categories', 'html5-audio-player'),
				'manage_categories',
				'edit-tags.php?taxonomy=audio-player-category&post_type=audioplayer',
				''
			);

			add_submenu_page(
				'html5-audio-player',
				__('Tags', 'html5-audio-player'),
				__('Tags', 'html5-audio-player'),
				'manage_categories',
				'edit-tags.php?taxonomy=audio-player-tags&post_type=audioplayer',
				''
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

		/**
		 * WordPress' own edit-tags.php hardcodes $parent_file to "edit.php?post_type=$post_type"
		 * (see wp-admin/edit-tags.php), which never matches our custom top-level menu slug
		 * ('html5-audio-player') because the audioplayer/radioplayer post types are registered
		 * with show_in_menu set to that custom slug instead of true. Without this filter the
		 * "HTML5 Audio Player" parent menu never gets its wp-has-current-submenu/wp-menu-open
		 * classes on the Categories/Tags/Radio Categories/Radio Tags screens, so it renders collapsed.
		 */
		function h5ap_active_parent_file($parent_file) {
			global $pagenow;
			if ($pagenow === 'edit-tags.php') {
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
				if (isset($_GET['taxonomy'])) {
					// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
					$taxonomy = sanitize_text_field(wp_unslash($_GET['taxonomy']));
					if (in_array($taxonomy, array('audio-player-category', 'audio-player-tags', 'radioplayer-category', 'radioplayer-tags'), true)) {
						return 'html5-audio-player';
					}
				}
			}
			return $parent_file;
		}

		function h5ap_active_submenu_file($submenu_file, $parent_file) {
			global $pagenow;
			if ($parent_file === 'html5-audio-player') {
				if ($pagenow === 'post-new.php') {
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
				} elseif ($pagenow === 'edit-tags.php') {
					// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
					if (isset($_GET['taxonomy'])) {
						// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only, no state change
						$taxonomy = sanitize_text_field(wp_unslash($_GET['taxonomy']));
						// WP core's edit-tags.php hardcodes $submenu_file with "&amp;" instead of a
						// plain "&" (see wp-admin/edit-tags.php), so it never exactly matches the
						// slug we registered via add_submenu_page(). Always return our own
						// correctly-formatted slug here (for both the audio-player-* taxonomies
						// themselves and the radioplayer-* ones, which share the same tab) so the
						// "current" highlight actually applies.
						if ($taxonomy === 'audio-player-category' || $taxonomy === 'radioplayer-category') {
							return 'edit-tags.php?taxonomy=audio-player-category&post_type=audioplayer';
						} elseif ($taxonomy === 'audio-player-tags' || $taxonomy === 'radioplayer-tags') {
							return 'edit-tags.php?taxonomy=audio-player-tags&post_type=audioplayer';
						}
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
						$submenu['html5-audio-player'][$key][4] = 'h5ap-group-divider';
					} elseif ($item[2] === 'edit.php?post_type=radioplayer') {
						$submenu['html5-audio-player'][$key][0] = __('Radio players', 'html5-audio-player');
					} elseif ($item[2] === 'html5-radio-player-add-new') {
						$submenu['html5-audio-player'][$key][0] = __('Add radio', 'html5-audio-player');
						$submenu['html5-audio-player'][$key][4] = 'h5ap-group-divider';
					} elseif ($item[2] === 'edit-tags.php?taxonomy=audio-player-category&post_type=audioplayer') {
						$submenu['html5-audio-player'][$key][0] = __('Categories', 'html5-audio-player');
					} elseif ($item[2] === 'edit-tags.php?taxonomy=audio-player-tags&post_type=audioplayer') {
						$submenu['html5-audio-player'][$key][0] = __('Tags', 'html5-audio-player');
						$submenu['html5-audio-player'][$key][4] = 'h5ap-group-divider';
					} elseif ($item[2] === 'html5-audio-player-help-demo') {
						$submenu['html5-audio-player'][$key][0] = __('Help & Demos', 'html5-audio-player');
					} elseif ($item[2] === 'html5-audio-player-settings') {
						$submenu['html5-audio-player'][$key][0] = __('Settings', 'html5-audio-player');
					}
				}

				$desired_order = array(
					'edit.php?post_type=audioplayer',
					'html5-audio-player',
					'html5-audio-player-add-new',
					'edit.php?post_type=radioplayer',
					'html5-radio-player-add-new',
					'edit-tags.php?taxonomy=audio-player-category&post_type=audioplayer',
					'edit-tags.php?taxonomy=audio-player-tags&post_type=audioplayer',
					'html5-audio-player-settings',
					'html5-audio-player-help-demo',
				);

				$reordered = array();
				$items_by_slug = array();
				foreach ($submenu['html5-audio-player'] as $item) {
					$items_by_slug[$item[2]] = $item;
				}

				foreach ($desired_order as $slug) {
					if (isset($items_by_slug[$slug])) {
						$reordered[] = $items_by_slug[$slug];
						unset($items_by_slug[$slug]);
					}
				}

				foreach ($items_by_slug as $item) {
					$reordered[] = $item;
				}

				$submenu['html5-audio-player'] = $reordered;
			}
		}

		function render_taxonomy_tabs() {
			global $pagenow;
			if ($pagenow !== 'edit-tags.php') {
				return;
			}
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only check for rendering admin tab bar
			$taxonomy = isset($_GET['taxonomy']) ? sanitize_text_field(wp_unslash($_GET['taxonomy'])) : '';

			if (in_array($taxonomy, ['audio-player-category', 'radioplayer-category'], true)) {
				$audio_url = admin_url('edit-tags.php?taxonomy=audio-player-category&post_type=audioplayer');
				$radio_url = admin_url('edit-tags.php?taxonomy=radioplayer-category&post_type=radioplayer');
				$is_audio  = ($taxonomy === 'audio-player-category');
				$is_radio  = ($taxonomy === 'radioplayer-category');
				?>
				<div class="wrap h5ap-taxonomy-tabs-wrap" style="margin-top: 15px; margin-bottom: 10px;">
					<h2 class="nav-tab-wrapper">
						<a href="<?php echo esc_url($audio_url); ?>" class="nav-tab <?php echo $is_audio ? 'nav-tab-active' : ''; ?>">
							<span class="dashicons dashicons-format-audio" style="margin-right: 5px; vertical-align: middle;"></span><?php esc_html_e('Audio Player Categories', 'html5-audio-player'); ?>
						</a>
						<a href="<?php echo esc_url($radio_url); ?>" class="nav-tab <?php echo $is_radio ? 'nav-tab-active' : ''; ?>">
							<span class="dashicons dashicons-controls-volumeon" style="margin-right: 5px; vertical-align: middle;"></span><?php esc_html_e('Radio Categories', 'html5-audio-player'); ?>
						</a>
					</h2>
				</div>
				<?php
			} elseif (in_array($taxonomy, ['audio-player-tags', 'radioplayer-tags'], true)) {
				$audio_url = admin_url('edit-tags.php?taxonomy=audio-player-tags&post_type=audioplayer');
				$radio_url = admin_url('edit-tags.php?taxonomy=radioplayer-tags&post_type=radioplayer');
				$is_audio  = ($taxonomy === 'audio-player-tags');
				$is_radio  = ($taxonomy === 'radioplayer-tags');
				?>
				<div class="wrap h5ap-taxonomy-tabs-wrap" style="margin-top: 15px; margin-bottom: 10px;">
					<h2 class="nav-tab-wrapper">
						<a href="<?php echo esc_url($audio_url); ?>" class="nav-tab <?php echo $is_audio ? 'nav-tab-active' : ''; ?>">
							<span class="dashicons dashicons-tag" style="margin-right: 5px; vertical-align: middle;"></span><?php esc_html_e('Audio Player Tags', 'html5-audio-player'); ?>
						</a>
						<a href="<?php echo esc_url($radio_url); ?>" class="nav-tab <?php echo $is_radio ? 'nav-tab-active' : ''; ?>">
							<span class="dashicons dashicons-tag" style="margin-right: 5px; vertical-align: middle;"></span><?php esc_html_e('Radio Tags', 'html5-audio-player'); ?>
						</a>
					</h2>
				</div>
				<?php
			}
		}
	}
	new H5APAdmin;
}
