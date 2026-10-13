// Grey placeholders shown while data loads. The same markup is printed by PHP before the script arrives
// (see Analytics::render_shell), so the hand-over from server to React does not move anything.
import { __ } from '@wordpress/i18n';

const Bone = ({ w, h }) => <span className="h5ap-an-skel" style={{ width: w, height: h }} />;

export const OverviewSkeleton = () => (
	<section className="h5ap-an-overview">
		<div className="h5ap-an-stats">
			{[0, 1, 2, 3].map((i) => (
				<div key={i} className="h5ap-an-stat">
					<Bone w="50%" h={14} />
					<Bone w="60%" h={34} />
					<Bone w="75%" h={14} />
				</div>
			))}
		</div>
		<div className="h5ap-an-overview__chart">
			<div className="h5ap-an-overview__caption"><Bone w={130} h={16} /><Bone w={210} h={42} /></div>
			<div className="h5ap-an-skel-chart">
				{[0, 1, 2, 3, 4].map((i) => <span key={i} />)}
			</div>
		</div>
	</section>
);

export const RowsSkeleton = ({ rows = 5 }) => (
	<div className="h5ap-an-skel-rows">
		{Array.from({ length: rows }, (_, i) => (
			<div key={i} className="h5ap-an-skel-row">
				<Bone w={30} h={30} />
				<div className="h5ap-an-skel-stack">
					<Bone w={`${60 - (i % 3) * 10}%`} h={14} />
					<Bone w={60} h={12} />
				</div>
				<Bone w={40} h={14} />
				<Bone w={60} h={14} />
			</div>
		))}
	</div>
);

export const TableSkeleton = ({ rows = 5 }) => (
	<section className="h5ap-an-panel is-flush">
		<header className="h5ap-an-panel__head">
			<div className="h5ap-an-skel-stack">
				<Bone w={150} h={26} />
				<Bone w={260} h={14} />
			</div>
		</header>
		<RowsSkeleton rows={rows} />
	</section>
);

export default function PageSkeleton() {
	return (
		<div className="h5ap-an-stack" aria-busy="true">
			<span className="screen-reader-text" role="status">{__('Loading analytics…', 'html5-audio-player')}</span>
			<OverviewSkeleton />
			<TableSkeleton />
		</div>
	);
}
