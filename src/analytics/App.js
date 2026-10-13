import { createInterpolateElement, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Modal, Notice, Spinner } from '@wordpress/components';
import { getOverview, purgeData } from './api';
import { formatDuration, formatNumber } from './format';
import { average, clock, finish, lock, play, shield, trash } from './icons';
import BrandBar from './components/BrandBar';
import Overview from './components/Overview';
import TracksTable from './components/TracksTable';
import Broken from './components/Broken';
import PageSkeleton from './components/Skeleton';

const OPEN_RANGES = [
	{ key: 'today', label: __('Today', 'html5-audio-player') },
	{ key: '7d', label: __('7 days', 'html5-audio-player') },
];

const LOCKED_RANGES = [
	__('30 days', 'html5-audio-player'),
	__('90 days', 'html5-audio-player'),
	__('Custom', 'html5-audio-player'),
];

// The four numbers at the top of the overview panel.
const overviewStats = (cards) => [
	{ metric: 'plays', icon: play, label: __('Total Plays', 'html5-audio-player'), value: formatNumber(cards.plays), note: __('Listened for at least 3 seconds', 'html5-audio-player') },
	{ metric: 'seconds', icon: clock, label: __('Listening Time', 'html5-audio-player'), value: formatDuration(cards.seconds), note: __('Total time spent listening', 'html5-audio-player') },
	{ icon: average, label: __('Avg. Listen Time', 'html5-audio-player'), locked: true, sample: '2m 14s' },
	{ icon: finish, label: __('Completion Rate', 'html5-audio-player'), locked: true, sample: '64%' },
];

