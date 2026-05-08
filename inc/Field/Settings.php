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

    $this->white_listed_stream_url();
  }

  public function white_listed_stream_url()
  {
    \CSF::createSection($this->prefix, array(
      'title' => 'White List Stream URL',
      'fields' => array(
        array(
          'id' => 'white_listed_stream_url',
          'title' => 'White List Stream URL',
          'type' => 'group',
          'fields' => array(
            array(
              'id' => 'url',
              'type' => 'text',              
              'desc' => 'Enter only the hostname (e.g., example.com), without "http://", "https://", or "www.".',
              'title' => 'Stream URL (HOSTNAME ONLY)',
            ),
          )
        ),
       
      )
    ));
  }

}
