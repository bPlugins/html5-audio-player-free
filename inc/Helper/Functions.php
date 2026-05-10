<?php
namespace H5APPlayer\Helper;

class Functions{

    /**
     * get settings form video playlist
     */
    public static function getPlaylistOption($id, $key, $default = null, $true = false){
        $meta = metadata_exists( 'post', $id, 'h5vp_playlist_options' ) ? get_post_meta($id, 'h5vp_playlist_options', true) : '';
        if(isset($meta[$key]) && $meta != ''){
            if($true == true){
                if($meta[$key] == '1'){
                    return true;
                }else if($meta[$key] == '0'){
                    return false;
                }
            }else {
                return $meta[$key];
            }
            
        }else {
            return $default;
        }
    }

    /**
     * get single value from option table
     */
    public static function getOption($option_name, $default = false, $boolean = false){
        $option = get_option($option_name);
        $result = '';
            if($option != ''){
                $result = $option;
            } else {
                $result = $default;
            }
        if($boolean){
            return (boolean) $result;
        }
        return $result ;
    }

    /**
     * get array value from option table
     */
    public static function getOptionDeep($option_name, $key, $default = false, $boolean = false){
        $option = get_option($option_name);
        if (isset($option[$key]) && $option[$key] != '') {
            $result =  $option[$key] ;
        }else {
            $result = $default;
        }

        if($boolean){
            return (boolean) $result;
        }
        return $result ;
    }


    /**
     * get array value from option table
     */
    public static function getSetting($key, $default = false, $boolean = false){
        $option = get_option('h5ap_settings');
        if (isset($option[$key]) && $option[$key] != '') {
            $result =  $option[$key] ;
        }else {
            $result = $default;
        }

        if($boolean){
            return (boolean) $result;
        }
        return $result ;
    }

    /**
     * trim extra line and Tab
     */
    public static function trim($string){
        $string = preg_replace('/\s+/i', 'whiteSpace', $string);
        $string = preg_replace('/whiteSpace/i', ' ', $string);
        return $string;
    }


    /**
     * get provider form source
     */
    protected function getProvider($src){
        $provider = 'library';
    
        if (!empty($src)) {
          $yt_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/';
          $has_match_youtube = preg_match($yt_rx, $src, $yt_matches);
    
          if ($has_match_youtube) {
            return 'youtube';
          }
    
          $vm_rx = '/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([‌​0-9]{6,11})[?]?.*/';
          $has_match_vimeo = preg_match($vm_rx, $src, $vm_matches);
    
          if ($has_match_vimeo) {
            return 'vimeo';
          }
        }
    
        return $provider;
      }

      /**
       * scrambel data ( password and video file if it is protected)
       */
      public static function scramble($do = 'encode', $data = ''){
        $originalKey = 'abcdefghijklmnopqrstuvwxyz1234567890';
		$key = 'z1ntg4ihmwj5cr09byx8spl7ak6vo2q3eduf';
		$resultData = '';
		if($do == 'encode'){
			if($data != ''){
				$length = strlen($data);
				for($i = 0; $i < $length; $i++){
					$position = strpos($originalKey, $data[$i]);
					if($position !== false){
						$resultData .= $key[$position];
					}else {
						$resultData .= $data[$i];
					}
				}
			}
		}

		if($do == 'decode'){
			if($data != ''){
				$length = strlen($data);
				for($i = 0; $i < $length; $i++){
					$position = strpos($key, $data[$i]);
					if($position !== false){
						$resultData .= $originalKey[$position];
					}else {
						$resultData .= $data[$i];
					}
				}
			}
		}

		return $resultData;
    }

    /**
     * get player settings //get_h5ap_setting
     */
    public static function playerMeta($id, $key, $default = null, $true = false){
        $meta = metadata_exists( 'post', $id, '_h5ap_plyr' ) ? get_post_meta($id, '_h5ap_plyr', true) : '';
        if(isset($meta[$key]) && $meta != ''){
            if($true == true){
                if($meta[$key] == '1'){
                    return true;
                }else if($meta[$key] == '0'){
                    return false;
                }
            }else {
                return $meta[$key];
            }
        }else {
            return $default;
        }
    }
    /**
     * get Settings // h5ap_get_settings
     */
    public static function settings($key, $default = null){
        $settings = get_option('h5ap_settings');
        if(is_array($settings) && isset($settings[$key])){
            return $settings[$key];
        }else {
            return $default;
        }
    }

    public static function isset($array, $key, $default=false){
        if(isset($array[$key])){
            return $array[$key];
        }
        return $default;
    }

    static function isDomainAllowed($url, $allowed_domains) {
    // 1. Extract the host from the URL
    $host = wp_parse_url($url, PHP_URL_HOST);

    // Handle cases where parse_url might fail (e.g., missing scheme in some older PHP versions)
    if ($host === false || $host === null) {
        return false;
    }

    // Optional: Remove "www." prefix for consistent matching if necessary
    $domain_name = str_ireplace('www.', '', $host);

    // 2. Check if the extracted domain is in the allowed list
    return in_array($domain_name, $allowed_domains);
}
}

