import { __ } from '@wordpress/i18n';
import { crown, logo } from '../icons';

// Same top bar as the plugin dashboard (Help & Demos). The inner row shares the page content width.
export default function BrandBar({ name, version, isPro, upgradeUrl }) {
	return (
		<div className="h5ap-an-bar">
			<div className="h5ap-an-bar__inner">
				<div className="h5ap-an-bar__brand">
					<span className="h5ap-an-bar__logo">{logo}</span>
					<strong>{name}</strong>
					{version && <span className="h5ap-an-version">v{version}</span>}
				</div>
				{!isPro && (
					<div className="h5ap-an-bar__actions">
						<a className="h5ap-an-btn is-gradient" href={upgradeUrl} target="_blank" rel="noopener noreferrer">
							{crown}{__('Upgrade to Pro', 'html5-audio-player')}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
