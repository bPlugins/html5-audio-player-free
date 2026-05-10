import { __ } from '@wordpress/i18n';
import { Fragment } from 'react'
import { ColorControl, ColorsControl, SolidBackground, Notice } from './../../../../../../bpl-tools/Components'
import { Panel, PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { produce } from 'immer';

const Style = ({ attributes, setAttributes }) => {
    const { styles, skin, width, sourceType } = attributes;
    const { title, statusText, track, secondaryBackground } = styles;

    const updateStyles = (key, value) => {
        const newStyles = produce(styles, (draft) => {
            draft[key] = value;
        });
        setAttributes({ styles: newStyles });
    }

    const getPremiumNoticeText = () => {
        const typo = [__('Title', 'html5-audio-player')];
        if (["DashboardStyle"].includes(skin)) typo.push(__('Sub Title', 'html5-audio-player'));
        if (sourceType === "stream" && skin !== "CompactHorizontal") typo.push(__('Track', 'html5-audio-player'));

        const icons = [];
        if (["DashboardStyle", "GlassMorphism"].includes(skin)) icons.push(__('Radio', 'html5-audio-player'));
        icons.push(__('Play', 'html5-audio-player'), __('Volume', 'html5-audio-player'));

        return __('Custom Border styling, Advanced Typography (', 'html5-audio-player') +
            typo.join(', ') +
            __('), and Icon Color customizations (', 'html5-audio-player') +
            icons.join(', ') +
            __(', etc.) are available in the Pro version.', 'html5-audio-player');
    };

    return (
        <Panel>
            <PanelBody className="bplPanelBody">
                <PanelRow>
                    <UnitControl
                        label={__("Width", "h5ap")}
                        labelPosition="side"
                        units={[
                            { value: "px", label: "px", default: 500 },
                            { value: "%", label: "%", default: 100 },
                        ]}
                        onChange={(width) => setAttributes({ width })}
                        value={typeof width === "object" ? `${width.number}${width.unit}` : width}
                        isResetValueOnUnitChange={true}
                    />
                </PanelRow>

                <SolidBackground
                    label={__("Main Background", "h5ap")}
                    className="mt15"
                    value={styles.background}
                    onChange={(background) => updateStyles('background', background)}
                />
                {["DashboardStyle"].includes(skin) && (
                    <Fragment>
                        <SolidBackground label={__("Secondary Background", "h5ap")} value={secondaryBackground} onChange={(secondaryBackground) => updateStyles('secondaryBackground', secondaryBackground)} />
                    </Fragment>
                )}

                <hr />

                {sourceType === "stream" && <ColorsControl label={__("Status Text Color:", "h5ap")} value={statusText}
                    onChange={(statusText) => updateStyles('statusText', statusText)} />}

                <ColorControl label={__("Title Color", "h5ap")} default="#333" value={title?.color} onChange={(color) => updateStyles('title', { ...title, color })} />

                {sourceType === "stream" && skin !== "CompactHorizontal" && (
                    <ColorControl label={__("Track Color", "h5ap")} value={track?.color || {}} onChange={(color) => updateStyles('track', { ...track, color })} />
                )}

                <hr />

                <Notice status='premium' isIcon={true}>{getPremiumNoticeText()}</Notice>
            </PanelBody>
        </Panel>
    )
}

export default Style;