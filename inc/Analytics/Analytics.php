<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Analytics
{
	const MENU_SLUG = 'html5-audio-player-analytics';
	const PARENT_SLUG = 'html5-audio-player';
	const CRON_HOOK = 'h5ap_analytics_daily';
	const SCRIPT_HANDLE = 'h5ap-analytics-admin';

	protected $page_hook = '';

	public function register()
	{
		add_action('admin_init', [Installer::class, 'maybe_install']);
		add_action('admin_init', [$this, 'privacy_policy']);
		add_action('init', [Options::class, 'register_settings_section'], 1);
		add_action('rest_api_init', [Rest::class, 'register_routes']);
		add_action('wp_enqueue_scripts', [$this, 'front_config'], 99);
		add_action('admin_menu', [$this, 'admin_menu'], 20);
		add_action('admin_enqueue_scripts', [$this, 'admin_assets']);
		add_action('admin_enqueue_scripts', [$this, 'badge_label'], 20);
		add_action('init', [$this, 'schedule_cleanup']);
		add_action(self::CRON_HOOK, [$this, 'cleanup']);
	}

	// The free plugin only ships the free reports.
	public static function is_pro()
	{
		return false;
	}

	public static function asset_url($path)
	{
		return H5AP_PLUGIN_DIR . $path;
	}

	public static function asset_path($path)
	{
		return dirname(__DIR__, 2) . '/' . $path;
	}

	// Marks the block wrapper with the CPT post it came from, so per-player totals can be shown in the admin lists.
	// Small "New" label shown next to the Analytics entry points while the feature is new.
	public static function new_badge()
	{
		return ' <span class="h5ap-an-new-badge">' . esc_html__('New', 'html5-audio-player') . '</span>';
	}

	// Translated text for the CSS-only "New" labels (settings tab, meta box ribbon).
	public function badge_label()
	{
		if (wp_style_is('h5ap-admin-menu', 'enqueued')) {
			wp_add_inline_style('h5ap-admin-menu', ':root{--h5ap-an-new:' . wp_json_encode(wp_strip_all_tags(__('New', 'html5-audio-player'))) . ';}');
		}
	}

	public static function ref_attr($attributes)
	{
		$post_id = 0;
		if (!empty($attributes['analyticsRef'])) {
			$post_id = absint($attributes['analyticsRef']);
		} elseif (!empty($attributes['uniqueId']) && preg_match('/^player(\d+)$/', (string) $attributes['uniqueId'], $match)) {
			$post_id = (int) $match[1];
		}
		return $post_id ? ' data-h5ap-ref="' . esc_attr($post_id) . '"' : '';
	}

	public function front_config()
	{
		if (!Options::enabled() || !Installer::is_installed() || !wp_script_is('bplugins-plyrio', 'registered')) {
			return;
		}
		if (Options::exclude_admins() && current_user_can('manage_options')) {
			return;
		}
		// Editing and previewing are not real listens.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only check of Elementor's preview flag.
		if (is_preview() || is_customize_preview() || isset($_GET['elementor-preview'])) {
			return;
		}

		if (is_singular()) {
			$page_type = 'single';
		} elseif (is_front_page() || is_home()) {
			$page_type = 'home';
		} elseif (is_archive() || is_search()) {
			$page_type = 'archive';
		} else {
			$page_type = 'other';
		}

		$config = [
			'endpoint' => esc_url_raw(rest_url(Rest::NAMESPACE_V1 . '/listen')),
			'pid'      => is_singular() ? (int) get_queried_object_id() : 0,
			'pt'       => $page_type,
		];

		wp_add_inline_script('bplugins-plyrio', 'window.h5apAnalytics = ' . wp_json_encode($config) . ';', 'before');
	}

	public function admin_menu()
	{
		$this->page_hook = add_submenu_page(
			static::PARENT_SLUG,
			__('Analytics', 'html5-audio-player'),
			__('Analytics', 'html5-audio-player') . self::new_badge(),
			'manage_options',
			self::MENU_SLUG,
			[$this, 'render_page']
		);
	}

	public function render_page()
	{
		echo '<div class="wrap h5ap-analytics-wrap"><hr class="wp-header-end"><div id="h5ap-analytics-root">';
		$this->render_shell();
		echo '</div></div>';
	}

	/**
	 * Same header and grey placeholders the React app shows, printed by PHP so slow connections
	 * see the page right away instead of an empty screen. React replaces it once the script has loaded.
	 */
	protected function render_shell()
	{
		$data = $this->admin_data();
		$bone = function ($width, $height) {
			return '<span class="h5ap-an-skel" style="width:' . esc_attr($width) . ';height:' . esc_attr($height) . '"></span>';
		};
		$stack = function ($a, $b) {
			return '<div class="h5ap-an-skel-stack">' . $a . $b . '</div>';
		};
		$icon = function ($paths) {
			return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $paths . '</svg>';
		};
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- markup built above from escaped values and fixed SVG.
		?>
		<div class="h5ap-an" aria-busy="true">
			<div class="h5ap-an-bar"><div class="h5ap-an-bar__inner">
				<div class="h5ap-an-bar__brand">
					<span class="h5ap-an-bar__logo"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="9" fill="#04a504"></rect><path d="M7 21h6l3-7 5 13 4-10 2 4h6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
					<strong><?php echo esc_html($data['name']); ?></strong>
					<?php if ($data['version'] !== '') : ?>
						<span class="h5ap-an-version">v<?php echo esc_html($data['version']); ?></span>
					<?php endif; ?>
				</div>
				<?php if (!$data['isPro']) : ?>
					<div class="h5ap-an-bar__actions">
						<a class="h5ap-an-btn is-gradient" href="<?php echo esc_url($data['upgradeUrl']); ?>" target="_blank" rel="noopener noreferrer"><?php echo $icon('<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"></path>'); ?><?php esc_html_e('Upgrade to Pro', 'html5-audio-player'); ?></a>
					</div>
				<?php endif; ?>
			</div></div>

			<main class="h5ap-an-main">
				<section class="h5ap-an-hero h5ap-an-header">
					<div class="h5ap-an-hero__text">
						<div class="h5ap-an-tags">
							<span class="h5ap-an-tag <?php echo $data['enabled'] ? 'is-live' : 'is-off'; ?>"><i aria-hidden="true"></i><?php echo $data['enabled'] ? esc_html__('Tracking on', 'html5-audio-player') : esc_html__('Tracking paused', 'html5-audio-player'); ?></span>
							<span class="h5ap-an-tag is-solid"><?php echo $data['isPro'] ? esc_html__('Pro plan', 'html5-audio-player') : esc_html__('Free plan', 'html5-audio-player'); ?></span>
						</div>
						<h1><?php esc_html_e('Audio Analytics', 'html5-audio-player'); ?></h1>
						<p><?php esc_html_e('See how your audio performs: plays, listening time and where people stop.', 'html5-audio-player'); ?></p>
					</div>
					<div class="h5ap-an-range"><?php echo $bone('360px', '42px'); ?></div>
				</section>

				<?php if ($data['installed']) : ?>
					<div class="h5ap-an-stack">
						<span class="screen-reader-text" role="status"><?php esc_html_e('Loading analytics…', 'html5-audio-player'); ?></span>
						<section class="h5ap-an-overview">
							<div class="h5ap-an-stats">
								<?php for ($i = 0; $i < 4; $i++) : ?>
									<div class="h5ap-an-stat"><?php echo $bone('50%', '14px') . $bone('60%', '34px') . $bone('75%', '14px'); ?></div>
								<?php endfor; ?>
							</div>
							<div class="h5ap-an-overview__chart">
								<div class="h5ap-an-overview__caption"><?php echo $bone('130px', '16px') . $bone('210px', '42px'); ?></div>
								<div class="h5ap-an-skel-chart"><span></span><span></span><span></span><span></span><span></span></div>
							</div>
						</section>
						<section class="h5ap-an-panel is-flush">
							<header class="h5ap-an-panel__head"><?php echo $stack($bone('150px', '26px'), $bone('260px', '14px')); ?></header>
							<div class="h5ap-an-skel-rows">
								<?php for ($i = 0; $i < 5; $i++) : ?>
									<div class="h5ap-an-skel-row"><?php echo $bone('30px', '30px') . $stack($bone((60 - ($i % 3) * 10) . '%', '14px'), $bone('60px', '12px')) . $bone('40px', '14px') . $bone('60px', '14px'); ?></div>
								<?php endfor; ?>
							</div>
						</section>
					</div>
				<?php endif; ?>
			</main>
		</div>
		<?php
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	public function admin_assets($hook)
	{
		if ($this->page_hook === '' || $hook !== $this->page_hook) {
			return;
		}

		$asset_file = self::asset_path('build/analytics.asset.php');
		if (!file_exists($asset_file)) {
			return;
		}
		$asset = include $asset_file;

		wp_enqueue_script(self::SCRIPT_HANDLE, self::asset_url('build/analytics.js'), $asset['dependencies'], $asset['version'], true);
		wp_enqueue_style(self::SCRIPT_HANDLE, self::asset_url('build/analytics.css'), ['wp-components'], $asset['version']);
		wp_set_script_translations(self::SCRIPT_HANDLE, 'html5-audio-player', self::asset_path('languages'));

		wp_localize_script(self::SCRIPT_HANDLE, 'h5apAnalyticsAdmin', $this->admin_data());
	}

	protected function admin_data()
	{
		return [
			'name'        => 'HTML5 Audio Player',
			'version'     => defined('H5AP_VERSION') ? (string) H5AP_VERSION : '',
			'isPro'       => self::is_pro(),
			'enabled'     => Options::enabled(),
			'installed'   => Installer::is_installed(),
			'retention'   => Options::retention_days(),
			'today'       => current_time('Y-m-d'),
			'settingsUrl' => admin_url('admin.php?page=html5-audio-player-settings'),
			'analyticsSettingsUrl' => Options::settings_url(),
			'upgradeUrl'  => $this->upgrade_url(),
		];
	}

	protected function upgrade_url()
	{
		return admin_url('admin.php?page=html5-audio-player-help-demo#/pricing');
	}

	public function schedule_cleanup()
	{
		if (!wp_next_scheduled(self::CRON_HOOK)) {
			wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', self::CRON_HOOK);
		}
	}

	// Removes detailed rows older than the retention window. Daily totals stay, so charts keep their history.
	public function cleanup()
	{
		if (!Installer::is_installed()) {
			return;
		}
		global $wpdb;
		$listens = Installer::table('listens');
		$daily = Installer::table('daily');
		$cutoff = gmdate('Y-m-d H:i:s', time() - Options::retention_days() * DAY_IN_SECONDS);

		for ($i = 0; $i < 50; $i++) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
			$deleted = $wpdb->query($wpdb->prepare(
				"DELETE FROM %i WHERE created_at < %s LIMIT 5000",
				$listens,
				$cutoff
			));
			if (!$deleted) {
				break;
			}
		}

		// Error rows hold one row per visitor and are only needed for the recent broken-audio check.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom analytics table, live stats must not be cached.
		$wpdb->query($wpdb->prepare(
			"DELETE FROM %i WHERE metric = 'error' AND date < %s",
			$daily,
			gmdate('Y-m-d', time() - 30 * DAY_IN_SECONDS)
		));
	}

	public function privacy_policy()
	{
		if (!function_exists('wp_add_privacy_policy_content')) {
			return;
		}
		$content = '<p>' . __('This site counts how often audio players are played and for how long, using the HTML5 Audio Player plugin. No cookies are set and IP addresses are not stored. A short identifier is derived from the IP address and browser and changes every day, so visitors cannot be followed over time. The page, device type, browser and referring website are recorded together with listening time.', 'html5-audio-player') . '</p>';
		wp_add_privacy_policy_content('HTML5 Audio Player', wp_kses_post($content));
	}
}
