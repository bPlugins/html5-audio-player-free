<?php
namespace H5APPlayer\Elementor\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use H5APPlayer\Helper\Functions;
use H5APPlayer\Helper\LocalizeScript;

final class Register
{

	const VERSION = '2.2.7';

	const MINIMUM_ELEMENTOR_VERSION = '2.0.0';

	const MINIMUM_PHP_VERSION = '7.0';

	private static $_instance = null;

	public static function instance()
	{

		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function register()
	{

		// if ( is_null( self::$_instance ) ) {
		// 	self::$_instance = new self();
		// }
		// return self::$_instance;

	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 */
	public function __construct()
	{

		//Register Frontend Script
		add_action("elementor/frontend/after_register_scripts", [$this, 'frontend_assets_scripts']);

		// Add Plugin actions
		add_action('elementor/widgets/register', [$this, 'init_widgets']);

		add_action('elementor/controls/controls_registered', [$this, 'init_controls']);
	}

	public function init_controls($controls_manager)
	{
		// Register controls
		$controls_manager->register(new \H5APPlayer\Elementor\Controls\SelectFile());
	}


	/**
	 * Frontend script
	 */
	public function frontend_assets_scripts()
	{
		// library
		wp_register_script('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js', array('jquery'), H5AP_VERSION, false);
		wp_register_style('bplugins-plyrio', H5AP_PLUGIN_DIR . 'assets/css/plyr-v3.7.2.css', array(), H5AP_VERSION, 'all');

		// player
		wp_register_script('h5ap-player', H5AP_PLUGIN_DIR . 'build/player.js', array('jquery', 'bplugins-plyrio'), time(), true);
		wp_register_style('h5ap-player', H5AP_PLUGIN_DIR . 'build/player.css', array('bplugins-plyrio'), H5AP_VERSION);
		wp_localize_script('h5ap-player', 'h5ap_i18n', LocalizeScript::translatedText());

		wp_localize_script('h5ap-player', 'h5apPlayer', [
			'speed' => explode(',', Functions::getSetting('speed', '0.5, 1, 1.5, 2.0, 2.5')),
			'multipleAudio' => (bool) Functions::getSetting('multipleAudio', false),
			'plyrio_js' => H5AP_PLUGIN_DIR . 'assets/js/plyr-v3.7.2.js',
			'plyr_js' => H5AP_PLUGIN_DIR . 'build/player.js',
			'isPipe' => false
		]);
	}

	public function init_widgets()
	{
		// Include Widget files
		\Elementor\Plugin::instance()->widgets_manager->register(new Simple());
	}
}

Register::instance();
