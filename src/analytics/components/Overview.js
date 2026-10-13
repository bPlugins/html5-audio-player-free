import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { formatDate, formatDuration, formatNumber } from '../format';
import { lock } from '../icons';
import Segment from './Segment';
import TrendChart from './TrendChart';

// Daily value for each chartable metric.
const METRICS = {
	plays: { value: (p) => p.plays, format: formatNumber, tab: () => __('Plays', 'html5-audio-player'), label: () => __('Plays per day', 'html5-audio-player') },
	seconds: { value: (p) => p.seconds, format: formatDuration, tab: () => __('Listening time', 'html5-audio-player'), label: () => __('Listening time per day', 'html5-audio-player') },
};

const StatBody = ({ stat, upgradeUrl }) => (
	<>
		<span className="h5ap-an-stat__label">
			<span className="h5ap-an-stat__icon">{stat.icon}</span>
			{stat.label}
		</span>
		{stat.locked ? (
			<>
				<strong className="h5ap-an-stat__value is-blurred" aria-hidden="true">{stat.sample}</strong>
				<a className="h5ap-an-unlock" href={upgradeUrl} target="_blank" rel="noopener noreferrer">{lock}{__('Available in Pro', 'html5-audio-player')}</a>
			</>
		) : (
			<>
				<strong className="h5ap-an-stat__value">{stat.value}</strong>
				<span className="h5ap-an-stat__foot">
					<span className="h5ap-an-stat__note">{stat.note}</span>
				</span>
			</>
		)}
	</>
);

/**
 * One panel: the key numbers on top, the daily chart underneath.
 * The tabs above the chart pick what it shows; clicking a number does the same.
 */
export default function Overview({ stats, series, upgradeUrl }) {
	const chartable = stats.filter((s) => s.metric && !s.locked && METRICS[s.metric]);
	const [metric, setMetric] = useState('plays');
	const def = METRICS[metric];
	const points = series.map((p) => ({ date: p.date, value: def.value(p) }));
	const peak = points.reduce((best, p) => (p.value > (best ? best.value : 0) ? p : best), null);

	return (
		<section className="h5ap-an-overview">
			<div className="h5ap-an-stats">
				{stats.map((stat) => {
					if (!chartable.includes(stat)) {
						return (
							<div key={stat.label} className={`h5ap-an-stat${stat.locked ? ' is-locked' : ''}`}>
								<StatBody stat={stat} upgradeUrl={upgradeUrl} />
							</div>
						);
					}
					const active = stat.metric === metric;
					return (
						<button
							key={stat.label}
							type="button"
							aria-pressed={active}
							title={__('Show on the chart', 'html5-audio-player')}
							className={`h5ap-an-stat is-chartable${active ? ' is-active' : ''}`}
							onClick={() => setMetric(stat.metric)}
						>
							<StatBody stat={stat} upgradeUrl={upgradeUrl} />
						</button>
					);
				})}
			</div>

			<div className="h5ap-an-overview__chart">
				<div className="h5ap-an-overview__caption">
					<div className="h5ap-an-overview__title">
						<span>{def.label()}</span>
						{peak && (
							<span className="h5ap-an-peak">
								{/* translators: 1: date, 2: value */}
								{sprintf(__('Best day: %1$s · %2$s', 'html5-audio-player'), formatDate(peak.date), def.format(peak.value))}
							</span>
						)}
					</div>
					<Segment
						label={__('Chart metric', 'html5-audio-player')}
						value={metric}
						onChange={setMetric}
						options={chartable.map((stat) => ({ key: stat.metric, label: METRICS[stat.metric].tab() }))}
					/>
				</div>
				<TrendChart points={points} format={(v) => def.format(v)} label={def.label()} />
			</div>
		</section>
	);
}
