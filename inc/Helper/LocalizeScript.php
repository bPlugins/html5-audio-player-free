<?php
namespace H5APPlayer\Helper;
use H5APPlayer\Helper\Functions;

class LocalizeScript{

    public static function translatedText(){
       return [
            "restart" =>  Functions::getSetting("h5apt_restart",'Restart') ,
            "rewind" =>  Functions::getSetting("h5apt_rewind",'Rewind {seektime}s') ,
            "play" =>  Functions::getSetting("h5apt_play",'Play'),
            "pause" =>  Functions::getSetting("h5apt_pause",'Pause'),
            "fastForward:" =>  Functions::getSetting("h5apt_forward_seektime",'Forward {seektime}s'),
            "seek" =>  Functions::getSetting("h5apt_seek",'Seek'), 
            "seekLabel" =>  Functions::getSetting("h5apt_currenttime_of_duration",'{currentTime} of {duration}'),
            "played" =>  Functions::getSetting("h5apt_played",'Played'),
            "buffered" =>  Functions::getSetting("buffered",'Buffered'),
            "currentTime:" =>  Functions::getSetting("h5apt_current_time",'Current time'),
            "duration" =>  Functions::getSetting("h5apt_duration",'Duration'),
            "volume" =>  Functions::getSetting("h5apt_volume",'Volume'),
            "mute" =>  Functions::getSetting("h5apt_mute",'Mute'),
            "unmute" =>  Functions::getSetting("h5apt_unmute",'Unmute'),
            "enableCaptions" => Functions::getSetting('h5apt_enable_captions', 'Enable captions'),
            "disableCaptions" => Functions::getSetting('h5apt_disable_captions', 'Disable captions'),
            "download" =>  Functions::getSetting("download",'Download'),
            "enterFullscreen" => Functions::getSetting('h5apt_enter_fullscreen', 'Enter fullscreen'),
            "exitFullscreen" => Functions::getSetting('h5apt_exit_fullscreen', 'Exit fullscreen'),
            "frameTitle" =>  Functions::getSetting("h5apt_player_for",'Player for {title}'),
            "captions" => Functions::getSetting('h5apt_captions', 'Captions'),
            "settings" =>  Functions::getSetting("h5apt_settings",'Settings'),
            "pip" => Functions::getSetting('h5apt_pip', 'PIP'),
            "menuBack" =>  Functions::getSetting("h5apt_go_back",'Go back to previous menu'),
            "speed" =>  Functions::getSetting("h5apt_speed",'Speed'),
            "normal" =>  Functions::getSetting("h5apt_normal",'Normal') ,
            "quality" =>  Functions::getSetting("h5apt_quality",'Quality'),
            "loop" =>  Functions::getSetting("h5apt_loop",'Loop'),
            "start" =>  Functions::getSetting("h5apt_start",'Start'),
            "end" =>  Functions::getSetting("h5apt_end",'End'),
            "all" =>  Functions::getSetting("h5apt_all",'All'),
            "reset" =>  Functions::getSetting("h5apt_reset",'Reset'),
            "disabled" =>  Functions::getSetting("h5apt_disabled",'Disabled'),
            "enabled" =>  Functions::getSetting("h5apt_enabled",'Enabled'),
            "advertisement" => Functions::getSetting('h5apt_ad', 'Ad'),
            "qualityBadge" =>  [
                "2160" =>  '4K',
                "1440"=> 'HD',
                "1080"=> 'HD',
                "720" =>  'HD',
                "576" => 'SD',
                "480" =>  'SD',
            ],
        ];
    }

    public static function quickPlayer(){
        $controls = [
            'play-large' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_large_play_btn_quick', 'show'),
            'restart' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_restart_btn_quick', 'mobile'),
            'rewind' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_rewind_btn_quick', 'mobile'),
            'play' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_play_btn_quick', 'show') ,
            'fast-forward' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_fast_forward_btn_quick', 'mobile') ,
            'progress' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_video_progressbar_quick', 'show'),
            'current-time' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_current_time_quick', 'show'),
            'duration' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_video_duration_quick', 'mobile'),
            'mute' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_mute_btn_quick', 'show') ,
            'volume' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_volume_control_quick', 'show'),
            'captions' => 'show',
            'settings' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_Setting_btn_quick', 'show'),
            'pip' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_pip_btn_quick', 'mobile'),
            'airplay' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_airplay_btn_quick', 'mobile') ,
            'download' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_downlaod_btn_quick', 'mobile') ,
            'fullscreen' => Functions::getOptionDeep('h5vp_quick', 'h5vp_hide_fullscreen_btn_quick', 'show'),
        ];
    
        $options = [
            'controls' => $controls,
            'tooltips' => [
                'controls' => true,
                'seek' => true,
            ],
            'muted' => (boolean)Functions::getOptionDeep('h5vp_quick', 'h5vp_muted_quick', '0'),
            'autoplay' => (boolean)Functions::getOptionDeep('h5vp_quick', 'h5vp_auto_play_quick', '0'),
            'seekTime' => (int)Functions::getOptionDeep('h5vp_quick', 'h5vp_seek_time_quick', '10'),
            'hideControls' => (boolean)Functions::getOptionDeep('h5vp_quick', 'h5vp_auto_hide_control_quick', '1'),
            'resetOnEnd' => (boolean)Functions::getOptionDeep('h5vp_quick', 'h5vp_reset_on_end_quick', '1'),
            // 'loop' => [
                // 'active' => (boolean)Functions::getOptionDeep('h5vp_quick', 'h5vp_repeat_quick', 'once', 'once')
            // ]
        ];
    
        $infos = [
            'videoWidth' => Functions::getOptionDeep('h5vp_quick', 'h5vp_player_width_quick', 0)
        ];
    
        $h5vp_all_video_quick = Functions::getOptionDeep('h5vp_quick', 'h5vp_all_video_quick', '0');

       return array(
            'ajax_url' => admin_url( 'admin-ajax.php'),
            'quickPlayer' => ['options' => $options, ' infos' => $infos],
            'globalWorking' => $h5vp_all_video_quick
       );
    }
}