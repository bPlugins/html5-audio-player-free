import { __ } from '@wordpress/i18n';
import { Fragment } from 'react'
import { TabPanel, Panel, PanelBody, ToggleControl, SelectControl, TextControl, ResponsiveWrapper } from '@wordpress/components';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import PanelItem from "../../components/PanelItem/PanelItem.js";
import { AdvertiseCard } from '../../../../../bpl-tools/ProControls';
import { BButtonGroup, InlineMediaUpload, Label } from '../../../../../bpl-tools/Components';
import Style from './Tabs/Style.js';

import compactSkin from './../skins/CompactHorizontal.png';
import glassSkin from './../skins/GlassMorphism.png';
import softSkin from './../skins/Soft.png';
import dashboardSkin from './../skins/DashboardStyle.png';

import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const Settings = ({ attributes, siteUrl, setAttributes, isPremium }) => {
  const { source, sourceType, statusText, poster, skin, alignment, isSticky, title, subtitle, lazyLoad } = attributes;

  const pricingURL = `${siteUrl}/wp-admin/admin.php?page=html5-audio-player-help-demo#/pricing`;

  const skins = ["GlassMorphism", "CompactHorizontal", "Soft", "DashboardStyle"];

  return (
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
            name: "skins",
            title: "Skins",
            className: "skins btTab",
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
                        Component={SelectControl}
                        label={__("Skin", "h5ap")}
                        options={skins.map((item) => ({ label: item, value: item.replace(" ", "-") }))}
                        value={skin}
                        onChange={(skin) => setAttributes({ skin })}
                      />

                      <Label className="label mb5 mt10">{__("Source Type", "h5ap")}</Label>
                      <BButtonGroup p options={[{ label: 'Stream URL', value: 'stream' }, { label: 'Self-Hosted Audio', value: 'self-hosted' }]} label={false} value={sourceType} borderRadius='3px' paddingY='7px' onChange={(sourceType) => setAttributes({ sourceType })} />

                      {sourceType === "stream" ? (
                        <>
                          <TextControl
                            label={__("Audio URL", "h5ap")}
                            value={source}
                            onChange={(source) => setAttributes({ source })}
                            placeholder="Audio URL"
                            className='mt15'
                          />

                          <div
                            style={{
                              marginTop: '10px',
                              padding: '10px 12px',
                              background: '#f0f6fc',
                              borderLeft: '4px solid #2271b1',
                              borderRadius: '4px',
                              fontSize: '13px',
                              lineHeight: '1.5'
                            }}
                          >
                            <strong>{__('Note:', 'html5-audio-player')}</strong>{' '}
                            {__('To fetch stream metadata correctly, make sure this stream URL is added to the whitelist in your', 'html5-audio-player')}{' '}
                            <a
                              rel="noreferrer"
                              href={`${window.location.origin}/wp-admin/admin.php?page=html5-audio-player-settings#tab=white-list-stream-url`}
                              target="_blank"
                              style={{
                                fontWeight: '600',
                                textDecoration: 'none'
                              }}
                            >
                              {__('plugin settings', 'html5-audio-player')}
                            </a>.
                          </div>
                        </>
                      ) : (
                        <InlineMediaUpload
                          label={__("Upload Audio File", "h5ap")}
                          types={["audio"]}
                          value={source}
                          onChange={(source) => setAttributes({ source })}
                          placeholder="Audio URL"
                          className='mt15'
                        />
                      )}


                      {["Fusion", "Wave", "Card-1", "Card-2", "Simple-2", "Player9", "Player10", "Player11"].includes(skin) && (
                        <Fragment>
                          <InlineMediaUpload label={__("Poster/Thumbnail", "h5ap")} value={poster} type={["image"]} onChange={(poster) => setAttributes({ poster })} />
                        </Fragment>
                      )}

                      <PanelItem className='mt15' label={__("Title", "h5ap")} value={title} placeholder={__("Title", "h5ap")} onChange={(title) => setAttributes({ title })} />
                      {skin === "DashboardStyle" && <PanelItem className='mt15' label={__("Sub Title", "h5ap")} value={subtitle} placeholder={__("Sub Title", "h5ap")} onChange={(subtitle) => setAttributes({ subtitle })} />}
                      {sourceType === "stream" && <PanelItem className='mt15' label={__("Status Text", "h5ap")} value={statusText} placeholder={__("Live", "h5ap")}
                        onChange={(statusText) => setAttributes({ statusText })} />}


                      {!isSticky && (
                        <ToggleControl help={__("Only load the player and audio resources when it enters the viewport. (Not compatible with Sticky players)", "h5ap")} className="mb5 mt15" label={__("Enable Lazy Load", "h5ap")} id="lazyLoad" checked={lazyLoad} onChange={() => setAttributes({ lazyLoad: !lazyLoad })} />
                      )}

                      {["Default", "Fusion", "Stamp", "Wave", "Simple-1", "Simple-2"].includes(skin) &&
                        <ToggleControl isPremium={isPremium} help={__("Enabling this will hide and disable the Lazy Load option (since sticky players are always fixed in the viewport).", "h5ap")} className="mb5" label={__("Enable Sticky", "h5ap")} id="isSticky" checked={isSticky} onChange={() => setAttributes({ isSticky: !isSticky })} />
                      }

                    </PanelBody>
                  </Panel>
                </span>
              )}
              {tab.name == "skins" && (
                <Panel>
                  <PanelBody className="bPlPanelBody h5ap-radio-player-skins" title={__("Skins", "h5ap")}>
                    <ResponsiveWrapper>
                      <img onClick={() => setAttributes({ skin: 'CompactHorizontal' })} src={compactSkin} />
                    </ResponsiveWrapper>

                    <ResponsiveWrapper>
                      <img onClick={() => setAttributes({ skin: 'GlassMorphism' })} src={glassSkin} />
                    </ResponsiveWrapper>

                    <ResponsiveWrapper >
                      <img onClick={() => setAttributes({ skin: 'Soft' })} src={softSkin} />
                    </ResponsiveWrapper>

                    <ResponsiveWrapper>
                      <img onClick={() => setAttributes({ skin: 'DashboardStyle' })} src={dashboardSkin} />
                    </ResponsiveWrapper>
                  </PanelBody>
                </Panel>
              )}
              {tab.name == "style" && (
                <Style {...{ attributes, setAttributes }} />
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

      <AdvertiseCard planLink={pricingURL || 'https://bplugins.com/products/panorama/pricing'} />
    </InspectorControls>
  );
};

export default compose(
  withSelect((select) => {
    return {
      siteUrl: select('core').getSite()?.url,
    };
  })
)(Settings);
