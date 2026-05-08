<?php
namespace H5APPlayer\Services;
use H5APPlayer\Model\Pipe;

class AdminNotice{
    protected static $_instance = null;
    protected static $closed_ver = null;

    /**
     * construct function
     */
    public function register(){
        if(\is_admin()){
            // add_action('admin_init', [$this, 'checkPipe']);
        }
        add_action('init', [$this, 'init']);
    }



    public function init(){
        if(isset($_GET['h5ap-notice-import']) && $_GET['h5ap-notice-import'] == 'true'){
            update_option('h5ap-notice-import', true);
        }
    }

    public function checkPipe(){
        global $pagenow;
        if('edit.php' === $pagenow && isset($_GET['post_type']) && $_GET['post_type'] === 'audioplayer' && !Pipe::checkPipe()){
            update_option('bpllch5ap', array(
                'key' => '',
                'active' => false
            ));
        }
    }
}
