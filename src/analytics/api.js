import apiFetch from '@wordpress/api-fetch';

const BASE = '/h5ap/v1/stats';

// range: 'today' or '7d'
export const getOverview = (range = '7d') => apiFetch({ path: `${BASE}/overview?range=${encodeURIComponent(range)}` });

export const getTracks = (range = '7d') => apiFetch({ path: `${BASE}/tracks?range=${encodeURIComponent(range)}` });

export const purgeData = () => apiFetch({ path: `${BASE}/purge`, method: 'DELETE' });

// Forget the stored errors of these tracks (all flagged ones when empty).
export const dismissBroken = (ids = []) => apiFetch({ path: `${BASE}/broken/dismiss`, method: 'POST', data: { ids } });
