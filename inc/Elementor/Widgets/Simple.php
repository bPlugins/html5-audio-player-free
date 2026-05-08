<?php

namespace H5APPlayer\Elementor\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Core\Schemes\Color;

if (! defined('ABSPATH')) exit; // Exit if accessed directly

/**
 * Elementor Hello World
 *
 * Elementor widget for hello world.
 *
 * @since 1.0.0
 */
class Simple extends Widget_Base
{

	public function get_name()
	{
		return 'SimpleAudioPlayer';
	}

	public function get_title()
	{
		return __('Simple Audio Player', 'h5ap');
	}

	public function get_icon()
	{
		return 'eicon-play-o';
	}

	public function get_categories()
	{
		return ['basic'];
	}

	public function get_script_depends()
	{
		return ['h5ap-player', 'bplugins-plyrio'];
	}

	/**
	 * Style
	 */
	public function get_style_depends()
	{
		return ['h5ap-player', 'bplugins-plyrio'];
	}

	protected function register_controls()
	{
		$this->start_controls_section(
			'section_content',
			[
				'label' => esc_html__('Simple Audio Player', 'h5ap'),
				'tab' 	=> Controls_Manager::TAB_CONTENT,
			]
		);
		$this->add_control(
			'baudio_url',
			[
				'label' 		=> esc_html__('Upload or paste audio file', 'h5ap'),
				'type' 			=> 'b-select-file',
				'separator' 	=> 'before',
			]
		);
		$this->add_control(
			'baudio_audio_title',
			[
				'label' 		=> esc_html__('Title', 'h5ap'),
				'type' 			=> Controls_Manager::TEXT,
				'separator' 	=> 'before',
				'default' => 'Audio Title Will go here',
				'label_block' => true
			]
		);

		$this->add_control(
			'baudio_muted',
			[
				'label' => __('Muted', 'h5ap'),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'h5ap'),
				'label_off' => __('No', 'h5ap'),
				'return_value' => 'true',
				'default' => '',
				'separator' 	=> 'before',
			]
		);

		$this->add_control(
			'baudio_repeat',
			[
				'label' => __('Repeat', 'h5ap'),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'h5ap'),
				'label_off' => __('No', 'h5ap'),
				'return_value' => 'true',
				'default' => '',
				'separator' 	=> 'before',
			]
		);
		$this->add_control(
			'baudio_autoplay',
			[
				'label' => __('Autoplay', 'h5ap'),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'h5ap'),
				'label_off' => __('No', 'h5ap'),
				'return_value' => 'true',
				'default' => '',
				'separator' 	=> 'before',
			]
		);

		$this->add_control(
			'baudio_seek_time',
			[
				'label' 		=> esc_html__('Seek Time', 'h5ap'),
				'type' 			=> Controls_Manager::NUMBER,
				'placeholder'	=> esc_attr__('Input seek time here', 'h5ap'),
				'default'		=> 15,
				'label_block'	=> false,
			]
		);


		$this->end_controls_section();

		$this->start_controls_section('style', [
			'label' => esc_html__("Style", "h5ap"),
			'tab' => Controls_Manager::TAB_STYLE
		]);

		$this->add_control(
			'baudio_width',
			[
				'label' 		=> __('Width', 'h5ap'),
				'type'			=> Controls_Manager::SLIDER,
				'size_units' 	=> ['px', '%', 'em'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1000,
						'step' => 5,
					],
					'%' => [
						'min' => 0,
						'max' => 100,
					],
					'em' => [
						'min' => 0,
						'max' => 10,
						'step' => 0.1,
					],
				],
				'default' => [
					'unit' => 'px',
					'size' => 500,
				],
				'selectors' => [
					'{{WRAPPER}} .skin_simple' => 'width:{{SIZE}}{{UNIT}};margin:0 auto;max-width:100%;',
				],
			]
		);


		$this->add_control(
			'primary',
			[
				'label' 		=> esc_html__('Primary Color', 'h5ap'),
				'type' => Controls_Manager::COLOR,
				// 'scheme' => [
				// 	'type' => Color::get_type(),
				// 	'value' => Color::COLOR_1,
				// ],
				'label_block'	=> false,
				'selectors' => [
					'{{WRAPPER}} .skin_simple .plyr' => '--plyr-audio-control-color:{{VALUE}};--plyr-color-main:{{VALUE}}',
					'{{WRAPPER}} .skin_simple .plyr__control:hover' => 'background:{{VALUE}}',
				],
				'default' => '#4f5b5f'
			]
		);

		$this->add_control(
			'background',
			[
				'label' 		=> esc_html__('Background Color', 'h5ap'),
				'type' => Controls_Manager::COLOR,
				// 'scheme' => [
				// 	'type' => Color::get_type(),
				// 	'value' => Color::COLOR_1,
				// ],
				'label_block'	=> false,
				'selectors' => [
					'{{WRAPPER}} .skin_simple .plyr--audio .plyr__controls' => 'background:{{VALUE}};',
					'{{WRAPPER}} .skin_simple .plyr__control:hover' => 'color:#fff;',
				],
				'default' => '#F5F5F5'
			]
		);

		$this->end_controls_section();


		// Player Mode and Player Size Options




	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function render()
	{
		$settings = $this->get_settings_for_display();

		$arm = '';
		$arm .= $settings['baudio_repeat'] === 'true' ? ' loop' : '';
		$arm .= $settings['baudio_autoplay'] === 'true' ? ' autoplay' : '';
		$arm .= $settings['baudio_muted'] == 'true' ? ' muted' : '';

		$s = $settings;
		$options = array(
			'controls' => ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings'],
			'seekTime' => $s['baudio_seek_time']
		);



?>

		<div class="skin_simple h5ap_standard_player" data-options='<?php echo wp_json_encode($options) ?>'>
			<audio controls id="bplayer_id" <?php echo esc_attr($arm); ?>>
				<source src="<?php echo esc_url($settings['baudio_url'] . '?download=false') ?>" type="<?php echo esc_attr(h5ap_get_audio_type($settings['baudio_url'])) ?>">
			</audio>
		</div>

<?php
	}
}