export default function App({ settings }) {
	const { enabled, installed, upgradeUrl, settingsUrl, analyticsSettingsUrl, name, version } = settings;
	const [rangeKey, setRangeKey] = useState('7d');
	const [overview, setOverview] = useState(null);
	const [error, setError] = useState('');
	const [confirmPurge, setConfirmPurge] = useState(false);
	const [purging, setPurging] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [notice, setNotice] = useState('');

	useEffect(() => {
		if (!installed) {
			return;
		}
		let active = true;
		setError('');
		getOverview(rangeKey)
			.then((res) => active && setOverview(res))
			.catch((err) => active && setError(err.message || __('Could not load analytics.', 'html5-audio-player')));
		return () => {
			active = false;
		};
	}, [installed, refreshKey, rangeKey]);

	const runPurge = () => {
		setPurging(true);
		purgeData()
			.then(() => {
				setConfirmPurge(false);
				setNotice(__('All analytics data was deleted.', 'html5-audio-player'));
				setRefreshKey((k) => k + 1);
			})
			.catch((err) => setNotice(err.message || __('Could not delete the data.', 'html5-audio-player')))
			.finally(() => setPurging(false));
	};

	return (
		<div className="h5ap-an">
			<BrandBar name={name} version={version} isPro={false} upgradeUrl={upgradeUrl} />

			<main className="h5ap-an-main">
				<section className="h5ap-an-hero h5ap-an-header">
					<div className="h5ap-an-hero__text">
						<div className="h5ap-an-tags">
							<span className={`h5ap-an-tag ${enabled ? 'is-live' : 'is-off'}`}>
								<i aria-hidden="true" />
								{enabled ? __('Tracking on', 'html5-audio-player') : __('Tracking paused', 'html5-audio-player')}
							</span>
							<span className="h5ap-an-tag is-solid">{__('Free plan', 'html5-audio-player')}</span>
						</div>
						<h1>{__('Audio Analytics', 'html5-audio-player')}</h1>
						<p>
							{overview
								? createInterpolateElement(
									sprintf(
										/* translators: 1: number of plays, 2: listening time */
										overview.range && overview.range.key === 'today'
											/* translators: 1: number of plays, 2: listening time */
											? _n('Today: <b>%1$s play</b> and <b>%2$s</b> of listening', 'Today: <b>%1$s plays</b> and <b>%2$s</b> of listening', overview.cards.plays, 'html5-audio-player')
											: _n('Last 7 days: <b>%1$s play</b> and <b>%2$s</b> of listening', 'Last 7 days: <b>%1$s plays</b> and <b>%2$s</b> of listening', overview.cards.plays, 'html5-audio-player'),
										formatNumber(overview.cards.plays),
										formatDuration(overview.cards.seconds)
									),
									{ b: <strong /> }
								)
								: __('See how your audio and radio players perform: plays, listening time and where people stop.', 'html5-audio-player')}
						</p>
					</div>

					<div className="h5ap-an-range">
						<div className="h5ap-an-segment" role="group" aria-label={__('Period', 'html5-audio-player')}>
							{OPEN_RANGES.map((r) => (
								<button key={r.key} type="button" aria-pressed={rangeKey === r.key} className={rangeKey === r.key ? 'is-active' : ''} onClick={() => setRangeKey(r.key)}>{r.label}</button>
							))}
							{LOCKED_RANGES.map((label) => (
								<a key={label} className="is-locked" href={upgradeUrl} target="_blank" rel="noopener noreferrer" title={__('Available in Pro', 'html5-audio-player')}>
									{lock}{label}
								</a>
							))}
						</div>
					</div>
				</section>

				{notice && <Notice status="success" onRemove={() => setNotice('')}>{notice}</Notice>}

				{!enabled && (
					<Notice status="warning" isDismissible={false}>
						{__('Analytics is turned off, so new plays are not being counted.', 'html5-audio-player')}{' '}
						<a href={analyticsSettingsUrl || settingsUrl}>{__('Turn it on in Settings', 'html5-audio-player')}</a>
					</Notice>
				)}

				{!installed && (
					<Notice status="info" isDismissible={false}>{__('Analytics is being set up. Reload this page in a moment.', 'html5-audio-player')}</Notice>
				)}

				{installed && error && <Notice status="error" isDismissible={false}>{error}</Notice>}

				{installed && !error && !overview && <PageSkeleton />}

				{installed && overview && (
					<div className="h5ap-an-stack">
						<Broken count={overview.broken} upgradeUrl={upgradeUrl} />
						<Overview stats={overviewStats(overview.cards)} series={overview.series} upgradeUrl={upgradeUrl} />
						<TracksTable upgradeUrl={upgradeUrl} refreshKey={refreshKey} rangeKey={rangeKey} />
					</div>
				)}

				<footer className="h5ap-an-footer">
					<p className="h5ap-an-footer__text">
						<span className="h5ap-an-footer__icon">{shield}</span>
						{__('Privacy friendly: no cookies, no outside services, and IP addresses are never stored.', 'html5-audio-player')}
					</p>
					<div className="h5ap-an-footer__actions">
						<a className="h5ap-an-textlink" href={analyticsSettingsUrl || settingsUrl}>{__('Analytics settings', 'html5-audio-player')}</a>
						{installed && (
							<button type="button" className="h5ap-an-btn is-danger-link" onClick={() => setConfirmPurge(true)}>
								{trash}{__('Delete all analytics data', 'html5-audio-player')}
							</button>
						)}
					</div>
				</footer>
			</main>

			{confirmPurge && (
				<Modal className="h5ap-an-modal" title={__('Delete all analytics data?', 'html5-audio-player')} onRequestClose={() => !purging && setConfirmPurge(false)}>
					<p>{__('Every play, chart and report will be removed. Your players and settings are not affected. This cannot be undone.', 'html5-audio-player')}</p>
					<div className="h5ap-an-modal-actions">
						<button type="button" className="h5ap-an-btn is-outline" onClick={() => setConfirmPurge(false)} disabled={purging}>{__('Cancel', 'html5-audio-player')}</button>
						<button type="button" className="h5ap-an-btn is-danger" onClick={runPurge} disabled={purging} aria-busy={purging}>
							{purging && <Spinner />}{__('Delete data', 'html5-audio-player')}
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
}
