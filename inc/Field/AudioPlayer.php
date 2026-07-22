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

    $h5ap_crown_icon = '<span class="h5ap-crown-icon" style="display: inline-flex; width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; align-items: center; justify-content: center;"><img src="' . H5AP_PLUGIN_DIR . 'assets/images/crown.png" alt="pro-icon" style="width: 18px; height: 16px; display: block;" /></span>';

     \CSF::createSection($prefix, array(
      'fields' => array(

        // Custom CSS for Spacious Section Separation
        array(
          'type'    => 'content',
          'content' => '
            <style>
              .h5ap-section-header {
                margin: 24px 0 10px 0;
                padding: 10px 14px;
                background: #f8fafc;
                border-radius: 4px;
                font-weight: 700;
                font-size: 13px;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .h5ap-section-header.blue { border-left: 4px solid #2563eb; }
              .h5ap-section-header.green { border-left: 4px solid #16a34a; }
              .h5ap-section-header.amber { border-left: 4px solid #d97706; }
              .h5ap-section-header.indigo { border-left: 4px solid #6366f1; }
            </style>
          ',
        ),

        // ==========================================
        // MAIN PLAYER TYPE SELECTOR
        // ==========================================
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
          'desc' => 'Select player mode: Standard (single track), Playlist (multi-track / Podcast), or Sticky (fixed screen bottom bar).',
          'default' => 'opt-1',
        ),

        // ==========================================
        // 1. STANDARD PLAYER (opt-1)
        // ==========================================

        // --- Section Header 1: Content & Source ---
        array(
          'type'       => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'content'    => '
            <div class="h5ap-section-header blue">
              <span>🎵</span> ' . \__('1. Audio Source &amp; Metadata', 'html5-audio-player') . '
            </div>
          ',
        ),
        array(
          'id' => 'h5vp_default_audio',
          'type' => 'upload',
          'title' => 'Audio source',
          'desc' => 'Upload or select the main audio file you want to play.',
          'library' => 'audio',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'placeholder' => 'http://',
          'button_title' => 'Add Audio',
          'remove_title' => 'Remove Audio',
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
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
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

        // --- Section Header 2: Controls & Components ---
        array(
          'type'       => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'content'    => '
            <div class="h5ap-section-header green">
              <span>🎛️</span> ' . \__('2. Controls &amp; Components', 'html5-audio-player') . '
            </div>
          ',
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

        // --- Section Header 3: Appearance & Styling ---
        array(
          'type'       => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'content'    => '
            <div class="h5ap-section-header amber">
              <span>🎨</span> ' . \__('3. Theme, Colors &amp; Styling', 'html5-audio-player') . '
            </div>
          ',
        ),
        array(
          'id' => 'control_color',
          'type' => 'color',
          'title' => 'Control color',
          'desc' => 'Set the color for the player control buttons (like play, pause, volume).',
          'default' => '#fff',
          'dependency' => array(
            'h5ap_player_type|standard_skin',
            '==|any',
            'opt-1|default,wave,stamp,fusion'
          ),
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
          'dependency' => array('h5ap_player_type', '==', 'opt-1', 'all')
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

        // --- Section Header 4: Playback Behavior & Options ---
        array(
          'type'       => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-1'),
          'content'    => '
            <div class="h5ap-section-header indigo">
              <span>⚡</span> ' . \__('4. Playback Behavior &amp; Options', 'html5-audio-player') . '
            </div>
          ',
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
          'id' => 'repeat',
          'type' => 'switcher',
          'title' => \__('Repeat', 'html5-audio-player'),
          'desc' => 'Enable this to automatically loop the audio playback once it finishes.',
          'default' => '0',
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
        array(
          'id'      => 'lazy_load',
          'type'    => 'button_set',
          'title'   => \__('Lazy Load', 'html5-audio-player'),
          'desc' => \__('Load player only when in viewport. (Unavailable when "Enable Sticky" is active).', 'html5-audio-player'),
          'options' => array(
            'default' => \__('Inherit (Global Settings)', 'html5-audio-player'),
            'on'      => \__('Enable', 'html5-audio-player'),
            'off'     => \__('Disable', 'html5-audio-player'),
          ),
          'default' => 'default',
          'dependency' => array(
            array('h5ap_player_type', '==', 'opt-1'),
            array('enable_sticky', '!=', '1'),
          )
        ),
        array(
          'id' => 'enable_sticky',
          'type' => 'switcher',
          'title' => \__('Enable Sticky', 'html5-audio-player'),
          'desc' => \__('Keep player visible while scrolling. (Hides Lazy Load since sticky players must load immediately).', 'html5-audio-player'),
          'default' => false,
          'dependency' => array(
            array('h5ap_player_type|standard_skin', '==|any', 'opt-1|default,fusion,stamp,wave,Simple-1,Simple-2')
          ),
        ),

        // --- Standard Pro Notice Box ---
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
                            <li><strong>Waveform Style <span style="background:#2563eb;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600;">NEW</span>:</strong> Switch between Real-time Equalizer and Static Waveform (SoundCloud Style) for the Wave skin.</li>
                        </ul>
                        <a href="' . admin_url('admin.php?page=html5-audio-player-help-demo#/pricing') . '" 
                        class="h5ap-pro-notice-button"> ' . $h5ap_crown_icon . ' Get Pro</a>
                    </div>
                ',
        ),

        // ==========================================
        // 2. PLAYLIST PLAYER (opt-2)
        // ==========================================
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
                                    <li><strong>Podcast RSS Feed Import <span style="background:#2563eb;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600;">NEW</span>:</strong> Import and stream full podcast channels directly into Narrow or Extensive playlist skins using any RSS feed URL.</li>
                                    <li><strong>Podcast Search &amp; Filter <span style="background:#2563eb;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600;">NEW</span>:</strong> Allow listeners to search podcast episodes live and filter by publication date or order.</li>
                                    <li><strong>Podcast Pagination &amp; Load More <span style="background:#2563eb;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600;">NEW</span>:</strong> Paginate large podcast episode feeds with numbered pagination (1, 2, 3...) or a "Load More" button with episode fetch limits.</li>
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
                                <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/playlist.png" alt="Playlist Skins" style="width: 100%; height: auto; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                            </div>
                        </div>
                    </div>
                ',
        ),

        // ==========================================
        // 3. STICKY PLAYER (opt-3)
        // ==========================================

        // --- Section Header 1: Content & Source ---
        array(
          'type'       => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
          'content'    => '
            <div class="h5ap-section-header blue">
              <span>🎵</span> ' . \__('1. Sticky Audio Source &amp; Metadata', 'html5-audio-player') . '
            </div>
          ',
        ),
        array(
          'id' => 'h5vp_default_audio',
          'type' => 'upload',
          'title' => 'Audio source',
          'desc' => 'Upload or select the main audio file you want to play.',
          'library' => 'audio',
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
          'placeholder' => 'http://',
          'button_title' => 'Add Audio',
          'remove_title' => 'Remove Audio',
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
          'id' => 'poster_sticky',
          'type' => 'upload',
          'library' => 'image',
          'title' => \__('Poster', 'html5-audio-player'),
          'button_title' => \__('Add or Upload Poster Image', 'html5-audio-player'),
          'remove_title' => \__('Remove', 'html5-audio-player'),
          'desc' => \__('100x100 px photo is the standard poster size, accepted file type .png, .jpeg, .jpg ', 'html5-audio-player'),
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
        ),

        // --- Sticky Pro Notice Box ---
        array(
          'type' => 'content',
          'dependency' => array('h5ap_player_type', '==', 'opt-3'),
          'content'    => '
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
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/card-1.png" alt="Standard">
            <h3>Card 2</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/card-2.png" alt="Standard">
            <h3>Simple 1</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/simple-1.png" alt="Standard">
            <h3>Simple 2</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/simple-2.png" alt="Standard">
            <h3>Player 9</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/player-9.png" alt="Standard">
            <h3>Player 10</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/player-10.png" alt="Standard">
            <h3>Player 11</h3>
            <img src="' . H5AP_PLUGIN_DIR . 'assets/images/skins/player-11.png" alt="Standard">
          </div>  
          ',
        )
      )
    ));
  }
}
