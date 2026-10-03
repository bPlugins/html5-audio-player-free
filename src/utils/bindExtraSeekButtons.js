// Plyr wires only the first [data-plyr="rewind"] / [data-plyr="fast-forward"] it finds. Skins that
// render a second set (Stamp shows its inner pair on mobile) need the remaining buttons wired here.
export default function bindExtraSeekButtons(player) {
	const wire = () => {
		const container = player?.elements?.container;
		if (!container) {
			return;
		}
		const groups = [
			['rewind', 'rewind', player.elements.buttons?.rewind],
			['fast-forward', 'forward', player.elements.buttons?.fastForward],
		];
		groups.forEach(([attr, method, wiredByPlyr]) => {
			container.querySelectorAll(`[data-plyr="${attr}"]`).forEach((button) => {
				if (button === wiredByPlyr || button.dataset.h5apSeekBound) {
					return;
				}
				button.dataset.h5apSeekBound = '1';
				button.addEventListener('click', (event) => {
					event.preventDefault();
					player[method]();
				});
			});
		});
	};

	player.on('ready', wire);
}
