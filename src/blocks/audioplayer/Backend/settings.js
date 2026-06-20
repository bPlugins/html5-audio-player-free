import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, useEffect } from 'react'
import PanelItem from "../../components/PanelItem/PanelItem";
import { ColorControl, InlineMediaUpload, Notice } from './../../../../../bpl-tools/Components'
import { TabPanel, Panel, PanelBody, PanelRow, ToggleControl, __experimentalUnitControl as UnitControl, SelectControl, RadioControl } from '@wordpress/components';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { AdvertiseCard } from '../../../../../bpl-tools/ProControls/index.js';

const Settings = ({ attributes, setAttributes, siteUrl }) => {
  const { source, controls, primaryColor, bgColor, controlColor, poster, skin, alignment, isSticky, title, artist, repeat, preload, radius, autoplay, muted, loader, width, lazyLoad } = attributes;

  const pricingURL = `${siteUrl}/wp-admin/admin.php?page=html5-audio-player-help-demo#/pricing`;

  const handleControl = (control) => {
    const newControls = { ...controls };
    newControls[control] = !newControls[control];
    setAttributes({ controls: newControls });
  };

  const controlSettings = ["Restart", "Rewind", "Play", "Fast Forward", "Progress", "Duration", "Current Time", "Mute", "Volume", "Settings", "Download"];

  // const skins = ["Default", "Fusion", "Stamp", "Wave", "Card 1", "Card 2", "Simple 1", "Simple 2", "Player9", "Player10", "Player11"];

  const skins = ["Default", "Fusion", "Stamp", "Wave"];

  useEffect(() => {
    // Only seed colors that are still empty so we never overwrite a value the
    // user already customized and saved (otherwise colors revert on reload).
    if (!primaryColor && !bgColor) {
      setAttributes({ primaryColor: window.h5apEditor?.color?.primary, bgColor: window.h5apEditor?.color?.bg });
    } else if (!primaryColor) {
      setAttributes({ primaryColor: window.h5apEditor?.color?.primary });
    }
  }, []);

  const getStylePremiumNoticeText = () => {
    const features = [];

    if (["Default", "Simple 1", "Simple 2", "Player11", "Player10", "Player9", "Card 2", "Card 1"].includes(skin.replace("-", " "))) {
      features.push(__('Primary / Progress Color', 'html5-audio-player'));
    }

    if (["Default", "Wave", "Card 1", "Card 2", "Simple 1", "Simple 2", "Player11", "Player10", "Player9", "Stamp", "Fusion"].includes(skin.replace("-", " "))) {
      features.push(__('Background Color', 'html5-audio-player'));
    }

    if (["Player11", "Player10", "Player9", "Card 2", "Card 1", "Wave", "Simple 1"].includes(skin.replace("-", " "))) {
      features.push(__('Text Color', 'html5-audio-player'));
    }

    return __('Advanced styling options like ', 'html5-audio-player') +
      features.join(', ') +
      __(' and more are available in the Pro version.', 'html5-audio-player');
  };

  const getSettingsPremiumNoticeText = () => {
    const features = [__('7 More Pro Skins', 'html5-audio-player'), __('Save State', 'html5-audio-player'), __('Disable Pause', 'html5-audio-player'), __('Seek Time', 'html5-audio-player'), __('Start Time', 'html5-audio-player'), __('End Time', 'html5-audio-player')];
    if (skin === "Fusion") {
      features.push(__('Initial Volume', 'html5-audio-player'));
      features.push(__('Download Button', 'html5-audio-player'));
    }
    return __('Features like ', 'html5-audio-player') +
      features.join(', ') +
      __(' and more are available in the Pro version.', 'html5-audio-player');
  };

  return (
    <Fragment>
      <InspectorControls>
        <TabPanel
          className="bPSS bPlTabPanel"
          activeClass="active-tab activeTab"
          tabs={[
            {
              name: "settings",
              title: "Settings",
              className: "general btTab",
            },
            {
              name: "controls",
              title: "Controls",
              className: "slider btTab",
            },
            {
              name: "style",
              title: "Style",
              className: "style btTab",
            },
          ]}
        >
          {(tab) => {
            return (
              <span>
                {tab.name == "settings" && (
                  <span>
                    <Panel>
                      <PanelBody className="bPlPanelBody">
                        <SelectControl
                          className='mt10'
                          label={__("Select Skin:", "h5ap")}
                          labelPosition='left'
                          options={skins.map((item) => ({ label: item, value: item.replace(" ", "-") }))}
                          value={skin}
                          onChange={(skin) => setAttributes({ skin })}
                        />

                        <InlineMediaUpload className='mt10' label={__("Upload Audio File", "h5ap")} types={["audio"]} value={source} onChange={(source) => setAttributes({ source })} placeholder="Audio URL" />

                        {["Fusion", "Wave", "Card-1", "Card-2", "Simple-2", "Player9", "Player10", "Player11"].includes(skin) && (
                          <Fragment>
                            <InlineMediaUpload className='mt10' label={__("Poster/Thumbnail", "h5ap")} value={poster} type={["image"]} onChange={(poster) => setAttributes({ poster })} />
                          </Fragment>
                        )}

                        {!['Default', "Simple-1", "Simple-2"].includes(skin) && (
                          <Fragment>
                            <PanelItem className='mt10' label={__("Title", "h5ap")} value={title} placeholder={__("Audio Title", "h5ap")} onChange={(title) => setAttributes({ title })} />
                          </Fragment>
                        )}

                        {!['Default', 'Fusion', 'Stamp', "Simple-1", "Simple-2"].includes(skin) && (
                          <Fragment>
                            <PanelItem className='mt10' label={__("Artist", "h5ap")} value={artist} placeholder={__("Artist", "h5ap")} onChange={(artist) => setAttributes({ artist })} />
                          </Fragment>
                        )}

                        <RadioControl
                          className='mt15'
                          label={__("Preload", "h5ap")}
                          selected={preload}
                          options={[
                            { label: 'Auto', value: 'auto' },
                            { label: 'Only Metadata', value: 'metadata' },
                            { label: 'None', value: 'none' },
                          ]}
                          onChange={(value) => setAttributes({ preload: value })}
                        />

                        <ToggleControl help={__("This behavior may vary depending on the browser.", "h5ap")} className="mt10" label={__("Autoplay", "h5ap")} id="autoplay" checked={autoplay} onChange={() => setAttributes({ autoplay: !autoplay })} />

                        <ToggleControl className="mt10" label={__("Repeat", "h5ap")} id="repeat" checked={repeat} onChange={() => setAttributes({ repeat: !repeat })} />

                        <ToggleControl className="mt10" label={__("Muted", "h5ap")} id="muted" checked={muted} onChange={() => setAttributes({ muted: !muted })} />

                        <ToggleControl className="mt10" label={__("Loader", "h5ap")} id="loader" checked={loader} onChange={() => setAttributes({ loader: !loader })} />

                        {!isSticky && (
                          <SelectControl
                            className='mt10'
                            label={__("Lazy Load", 'h5ap')}
                            help={__("Load player only when in viewport. (Unavailable when 'Enable Sticky' is active).", "h5ap")}
                            value={lazyLoad}
                            options={[
                              { label: __('Inherit (Global Settings)', 'h5ap'), value: 'default' },
                              { label: __('Enable', 'h5ap'), value: 'on' },
                              { label: __('Disable', 'h5ap'), value: 'off' },
                            ]}
                            onChange={(value) => setAttributes({ lazyLoad: value })}
                          />
                        )}

                        {["Default", "Fusion", "Stamp", "Wave", "Simple-1", "Simple-2"].includes(skin) &&
                          <ToggleControl help={__("Keep player visible while scrolling. (Hides Lazy Load since sticky players must load immediately).", "h5ap")} className="mt15" label={__("Enable Sticky", "h5ap")} id="isSticky" checked={isSticky} onChange={() => setAttributes({ isSticky: !isSticky })} />
                        }
                        <Notice status='premium' isIcon={true} className="mt15">{getSettingsPremiumNoticeText()}</Notice>
                      </PanelBody>
                    </Panel>
                  </span>
                )}
                {tab.name == "controls" && (
                  <Panel>
                    <PanelBody className='bPlPanelBody'>
                      {skin === "Default"
                        ? (
                          <Fragment>
                            {controlSettings.filter((item) => ["Play", "Progress", "Mute", "Volume", "Duration", "Current Time", "Settings"].includes(item)).map((item) => {
                              const control = item.toLocaleLowerCase()?.replace(" ", "-");
                              return <ToggleControl className="mb5" key={control} label={__(item, "h5ap")} id={control} checked={controls[control]} onChange={() => handleControl(control)} />;
                            })}

                            <Notice status='premium' isIcon={true}>
                              {__('Controls like ', 'html5-audio-player')}
                              {controlSettings.filter(item => !["Play", "Progress", "Mute", "Volume", "Duration", "Current Time", "Settings"].includes(item)).join(', ')}
                              {__(' are available in the Pro version.', 'html5-audio-player')}
                            </Notice>
                          </Fragment>
                        )
                        : __("Controls are available only Default skin", "h5ap")}
                    </PanelBody>
                  </Panel>
                )}
                {tab.name == "style" && (
                  <span>
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
                        {["Default", "Fusion", "Stamp", "Wave", "Card 2", "Simple 1"].includes(skin.replace("-", " ")) && (
                          <PanelRow>
                            <UnitControl
                              label={__("Radius", "bpm")}
                              units={[
                                { label: "px", value: "px", default: 0 },
                                { label: "%", value: "%", default: 0 },
                                { label: "em", value: "em", default: 0 },
                              ]}
                              onChange={(radius) => setAttributes({ radius })}
                              value={typeof radius === "object" ? `${radius.number}${radius.unit}` : radius}
                              isResetValueOnUnitChange={true}
                              labelPosition="side"
                            />
                          </PanelRow>
                        )}

                        {["Default", "Player11", "Player10", "Player9", "Simple 2", "Simple 1", "Card 2", "Card 1", "Wave", "Stamp", "Fusion"].includes(skin.replace("-", " ")) && (
                          <Fragment>
                            <ColorControl label={__("Control Color", "h5ap")} value={controlColor} defaultColor={"#4a5464"} onChange={(controlColor) => setAttributes({ controlColor })} />
                          </Fragment>
                        )}

                        <Notice status='premium' isIcon={true}>{getStylePremiumNoticeText()}</Notice>
                      </PanelBody>
                    </Panel>
                  </span>
                )}
              </span>
            );
          }}
        </TabPanel>
        <BlockControls>
          <AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Alignment')} alignmentControls={[
            { title: __('Left', 'html5-audio-player'), align: 'left', icon: 'align-left' },
            { title: __('Center', 'html5-audio-player'), align: 'center', icon: 'align-center' },
            { title: __('Right', 'html5-audio-player'), align: 'right', icon: 'align-right' }
          ]} />
        </BlockControls>

        <AdvertiseCard planLink={pricingURL || 'https://bplugins.com/products/html5-audio-player/pricing'} />

      </InspectorControls>
    </Fragment>
  );
};

export default compose(
  withSelect((select) => {
    return {
      siteUrl: select('core').getSite()?.url,
    };
  })
)(Settings);
