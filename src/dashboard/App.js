import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from '../../../bpl-tools/Admin/Welcome';
import Demos from '../../../bpl-tools/Admin/Demos';
import Pricing from '../../../bpl-tools/Admin/Pricing';
import FeatureCompare from '../../../bpl-tools/Admin/FeatureCompare';
import Activation from '../../../bpl-tools/Admin/Activation';
import OurPlugins from '../../../bpl-tools/Admin/OurPlugins';

import Settings from './Settings';
import Layout from './Layout';
// import Welcome from './Welcome';

import { demoInfo, pricingInfo, welcomeInfo } from './utils/data';

const App = (props) => {
	const { isPremium, hasPro, adminUrl, isElementorActive } = props;

	return <Router>
		<Routes>
			<Route path='/' element={<Layout {...props} />}>
				{/* <Route index element={<Welcome {...props} />} />

				<Route path='welcome' element={<Welcome {...props} />} /> */}

				<Route index element={<Welcome {...props} {...welcomeInfo(adminUrl, isElementorActive)} />} />

				<Route path='welcome' element={<Welcome {...props} {...welcomeInfo(adminUrl, isElementorActive)} />} />

				<Route path='demos' element={<Demos demoInfo={demoInfo} {...props} />} />

				{!isPremium && <Route path='pricing' element={<Pricing pricingInfo={pricingInfo} options={{}} {...props} />} />}

				{!isPremium && <Route path='feature-comparison' element={<FeatureCompare plans={['free', 'pro']} {...props} />} />}

				<Route path='settings' element={<Settings {...props} />} />

				{hasPro && <Route path='activation' element={<Activation {...props} />} />}

				<Route path='our-plugins' element={<OurPlugins {...props} />} />

				<Route path='*' element={<Navigate to='/welcome' replace />} />
			</Route>
		</Routes>
	</Router>
}
export default App;