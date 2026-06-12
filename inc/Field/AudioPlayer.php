<?php

namespace H5APPlayer\Field;

class AudioPlayer
{

  public function register() {
    add_action('init', [$this, 'init'], 0);
  }

  public function init(){
    if (!class_exists('CSF')) {
      return false;
    }

    $prefix = '_h5ap_plyr';
    \CSF::createMetabox($prefix, array(
      'title' => 'Player Configuration',
      'post_type' => 'audioplayer',
    ));

    \CSF::createMetabox('_h5ap_plyr_skins', array(
      'title' => 'Pro Version Skins',       
      'post_type' => 'audioplayer',
      'context' => 'side',
    ));

    $this->configure($prefix);
  }

  public function configure($prefix) {

    $h5ap_crown_icon = '<span class="h5ap-crown-icon" style="display: inline-flex; width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; align-items: center; justify-content: center;"><img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/crown.png" alt="pro-icon" style="width: 18px; height: 16px; display: block;" /></span>';

     \CSF::createSection($prefix, array(
      'fields' => array(
        array(
          'id' => 'h5ap_player_type',
          'type' => 'button_set',
          'title' => 'Player Type',
          'class' => 'abu-button-set-trigger',
          'options' => array(
            'opt-1' => 'Standard Player',
            'opt-3' => 'Sticky Player',
            'opt-2' => 'Playlist Player',
          ),
          'desc' => 'Select the type of audio player you want to display on your site.',
          'default' => 'opt-1',
        ),

        array(
          'id' => 'h5vp_default_audio',
          'type' => 'upload',
          'title' => 'Audio source',
          'desc' => 'Upload or select the main audio file you want to play.',
          'library' => 'audio',
          'dependency' => array(
            'h5ap_player_type',
            '!=',
            'opt-2'
          ),
          'placeholder' => 'http://',
          'button_title' => 'Add Audio',
          'remove_title' => 'Remove Audio',
        ),
        array(
          'id' => 'poster_sticky',
          'type' => 'upload',
          'library' => 'image',
          'title' => \__('Poster', 'html5-audio-player'),
          'button_title' => \__('Add or Upload Poster Image', 'html5-audio-player'),
          'remove_title' => \__('Remove', 'html5-audio-player'),
          'desc' => \__('100x100 px photo is the standard poster size, accepted file type .png, .jpeg, .jpg ', 'html5-audio-player'),
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
        ),
        array(
          'id' => 'sticky_poster',
          'type' => 'upload',
          'library' => 'image',
          'title' => \__('Poster', 'html5-audio-player'),
          'button_title' => \__('Add or Upload Poster Image', 'html5-audio-player'),
          'remove_title' => \__('Remove', 'html5-audio-player'),
          'desc' => \__('100x100 px photo is the standard poster size, accepted file type .png, .jpeg, .jpg ', 'html5-audio-player'),
          'dependency' => array(
            array('h5ap_player_type', '==', 'opt-1'),
            array('standard_skin', 'not-any', 'default,stamp,Simple-1'),
          ),
        ),
        array(
          'id' => 'title_sticky',
          'type' => 'text',
          'title' => \__('Title', 'html5-audio-player'),
          'default' => 'Audio Title',
          'desc' => \__('Enter the title of the audio', 'html5-audio-player'),
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
        ),
        array(
          'id' => 'title',
          'type' => 'text',
          'title' => \__('Title', 'html5-audio-player'),
          'default' => 'Audio Title',
          'desc' => \__('Enter the title of the audio', 'html5-audio-player'),
          'dependency' => array(
            array('h5ap_player_type', '==', 'opt-1'),
            array('standard_skin', 'not-any', 'default,Simple-1,Simple-2'),
          ),
        ),

        array(
          'id' => 'author',
          'type' => 'text',
          'title' => \__('Author', 'html5-audio-player'),
          'default' => 'Author Name',
          'desc' => \__('Enter the author of the audio', 'html5-audio-player'),
          'dependency' => array(
            array('h5ap_player_type', '==', 'opt-1'),
            array('standard_skin', 'any', 'wave'),
          ),
        ),
        array(
          'id' => 'standard_skin',
          'type' => 'button_set',
          'title' => 'Player Skin',
          'options' => array(
            'default' => 'Default',
            'fusion' => 'Fusion',
            'stamp' => 'Stamp',
            'wave' => 'Wave',

          ),
          'desc' => 'Choose a visual skin for the standard player.',
          'default' => 'default',
          'dependency' => array(
            'h5ap_player_type',
            '==',
            'opt-1'
          ),
        ),


        array(
          'id' => 'control_color',
          'type' => 'color',
          'title' => 'Control color',
          'desc' => 'Set the color for the player control buttons (like play, pause, volume).',
          // 'default' => '#4A5464',
          'default' => '#fff',
          'dependency' => array(
            'h5ap_player_type|standard_skin',
            '==|any',
            'opt-1|default,wave,stamp,fusion'
          ),
        ),
        array(
          'id' => 'autoplay',
          'type' => 'switcher',
          'title' => \__('AutoPlay', 'html5-audio-player'),
          'desc' => 'AutoPlay will only work if you keep the player muted according the the latest autoplay policy. <a href="https://developers.google.com/web/updates/2017/09/autoplay-policy-changes" target="_blank" >Read More</a>',
          'default' => false,
          'dependency' => array('h5ap_player_type', '==', 'opt-1')
        ),
        array(
          'id' => 'muted',
          'type' => 'switcher',
          'title' => \__('Muted', 'html5-audio-player'),
          'desc' => 'Start playback muted. Some browsers may handle autoplay more smoothly when audio is muted.',
          'default' => false,
          'dependency' => array('h5ap_player_type', '==', 'opt-1')
        ),

        array(
          'id' => 'width',
          'type' => 'dimensions',
          'height' => false,
          'units' => array(
            'px',
            '%'
          ),
          'title' => 'Player Width',
          'desc' => 'Set the maximum width of the standard player (in pixels or percentage).',
          'default' => array(
            'width' => '100',
            'unit' => '%',
          ),
          'dependency' => array(
            'h5ap_player_type',
            '==',
            'opt-1',
            'all'
          )
        ),

        array(
            'id' => 'controls',
            'type' => 'button_set',
            'title' => 'Control buttons and Components',
            'multiple' => true,
            'options' => array(
              'play' => 'Play',
              'progress' => 'Progressbar',
              'mute' => 'Mute Button',
              'volume' => 'Volume Control',
              'duration' => 'Duration',
              'current-time' => 'Current Time',
              'settings' => 'Setting Button',
            ),
            'default' => array(
              'play',
              'progress',
              'mute',
              'volume',
              'current-time',
              'settings'
            ),
            'help' => 'Click on the item to turn ON/OFF',
            'desc' => 'Enable/Disable audio player controls. Note: Play button is mandatory and always enabled for proper player functionality.',
            'dependency' => array(
              'h5ap_player_type|standard_skin',
              '==|==',
              'opt-1|default',
              'all'
            )
          ),

        array(
          'id' => 'repeat',
          'type' => 'switcher',
          'title' => \__('Repeat', 'html5-audio-player'),
          'desc' => 'Enable this to automatically loop the audio playback once it finishes.',
          'default' => '0',
          'dependency' => array(
            'h5ap_player_type',
            '==',
            'opt-1',
            'all'
          ),
        ),
    
        array(
          'id' => 'radius',
          'type' => 'slider',
          'title' => 'Border radius',
          'desc' => 'Defines the radius of the Player\'s corners.',
          'min' => 0,
          'max' => 50,
          'step' => 1,
          'unit' => 'px',
          'default' => 10,
          'dependency' => array('h5ap_player_type', '==', 'opt-1')
        ),
        //playlist
        array(
          'type' => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-2'),
          'content' => '
                    <div class="h5ap-pro-notice-box">
                        <h4 class="h5ap-pro-notice-title">🚀 Get More with Pro Version</h4>
                        <p class="h5ap-pro-notice-desc">The Playlist Player and all of its powerful features are available exclusively in the Pro Version:</p>
                        
                        <div style="display: flex; align-items: center; gap: 30px; margin: 20px 0; flex-wrap: wrap;">
                            <div style="flex: 1; min-width: 250px;">
                                <ul class="h5ap-pro-notice-list" style="margin-top: 0;">
                                    <li><strong>Playlist Skins:</strong> Choose between beautiful Narrow or Extensive list designs.</li>
                                    <li><strong>Custom Themes:</strong> Switch between Light, Dark, or build your own Custom color theme.</li>
                                    <li><strong>Advanced Controls:</strong> Add specialized playlist controls like shuffle, forward/rewind to change tracks, and download buttons.</li>
                                    <li><strong>Custom Styles:</strong> Gain full control over item text colors, hover states, odd/even backgrounds, and border radius.</li>
                                    <li><strong>Source Selection:</strong> Build playlists manually or generate them dynamically from your custom post types.</li>
                                </ul>
                                <div style="margin-top: 20px;">
                                    <a href="' . admin_url('admin.php?page=html5-audio-player-help-demo#/pricing') . '" 
                                    class="h5ap-pro-notice-button" style="display: inline-block;"> ' . $h5ap_crown_icon . ' Get Pro</a>
                                </div>
                            </div>
                            <div style="flex-shrink: 0; max-width: 400px; width: 100%; margin-top:-70px;">
                                <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/playlist.png" alt="Playlist Skins" style="width: 100%; height: auto; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                            </div>
                        </div>
                    </div>
                ',
        ),

        array(
          'id' => 'plp_align',
          'type' => 'button_set',
          'title' => 'Player Alignment',
          'desc' => 'Set the horizontal alignment of the player within its container.',
          'options' => [
            'start' => 'Left',
            'center' => 'Center',
            'end' => 'Right'
          ],
          'default' => 'center',
          'dependency' => array('h5ap_player_type', '==', 'opt-1', 'all'),
        ),


        array(
          'id' => 'disable_loader',
          'type' => 'switcher',
          'title' => \__('Disable Loading', 'html5-audio-player'),
          'desc' => 'Enable this option if you want to disable the loading animation',
          'default' => '0',
          'dependency' => array('h5ap_player_type', '==', 'opt-1')
        ),


        // STICKY PLAYER


        array(
          'id' => 'enable_sticky',
          'type' => 'switcher',
          'title' => \__('Enable Sticky', 'html5-audio-player'),
          'desc' => 'Enable this to attach a sticky version of the player to the page so it remains visible while scrolling.',
          'default' => false,
          'dependency' => array(
            array('h5ap_player_type|standard_skin', '==|any', 'opt-1|default,fusion,stamp,wave,Simple-1,Simple-2')
          ),
        ),

        array(
          'type' => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'content' => '
                    <div class="h5ap-pro-notice-box">
                        <h4 class="h5ap-pro-notice-title">🚀 Get More with Pro Version</h4>
                        <p class="h5ap-pro-notice-desc">The following features are available in the Pro Version:</p>
                        <ul class="h5ap-pro-notice-list">
                            <li><strong>Pro Skins:</strong> Unlock 7 additional beautifully designed pro player skins.</li>
                            <li><strong>Primary Color:</strong> Set a custom primary theme color for your player.</li>
                            <li><strong>Background Color:</strong> Set a custom background color for your player.</li>
                            <li><strong>Text Color:</strong> Set a custom text color for your player.</li>
                            <li><strong>Pro Controls:</strong> Access advanced controls like Restart, Rewind, Fast Forward and Download.</li>
                            <li><strong>Seek Time:</strong> Set the time, in seconds, to seek when a user hits fast forward or rewind.</li>
                            <li><strong>Start Time:</strong> Set the specific time, in seconds, where the audio should start playing.</li>
                            <li><strong>End Time:</strong> Set the specific time, in seconds, where the audio should stop playing.</li>
                            <li><strong>Disable Pause:</strong> Prevent users from pausing the audio playback.</li>
                            <li><strong>Save State:</strong> Save the player\'s time state so it resumes from where the user left off.</li>
                        </ul>
                        <a href="' . admin_url('admin.php?page=html5-audio-player-help-demo#/pricing') . '" 
                        class="h5ap-pro-notice-button"> ' . $h5ap_crown_icon . ' Get Pro</a>
                    </div>
                ',
        ),
        array(
          'type' => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
          'content' => '
                    <div class="h5ap-pro-notice-box">
                        <h4 class="h5ap-pro-notice-title">🚀 Get More with Pro Version</h4>
                        <p class="h5ap-pro-notice-desc">The following features are available in the Pro Version:</p>
                        <ul class="h5ap-pro-notice-list">
                            <li><strong>Pro Skin:</strong> Unlock the clean and minimal Simple skin for your sticky player.</li>
                            <li><strong>Background Color:</strong> Set a custom background color for your sticky player.</li>
                            <li><strong>Repeat:</strong> Loop the audio to play continuously.</li>
                            <li><strong>Save State:</strong> Save the player\'s time state so it resumes from where the user left off.</li>
                            <li><strong>Download Button:</strong> Allow users to download the audio file directly.</li>
                            <li><strong>Initial Volume:</strong> Set the initial volume level of the player.</li>
                        </ul>
                        <a href="' . admin_url('admin.php?page=html5-audio-player-help-demo#/pricing') . '" 
                        class="h5ap-pro-notice-button"> ' . $h5ap_crown_icon . ' Get Pro</a>
                    </div>
                ',
			  ),

      )
    ));

    \CSF::createSection('_h5ap_plyr_skins', array(
      'title' => \__('The following skins are available in the pro version.', 'html5-audio-player'),
      'post_type' => 'audioplayer',
      'context' => 'side',
      'fields' => array(
        array(
          'id' => 'standard_skin',
          'type' => 'content',
          'content' => '
          <div class="h5ap-skin-box">
          <style>.h5ap-skin-box {text-align:center;} img{max-width:100%;} h3 {margin-bottom:5px;text-align:center;}</style>
            <h3>Card 1</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/card-1.png" alt="Standard">
            <h3>Card 2</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/card-2.png" alt="Standard">
            <h3>Simple 1</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/simple-1.png" alt="Standard">
            <h3>Simple 2</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/simple-2.png" alt="Standard">
            <h3>Player 9</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/player-9.png" alt="Standard">
            <h3>Player 10</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/player-10.png" alt="Standard">
            <h3>Player 11</h3>
            <img src="' . H5AP_PRO_PLUGIN_DIR . 'assets/images/skins/player-11.png" alt="Standard">
          </div>  
          ',
        )
      )
    ));
  }
}
