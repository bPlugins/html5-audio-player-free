<?php

namespace H5APPlayer\Core;

class Page
{
    public function register()
    {
        // add_action('admin_menu', [$this, 'adminMenu']);
    }

    public function adminMenu()
    {
        // add_menu_page('H5AP Player', 'H5AP Player', 'manage_options', 'html5-audio-player', [$this, 'renderPage'], 'dashicons-format-audio', 100);
        add_submenu_page('edit.php?post_type=audioplayer', 'H5AP Player', 'H5AP Player', 'manage_options', 'html5-audio-player', [$this, 'renderPage'], 100);
    }

    public function renderPage()
    {
        echo 'Hello World';
    }
}
