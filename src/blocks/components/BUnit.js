// import styles from "./styles.module.scss";
/**
 *
 * @props {String} value: '%'
 * @props {Array} units: ['px', 'em', '%']
 * @props {Function} onChange
 * @returns {String}
 */
const BUnit = ({ value = "%", units = ["px", "em", "%"], onChange }) => {
	return (
		<div>
			<ul className={"bButtonGroup"}>
				{units.map((u) => (
					<button
						bisactive={value == u ? "true" : "false"}
						key={u}
						onClick={() => onChange(u)}
					>
						{u}
					</button>
				))}
			</ul>
		</div>
	);
};

export default BUnit;
