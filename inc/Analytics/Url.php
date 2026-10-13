<?php

namespace H5APPlayer\Analytics;

if (!defined('ABSPATH')) {
	exit;
}

class Url
{
	// Query keys that change between requests for the same file (signed URLs, cache busters, campaign tags).
	const VOLATILE_KEYS = '/^(token|expires?|signature|sig|x-amz-.*|utm_.*|ver|download|_\d*|_)$/i';

	// Returns a stable identity for an audio URL ("host/path?sorted-query"), or '' when it isn't usable.
	public static function normalize($url)
	{
		$url = trim((string) $url);
		if ($url === '' || strlen($url) > 2048) {
			return '';
		}

		$parts = wp_parse_url($url);
		if (!is_array($parts)) {
			return '';
		}

		$scheme = isset($parts['scheme']) ? strtolower($parts['scheme']) : '';
		if ($scheme !== '' && !in_array($scheme, ['http', 'https'], true)) {
			return '';
		}

		$host = isset($parts['host']) ? strtolower($parts['host']) : '';
		if ($host === '') {
			$host = strtolower((string) wp_parse_url(home_url(), PHP_URL_HOST));
		}
		$port = isset($parts['port']) ? ':' . (int) $parts['port'] : '';
		$path = isset($parts['path']) ? $parts['path'] : '/';

		$query = '';
		if (!empty($parts['query'])) {
			$kept = [];
			foreach (explode('&', $parts['query']) as $pair) {
				if ($pair === '') {
					continue;
				}
				$key = rawurldecode(strtok($pair, '='));
				if (preg_match(self::VOLATILE_KEYS, $key)) {
					continue;
				}
				$kept[] = $pair;
			}
			sort($kept);
			$query = $kept ? '?' . implode('&', $kept) : '';
		}

		if ($host === '' && $path === '/') {
			return '';
		}

		// Scheme is left out so the same file over http and https counts as one track.
		return $host . $port . $path . $query;
	}

	// A readable fallback name for tracks without a title: the file name without extension.
	public static function file_label($source)
	{
		$path = (string) wp_parse_url((string) $source, PHP_URL_PATH);
		$name = rawurldecode(basename($path));
		$name = preg_replace('/\.[a-z0-9]{2,5}$/i', '', $name);
		return $name !== '' ? $name : (string) wp_parse_url((string) $source, PHP_URL_HOST);
	}
}
