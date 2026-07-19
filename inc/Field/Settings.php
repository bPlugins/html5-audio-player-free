<?php

namespace H5APPlayer\Field;

use H5APPlayer\Helper\Functions;

class Settings
{
  protected $prefix = 'h5ap_settings';

  public function register()
  {

    add_action('init', array($this, 'registerSettings'), 0);
  }

  public function registerSettings()
  {
    if (!class_exists('CSF')) {
      return false;
    }

    \CSF::createOptions($this->prefix, array(
      'framework_title' => 'Html5 Audio Player Settings',
      'menu_title' => 'Settings',
      'menu_slug'  => 'html5-audio-player-settings',
      'menu_parent' => 'html5-audio-player',
      'menu_type' => 'submenu',
      'theme' => 'light',
      'show_bar_menu' => false,
      'footer_text' => 'Powered by <a href="https://bplugins.com" target="_blank">bPlugins</a>',
    ));

    $this->performance_settings();
    $this->white_listed_stream_url();
  }

  public function performance_settings()
  {
    \CSF::createSection($this->prefix, array(
      'title' => 'Performance',
      'fields' => array(
        array(
          'id'      => 'h5ap_lazy_load',
          'type'    => 'switcher',
          'title'   => 'Enable Lazy Load',
          'default' => false,
          'desc'    => 'Enable this to only initialize and load the player and its resources when it enters the viewport.'
        ),
      )
    ));
  }

  public function white_listed_stream_url()
  {
    \CSF::createSection($this->prefix, array(
      'title' => 'White List Stream URL',
      'fields' => array(
        array(
          'type'    => 'content',
          'content' => '
            <div class="h5ap-settings-shortcode-container" style="max-width: 100%; margin-bottom: 24px;">
              <div class="h5ap-settings-shortcode-title" style="display: flex; align-items: center; gap: 8px;">
                <i class="fa fa-shield" style="color: var(--success-color);"></i> Stream Whitelist Security
              </div>
              <div class="h5ap-settings-shortcode-desc" style="line-height: 1.5; font-size: 12px; color: var(--text-secondary);">
                To prevent hotlinking, protect bandwidth, and authorize metadata/played history fetching, you can restrict access to specific hostnames.
                <br><br>
                <strong>How to use:</strong> Click the <strong>Add New</strong> button and enter only the stream hostname (without protocols, paths, or query strings).
                <br><br>
                <strong>Example:</strong>
                <br>
                &bull; Full Stream URL: <code>https://classicrock.stream.laut.fm/classicrock</code>
                <br>
                &bull; What to remove: <code>https://</code> or <code>http://</code> (from the beginning) and <code>/classicrock</code> (from the end).
                <br>
                &bull; Value to enter: <code>classicrock.stream.laut.fm</code>
              </div>
            </div>
          '
        ),
        array(
          'id' => 'white_listed_stream_url',
          'title' => '',
          'type' => 'group',
          'fields' => array(
            array(
              'id' => 'url',
              'type' => 'text',              
              'desc' => 'Enter the stream URL or hostname. Protocols (http/https) and paths will be automatically removed.',
              'title' => 'Stream URL / Hostname',
            ),
          )
        ),
       
      )
    ));
  }

}
