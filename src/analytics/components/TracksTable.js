import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getTracks } from '../api';
import { formatDuration, formatNumber, sourceHost } from '../format';
import { arrow, lock, music, radio } from '../icons';
import { RowsSkeleton } from './Skeleton';

const ProCell = ({ upgradeUrl }) => (
	<a className="h5ap-an-lock-cell" href={upgradeUrl} target="_blank" rel="noopener noreferrer" title={__('Available in Pro', 'html5-audio-player')}>
		{lock}{__('Pro', 'html5-audio-player')}
	</a>
);

export default function TracksTable({ upgradeUrl, refreshKey, rangeKey = '7d' }) {
	const [data, setData] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;
		setError('');
		getTracks(rangeKey)
			.then((res) => active && setData(res))
			.catch((err) => active && setError(err.message || __('Could not load tracks.', 'html5-audio-player')));
		return () => {
			active = false;
		};
	}, [refreshKey, rangeKey]);

	const topPlays = data && data.items.length ? Math.max(1, ...data.items.map((item) => item.plays)) : 1;

	return (
		<section className="h5ap-an-panel is-flush">
			<header className="h5ap-an-panel__head">
				<div>
					<h2>{__('Top Tracks', 'html5-audio-player')}</h2>
					<p>{__('Your 5 most played tracks in this period.', 'html5-audio-player')}</p>
				</div>
			</header>

			{error && <p className="h5ap-an-error">{error}</p>}
			{!data && !error && <RowsSkeleton rows={5} />}

			{data && data.items.length === 0 && (
				<div className="h5ap-an-empty">
					<span className="h5ap-an-empty__icon">{music}</span>
					<strong>{__('No plays in this period yet', 'html5-audio-player')}</strong>
					<span>{__('Plays appear here after someone listens for at least 3 seconds.', 'html5-audio-player')}</span>
				</div>
			)}

			{data && data.items.length > 0 && (
				<div className="h5ap-an-table-wrap">
					<table className="h5ap-an-table">
						<thead>
							<tr>
								<th className="num rank">#</th>
								<th>{__('Track', 'html5-audio-player')}</th>
								<th className="num">{__('Plays', 'html5-audio-player')}</th>
								<th className="num">{__('Listening time', 'html5-audio-player')}</th>
								<th className="num">{__('Avg. listen', 'html5-audio-player')}</th>
								<th className="num">{__('Completion', 'html5-audio-player')}</th>
							</tr>
						</thead>
						<tbody>
							{data.items.map((item, index) => (
								<tr key={item.id}>
									<td className="num rank"><span className="h5ap-an-rank">{index + 1}</span></td>
									<td className="h5ap-an-track-cell">
										<span className="h5ap-an-share" style={{ '--share': item.plays / topPlays }} aria-hidden="true" />
										<span className="h5ap-an-track-name">{item.title}</span>
										<span className="h5ap-an-track-meta">
											<span className={`h5ap-an-pill is-${item.type}`}>
												{item.type === 'radio' ? radio : music}
												{item.type === 'radio' ? __('Radio', 'html5-audio-player') : __('Audio', 'html5-audio-player')}
											</span>
											{item.source ? <span className="h5ap-an-host">{sourceHost(item.source)}</span> : null}
										</span>
									</td>
									<td className="num strong">{formatNumber(item.plays)}</td>
									<td className="num">{formatDuration(item.seconds)}</td>
									<td className="num"><ProCell upgradeUrl={upgradeUrl} /></td>
									<td className="num"><ProCell upgradeUrl={upgradeUrl} /></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{data && (
				<div className="h5ap-an-upsell">
					<p>{__('See every track (including each track inside playlists), sort by listening time or completion, and open detailed reports with Pro.', 'html5-audio-player')}</p>
					<a className="h5ap-an-btn" href={upgradeUrl} target="_blank" rel="noopener noreferrer">{__('Upgrade to Pro', 'html5-audio-player')}{arrow}</a>
				</div>
			)}
		</section>
	);
}
