<?php
// phpcs:disable WordPress.WP.AlternativeFunctions

namespace H5APPlayer\Core;

class Stream
{

    public function getStreamData($streamUrl)
    {
        $data =  $this->getIcyMetadata($streamUrl);

        return ['trackTitle' => $data];
    }


    function getIcyMetadata($url)
    {
        $url = sanitize_url($url);
        $opts = [
            "http" => [
                "method" => "GET",
                "header" => "Icy-MetaData:1\r\n",
            ]
        ];
        $context = stream_context_create($opts);
        $fp = fopen($url, 'r', false, $context);

        if (!$fp) {
            return false;
        }

        $metaInt = 0;
        foreach ($http_response_header as $header) {
            if (stripos($header, "icy-metaint:") !== false) {
                $metaInt = (int) trim(substr($header, 12));
                break;
            }
        }

        if ($metaInt === 0) {
            return false;
        }

        // Read stream to metadata interval
        $data = fread($fp, $metaInt);
        $metaLen = ord(fread($fp, 1)) * 16;
        $metaData = fread($fp, $metaLen);
        fclose($fp);

        if (preg_match("/StreamTitle='(.*?)';/", $metaData, $matches)) {
            return $matches[1]; // e.g., "Artist - Song Title"
        }

        return false;
    }
}
