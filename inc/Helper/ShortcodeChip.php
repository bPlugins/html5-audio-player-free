<?php

namespace H5APPlayer\Helper;

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Shortcode with a copy button, used in the player lists and on the player edit screen.
 * Styles: assets/css/shortcode-chip.css, behaviour: assets/js/shortcode-chip.js.
 */
class ShortcodeChip
{
	const COPY_ICON = '<svg class="h5ap-sc__icon-copy" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
	const CHECK_ICON = '<svg class="h5ap-sc__icon-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"></path></svg>';
	const CODE_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path></svg>';

	public static function html($code)
	{
		return '<span class="h5ap-sc" data-code="' . esc_attr($code) . '">'
			. '<code class="h5ap-sc__code">' . esc_html($code) . '</code>'
			. '<button type="button" class="h5ap-sc__copy" aria-label="' . esc_attr__('Copy shortcode', 'html5-audio-player') . '" title="' . esc_attr__('Copy shortcode', 'html5-audio-player') . '">' . self::COPY_ICON . self::CHECK_ICON . '</button>'
			. '<span class="h5ap-sc__status" role="status" aria-live="polite" data-copied="' . esc_attr__('Copied!', 'html5-audio-player') . '"></span>'
			. '</span>';
	}

	public static function box($code)
	{
		return '<div class="h5ap-sc-box">'
			. '<span class="h5ap-sc-box__icon">' . self::CODE_ICON . '</span>'
			. '<div class="h5ap-sc-box__text">'
			. '<strong>' . esc_html__('Shortcode', 'html5-audio-player') . '</strong>'
			. '<span>' . esc_html__('Copy this shortcode and paste it into your post, page, or text widget content:', 'html5-audio-player') . '</span>'
			. '</div>'
			. self::html($code)
			. '</div>';
	}
}
