<?php

namespace H5APPlayer\Model;

use H5APPlayer\Helper\Functions;
use H5APPlayer\Model\Pipe;

class GlobalChanges
{


	/**
	 * construct function
	 */
	public function register()
	{
		add_action('wp_footer', [$this, 'h5ap_wp_head']);
		add_action('wp_head', [$this, 'addCSS']);

		add_action('admin_footer', [$this, 'h5ap_wp_head']);
		if (is_admin()) {
			add_action('admin_head-post.php', [$this, 'h5ap_hide_publishing_actions']);
			add_action('admin_head-post-new.php', [$this, 'h5ap_hide_publishing_actions']);
		}
	}




	/**
	 * push repeat and suffle icon in head
	 */
	public function h5ap_wp_head()
	{
?>
		<svg width="0" height="0" class="h5ap_svg_hidden" style="display: none;">
			<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.997 511.997" id="exchange">
				<path d="M467.938 87.164L387.063 5.652c-7.438-7.495-19.531-7.54-27.02-.108s-7.54 19.525-.108 27.014l67.471 68.006-67.42 67.42c-7.464 7.457-7.464 19.557 0 27.014 3.732 3.732 8.616 5.598 13.507 5.598s9.781-1.866 13.513-5.591l80.876-80.876c7.443-7.44 7.463-19.495.056-26.965z"></path>
				<path d="M455.005 81.509H56.995c-10.552 0-19.104 8.552-19.104 19.104v147.741c0 10.552 8.552 19.104 19.104 19.104s19.104-8.552 19.104-19.104V119.718h378.905c10.552 0 19.104-8.552 19.104-19.104.001-10.552-8.551-19.105-19.103-19.105zM83.964 411.431l67.42-67.413c7.457-7.457 7.464-19.55 0-27.014-7.463-7.464-19.563-7.464-27.02 0l-80.876 80.869c-7.444 7.438-7.47 19.493-.057 26.963l80.876 81.512a19.064 19.064 0 0013.564 5.649c4.865 0 9.731-1.847 13.456-5.54 7.489-7.432 7.54-19.525.108-27.02l-67.471-68.006z"></path>
				<path d="M454.368 238.166c-10.552 0-19.104 8.552-19.104 19.104v135.005H56.995c-10.552 0-19.104 8.552-19.104 19.104s8.552 19.104 19.104 19.104h397.38c10.552 0 19.104-8.552 19.098-19.104V257.271c-.001-10.552-8.553-19.105-19.105-19.105z"></path>
			</symbol>
		</svg>
		<svg width="0" height="0" class="h5ap_svg_hidden" style="display: none;">
			<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.88 477.88" id="shuffle">
				<path d="M472.897 124.269a.892.892 0 01-.03-.031l-.017.017-68.267-68.267c-6.78-6.548-17.584-6.36-24.132.42-6.388 6.614-6.388 17.099 0 23.713l39.151 39.151h-95.334c-65.948.075-119.391 53.518-119.467 119.467-.056 47.105-38.228 85.277-85.333 85.333h-102.4C7.641 324.072 0 331.713 0 341.139s7.641 17.067 17.067 17.067h102.4c65.948-.075 119.391-53.518 119.467-119.467.056-47.105 38.228-85.277 85.333-85.333h95.334l-39.134 39.134c-6.78 6.548-6.968 17.353-.419 24.132 6.548 6.78 17.353 6.968 24.132.419.142-.137.282-.277.419-.419l68.267-68.267c6.674-6.657 6.687-17.463.031-24.136z"></path>
				<path d="M472.897 329.069l-.03-.03-.017.017-68.267-68.267c-6.78-6.548-17.584-6.36-24.132.42-6.388 6.614-6.388 17.099 0 23.712l39.151 39.151h-95.334a85.209 85.209 0 01-56.9-21.726c-7.081-6.222-17.864-5.525-24.086 1.555-6.14 6.988-5.553 17.605 1.319 23.874a119.28 119.28 0 0079.667 30.43h95.334l-39.134 39.134c-6.78 6.548-6.968 17.352-.42 24.132 6.548 6.78 17.352 6.968 24.132.42.142-.138.282-.277.42-.42l68.267-68.267c6.673-6.656 6.686-17.462.03-24.135zM199.134 149.702a119.28 119.28 0 00-79.667-30.43h-102.4C7.641 119.272 0 126.913 0 136.339s7.641 17.067 17.067 17.067h102.4a85.209 85.209 0 0156.9 21.726c7.081 6.222 17.864 5.525 24.086-1.555 6.14-6.989 5.553-17.606-1.319-23.875z"></path>
			</symbol>
		</svg>
		<script>
			const single_player = document.querySelectorAll(".h5ap_single_button");
			single_player.forEach(item => {
				const audio = item.querySelector("audio");
				audio.volume = 0.6;
				item.querySelector('.play').addEventListener("click", function() {
					single_player.forEach(player => {
						player.querySelector("audio")?.pause();
					})
					setTimeout(() => {
						audio.currentTime = 0;
						audio.play();
					}, 0);

				});

				item.querySelector('.pause').style.display = 'none';
				item.querySelector('.pause').addEventListener("click", function() {
					audio.pause();
				});

				audio.addEventListener("ended", () => {
					item.querySelector(".play").style.display = 'inline-block';
					item.querySelector(".pause").style.display = 'none';
				});

				audio.addEventListener("pause", () => {
					item.querySelector(".play").style.display = 'inline-block';
					item.querySelector(".pause").style.display = 'none';
				});
				audio.addEventListener("play", () => {
					item.querySelector(".play").style.display = 'none';
					item.querySelector(".pause").style.display = 'inline-block';
				});

			})
		</script>
	<?php
	}

	/**
	 * add default player color and single play button style
	 */
	public function addCSS()
	{

		$primary_color = Functions::getSetting('h5ap_primary_color', '#4f5b5f');
		$hover_color = Functions::getSetting('h5ap_hover_color', '#1aafff');
		$bg_color = Functions::getSetting('h5ap_background_color', '#f5f5f5');
	?>
		<style>
			span.h5ap_single_button {
				display: inline-flex;
				justify-content: center;
				align-items: center;
			}

			.h5ap_single_button span {
				line-height: 0;
			}

			span#h5ap_single_button span svg {
				cursor: pointer;
			}

			#skin_default .plyr__control,
			#skin_default .plyr__time {
				color: <?php echo esc_html($primary_color); ?>
			}

			#skin_default .plyr__control:hover {
				background: <?php echo esc_html($hover_color); ?>;
				color: <?php echo esc_html($bg_color); ?>
			}

			#skin_default .plyr__controls {
				background: <?php echo esc_html($bg_color); ?>
			}

			#skin_default .plyr__controls__item input {
				color: <?php echo esc_html($hover_color); ?>
			}

			.plyr {
				--plyr-color-main: <?php echo esc_html($primary_color); ?>
			}

			/* Custom Css */
			<?php echo esc_html(Functions::getSetting('h5ap_custom_css')); ?>
		</style>
<?php
	}

	// HIDE everything in PUBLISH metabox except Move to Trash & PUBLISH button
	function h5ap_hide_publishing_actions()
	{
		$my_post_type = 'audioplayer';
		global $post;
		if ($post->post_type == $my_post_type or $post->post_type == 'quick_audio_player' || $post->post_type === 'audiolist') {
			echo '
                <style type="text/css">
                    #misc-publishing-actions,
                    #minor-publishing-actions{
                        display:none;
                    }
                </style>
            ';
		}
	}
}
