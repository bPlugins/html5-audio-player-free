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
            setNotice(__('Failed to save setting.', 'h5ap'));
        }
    }, [error]);

    const handleToggle = () => {
        const newValue = !enabled;

        // Show confirm dialog when enabling (destructive action)
        if (newValue) {
            const confirmed = window.confirm(
                __('Are you sure? This will permanently delete all HTML5 Audio Player data (audio players, radio players, playlists, and all settings) when the plugin is uninstalled.', 'h5ap')
            );

            if (!confirmed) return;
        }

        setNotice('');
        saveData({ enabled: String(newValue) });
    };

    return <div className='bPlDashboardSettings bPlDashboardCard'>
        <h2>{__('Delete Data on Uninstall', 'h5ap')}</h2>

        <p>{__('When enabled, all plugin data will be permanently deleted when you uninstall (delete) the plugin. This includes:', 'h5ap')}</p>

        <ul>
            <li>{__('All Audio Player posts (audioplayer post type)', 'h5ap')}</li>
            <li>{__('All Radio Player posts (radioplayer post type)', 'h5ap')}</li>
            <li>{__('All player configuration and meta data', 'h5ap')}</li>
            <li>{__('All taxonomy terms (categories & tags)', 'h5ap')}</li>
            <li>{__('All plugin settings and options', 'h5ap')}</li>
        </ul>

        <p className='settingsWarning'>
            {__('⚠️ This action cannot be undone. Your data will be safe if you only deactivate the plugin.', 'h5ap')}
        </p>

        <div className='settingsControl'>
            <label className='toggleControl'>
                <input type='checkbox' checked={enabled} onChange={handleToggle} disabled={isLoading} />

                <span className='toggleSlider' />
            </label>

            <span className='toggleLabel'>
                {enabled
                    ? __('Data will be deleted on uninstall', 'h5ap')
                    : __('Data will be preserved on uninstall', 'h5ap')
                }
            </span>
        </div>

        {notice && <div className={`settingsNotice ${enabled ? 'warning' : 'success'}`}>{notice}</div>}
    </div>;
};
export default Settings;
