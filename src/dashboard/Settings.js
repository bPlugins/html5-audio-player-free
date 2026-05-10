import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import useWPAjax from '../../../bpl-tools/hooks/useWPAjax';

const Settings = ({ deleteDataOnUninstall, uninstallNonce }) => {
    const [enabled, setEnabled] = useState(deleteDataOnUninstall);
    const [notice, setNotice] = useState('');

    const { data, saveData, isLoading, error } = useWPAjax('h5apSaveUninstallOption', { nonce: uninstallNonce }, false);

    useEffect(() => {
        if (data) {
            setEnabled(data.enabled);
            setNotice(data.message);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setNotice(__('Failed to save setting.', 'html5-audio-player'));
        }
    }, [error]);

    const handleToggle = () => {
        const newValue = !enabled;

        // Show confirm dialog when enabling (destructive action)
        if (newValue) {
            const confirmed = window.confirm(
                __('Are you sure? This will permanently delete all HTML5 Audio Player data (audio players, radio players, playlists, and all settings) when the plugin is uninstalled.', 'html5-audio-player')
            );

            if (!confirmed) return;
        }

        setNotice('');
        saveData({ enabled: String(newValue) });
    };

    return <div className='bPlDashboardSettings bPlDashboardCard'>
        <h2>{__('Delete Data on Uninstall', 'html5-audio-player')}</h2>

        <p>{__('When enabled, all plugin data will be permanently deleted when you uninstall (delete) the plugin. This includes:', 'html5-audio-player')}</p>

        <ul>
            <li>{__('All Audio Player posts (audioplayer post type)', 'html5-audio-player')}</li>
            <li>{__('All Radio Player posts (radioplayer post type)', 'html5-audio-player')}</li>
            <li>{__('All player configuration and meta data', 'html5-audio-player')}</li>
            <li>{__('All taxonomy terms (categories & tags)', 'html5-audio-player')}</li>
            <li>{__('All plugin settings and options', 'html5-audio-player')}</li>
        </ul>

        <p className='settingsWarning'>
            {__('⚠️ This action cannot be undone. Your data will be safe if you only deactivate the plugin.', 'html5-audio-player')}
        </p>

        <div className='settingsControl'>
            <label className='toggleControl'>
                <input type='checkbox' checked={enabled} onChange={handleToggle} disabled={isLoading} />

                <span className='toggleSlider' />
            </label>

            <span className='toggleLabel'>
                {enabled
                    ? __('Data will be deleted on uninstall', 'html5-audio-player')
                    : __('Data will be preserved on uninstall', 'html5-audio-player')
                }
            </span>
        </div>

        {notice && <div className={`settingsNotice ${enabled ? 'warning' : 'success'}`}>{notice}</div>}
    </div>;
};
export default Settings;
