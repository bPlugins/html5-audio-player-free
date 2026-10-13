// Button group styled like the dashboard's "Getting Started" tabs.
export default function Segment({ options, value, onChange, label }) {
	return (
		<div className="h5ap-an-segment" role="group" aria-label={label}>
			{options.map((o) => (
				<button key={o.key} type="button" aria-pressed={value === o.key} className={value === o.key ? 'is-active' : ''} onClick={() => onChange(o.key)}>
					{o.label}
				</button>
			))}
		</div>
	);
}
