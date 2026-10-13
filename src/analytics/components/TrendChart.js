import { useEffect, useRef, useState } from '@wordpress/element';
import { formatDate } from '../format';

const HEIGHT = 230;
const PAD = { top: 16, right: 16, bottom: 30, left: 48 };

const niceMax = (value) => {
	if (value <= 4) {
		return 4;
	}
	const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
	const steps = [1, 2, 2.5, 5, 10];
	for (const step of steps) {
		const candidate = step * magnitude;
		if (candidate >= value) {
			return Math.ceil(value / (candidate / 4)) * (candidate / 4);
		}
	}
	return value;
};

export default function TrendChart({ points, format, label }) {
	const wrapRef = useRef(null);
	const [width, setWidth] = useState(640);
	const [hover, setHover] = useState(null);

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) {
			return undefined;
		}
		const update = () => setWidth(Math.max(280, el.clientWidth));
		update();
		if (typeof ResizeObserver === 'undefined') {
			return undefined;
		}
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const values = points.map((p) => p.value);
	const max = niceMax(Math.max(0, ...values));
	const innerW = width - PAD.left - PAD.right;
	const innerH = HEIGHT - PAD.top - PAD.bottom;
	const x = (i) => PAD.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : innerW / 2);
	const y = (v) => PAD.top + innerH - (v / max) * innerH;

	const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
	const area = points.length ? `${line} L${x(points.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z` : '';
	const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
	const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerW / 90))));
	const last = points.length - 1;
	// The last day always gets a label, so drop a regular label that would sit on top of it.
	const showLabel = (i) => i === last || (i % labelEvery === 0 && last - i >= labelEvery * 0.6);

	const onMove = (event) => {
		if (!points.length) {
			return;
		}
		const rect = event.currentTarget.getBoundingClientRect();
		const px = event.clientX - rect.left;
		const ratio = points.length > 1 ? (px - PAD.left) / innerW : 0;
		const index = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));
		setHover(index);
	};

	return (
		<div className="h5ap-an-chart" ref={wrapRef}>
			<svg width={width} height={HEIGHT} role="img" aria-label={label} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
				<defs>
					<linearGradient id="h5apAnFill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
						<stop offset="100%" stopColor="currentColor" stopOpacity="0" />
					</linearGradient>
				</defs>
				{ticks.map((t) => (
					<g key={t}>
						<line className="h5ap-an-grid" x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} />
						<text className="h5ap-an-axis" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">{format(t, true)}</text>
					</g>
				))}
				{points.map((p, i) => (showLabel(i) ? (
					<text key={p.date} className="h5ap-an-axis" x={x(i)} y={HEIGHT - 8} textAnchor="middle">{formatDate(p.date)}</text>
				) : null))}
				{area && <path d={area} fill="url(#h5apAnFill)" />}
				{line && <path d={line} className="h5ap-an-line" fill="none" />}
				{/* On longer ranges a dot marks each day that has data, so single days are easy to spot. */}
				{points.length > 7 && points.map((p, i) => (p.value > 0 ? <circle key={`pt-${p.date}`} cx={x(i)} cy={y(p.value)} r="3" className="h5ap-an-point" /> : null))}
				{hover !== null && points[hover] && (
					<g>
						<line className="h5ap-an-cursor" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} />
						<circle cx={x(hover)} cy={y(points[hover].value)} r="4.5" className="h5ap-an-dot" />
					</g>
				)}
			</svg>
			{hover !== null && points[hover] && (
				<div className="h5ap-an-tooltip" style={{ left: Math.min(width - 140, Math.max(0, x(hover) - 60)) }}>
					<span>{formatDate(points[hover].date, true)}</span>
					<strong>{format(points[hover].value)}</strong>
				</div>
			)}
		</div>
	);
}
