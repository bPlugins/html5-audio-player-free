import './admin.scss';
import App from './App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.getElementById('h5apAdminDashboard');
	// This script also loads on other plugin pages (e.g. Settings) that have no dashboard to mount.
	if (!dashboardEl || !dashboardEl.dataset.info) {
		return;
	}
	const info = JSON.parse(dashboardEl.dataset.info);

	ReactDOM.createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);

	dashboardEl.removeAttribute('data-info');
});

