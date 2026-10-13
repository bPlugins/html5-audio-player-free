import { createRoot, render } from '@wordpress/element';
import App from './App';
import './style.scss';

const mount = () => {
	const root = document.getElementById('h5ap-analytics-root');
	if (!root || !window.h5apAnalyticsAdmin) {
		return;
	}
	const app = <App settings={window.h5apAnalyticsAdmin} />;
	if (createRoot) {
		createRoot(root).render(app);
	} else {
		render(app, root);
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mount);
} else {
	mount();
}
