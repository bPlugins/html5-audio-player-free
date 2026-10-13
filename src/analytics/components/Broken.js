import { useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { dismissBroken } from '../api';
import { arrow, warning } from '../icons';

export default function Broken({ count, upgradeUrl }) {
	const [dismissed, setDismissed] = useState(false);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		setDismissed(false);
	}, [count]);

	// Clears the stored errors, so the alert only returns if a file fails again.
	const dismiss = () => {
		setBusy(true);
		dismissBroken()
			.then(() => setDismissed(true))
			.finally(() => setBusy(false));
	};

	if (!count || dismissed) {
		return null;
	}

	return (
		<div className="h5ap-an-alert" role="alert">
			<span className="h5ap-an-alert__icon">{warning}</span>
			<div className="h5ap-an-alert__body">
				<span className="h5ap-an-alert__tag">{__('Action needed', 'html5-audio-player')}</span>
				<strong>
					{sprintf(
						/* translators: %d: number of audio files */
						_n('%d audio file failed to play for several visitors in the last 2 days.', '%d audio files failed to play for several visitors in the last 2 days.', count, 'html5-audio-player'),
						count
					)}
				</strong>
				<p>
					{__('The file may have been moved or deleted. Upgrade to Pro to see which files are affected.', 'html5-audio-player')}{' '}
					<a className="h5ap-an-textlink" href={upgradeUrl} target="_blank" rel="noopener noreferrer">{__('Upgrade to Pro', 'html5-audio-player')}{arrow}</a>
				</p>
			</div>
			<button type="button" className="h5ap-an-alert__dismiss" onClick={dismiss} disabled={busy}>
				{__('Dismiss', 'html5-audio-player')}
			</button>
		</div>
	);
}
