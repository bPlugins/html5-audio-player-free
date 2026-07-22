const { __ } = wp.i18n;
import { TabPanel, Panel, PanelBody, PanelRow, __experimentalUnitControl as UnitControl, TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { useState } from "react";
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { ColorControl, InlineMediaUpload, ItemsPanel } from './../../../../../bpl-tools/Components'
import { ProModal, AdvertiseCard } from './../../../../../bpl-tools/ProControls';
import NewBadge from '../../components/NewBadge/NewBadge.js';
import { produce } from 'immer';

const Settings = (props) => {
  const { attributes, setAttributes, clientId, siteUrl } = props;
  const { width, alignment, lazyLoad } = attributes;
  const { activeIndex, setActiveIndex } = useState(0);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const isPremium = false; // Forced false in the Free project to lock advanced settings
  const pricingURL = siteUrl ? `${siteUrl}/wp-admin/admin.php?page=html5-audio-player-help-demo#/pricing` : 'https://bplugins.com/products/html5-audio-player/pricing';
  const premiumProps = { isPremium, setIsProModalOpen };

  const tabController = () => {
    setTimeout(() => {
      const panelBodies = document.querySelectorAll(".components-panel__body-title button");
      panelBodies.forEach((item) => {
        item.addEventListener("click", clickEveryItem);
      });

      function clickEveryItem() {
        this.removeEventListener("click", clickEveryItem);
        panelBodies.forEach((item) => {
          if (item.getAttribute("aria-expanded") === "true" && !item.isEqualNode(this)) {
            item.click();
          }
        });
        setTimeout(() => {
          this.addEventListener("click", clickEveryItem);
        }, 500);
      }
    }, 500);
  };

  return (
    <InspectorControls style={{ marginBottom: "40px" }}>
      <TabPanel
        className="bPSS bPlTabPanel"
        activeClass="active-tab activeTab"
        onSelect={tabController}
        tabs={[
          {
            name: "content",
            title: "Content",
            className: "content btTab",
          },
          {
            name: "style",
            title: "Style",
            className: "settings btTab",
          },
        ]}
      >
        {(tab) => {
          return (
            <span>
              {tab.name == "content" && (
                <span>
                  <Panel>
                    <PanelBody className="bPlPanelBody" title={__("Tracks", 'html5-audio-player-pro')}>
                      <SelectControl
                        label={
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            {__("Source Type", 'html5-audio-player-pro')}
                            <NewBadge />
                          </span>
                        }
                        help={__("Choose 'Self-Hosted Audio (Default)' for custom audio tracks or 'Podcast RSS Feed (NEW)' to automatically import episodes from an RSS feed.", 'html5-audio-player-pro')}
                        value={attributes.sourceType || 'self-hosted'}
                        options={[
                          { label: __('Self-Hosted Audio (Default)', 'html5-audio-player-pro'), value: 'self-hosted' },
                          { label: __('Podcast RSS Feed (NEW)', 'html5-audio-player-pro'), value: 'podcast' },
                        ]}
                        onChange={(sourceType) => {
                          if (sourceType === 'self-hosted' && (!Array.isArray(attributes.audios) || attributes.audios.length === 0)) {
                            setAttributes({ sourceType, audios: [{ title: 'Audio Title', artist: 'Artist Name', source: '' }] });
                          } else {
                            setAttributes({ sourceType });
                          }
                        }}
                      />

                      {(attributes.sourceType === 'podcast') ? (
                        <>
                          <TextControl
                            className="mt10"
                            label={
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                {__("Podcast RSS Feed URL", 'html5-audio-player-pro')}
                                <NewBadge />
                              </span>
                            }
                            value={attributes.podcastRssUrl || ''}
                            onChange={(podcastRssUrl) => setAttributes({ podcastRssUrl })}
                            placeholder={__("Enter podcast RSS feed URL...", 'html5-audio-player-pro')}
                          />
                          <ToggleControl
                            className="mt10"
                            label={
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                {__("Show Episode Date", 'html5-audio-player-pro')}
                                <NewBadge />
                              </span>
                            }
                            checked={attributes.podcastDate !== false}
                            onChange={(podcastDate) => setAttributes({ podcastDate })}
                          />
                          <ToggleControl
                            className="mt10"
                            label={
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                {__("Show Episode Description", 'html5-audio-player-pro')}
                                <NewBadge />
                              </span>
                            }
                            checked={attributes.podcastDesc !== false}
                            onChange={(podcastDesc) => setAttributes({ podcastDesc })}
                          />

                          <div className="mt15" style={{ fontSize: '12.5px', color: '#b26a00', background: '#fff8e5', padding: '12px 14px', borderRadius: '6px', borderLeft: '4px solid #f59e0b', margin: '15px 0 0', lineHeight: '1.5' }}>
                            <strong>{__('Unlock Podcast Pro Features:', 'html5-audio-player-pro')}</strong>
                            <ul style={{ margin: '8px 0 0 16px', padding: 0, listStyleType: 'disc' }}>
                              <li>{__('Fetch unlimited episodes (Free capped at 5)', 'html5-audio-player-pro')}</li>
                              <li>{__('Enable Episode Search bar', 'html5-audio-player-pro')}</li>
                              <li>{__('Pagination & Load More settings', 'html5-audio-player-pro')}</li>
                              <li>{__('Hide download button control', 'html5-audio-player-pro')}</li>
                            </ul>
                            <p style={{ margin: '10px 0 0' }}>
                              <a href={pricingURL} target="_blank" rel="noreferrer" style={{ color: '#d97706', fontWeight: 'bold', textDecoration: 'none' }}>
                                {__('Upgrade to Pro →', 'html5-audio-player-pro')}
                              </a>
                            </p>
                          </div>
                        </>
                      ) : (
                        <ItemsPanel {...{ attributes, setAttributes, clientId, arrKey: 'audios', newItem: { source: '' }, ItemSettings, itemLabel: 'Item', activeIndex, setActiveIndex, design: 'sortable', }} />
                      )}
                    </PanelBody>
                    <PanelBody title={__("Options", "h5vp")} className='bPlPanelBody'>

                      <SelectControl
                        className='mt10'
                        label={__("Lazy Load", 'html5-audio-player-pro')}
                        help={__("Only load the player and audio resources when it enters the viewport.", "html5-audio-player-pro")}
                        value={lazyLoad}
                        options={[
                          { label: __('Inherit (Global Settings)', 'html5-audio-player-pro'), value: 'default' },
                          { label: __('Enable', 'html5-audio-player-pro'), value: 'on' },
                          { label: __('Disable', 'html5-audio-player-pro'), value: 'off' },
                        ]}
                        onChange={(value) => setAttributes({ lazyLoad: value })}
                      />
                    </PanelBody>
                  </Panel>
                </span>
              )}
              {tab.name == "style" && (
                <span>
                  <Panel>
                    <PanelBody className="bPlPanelBody">
                      <PanelRow>
                        <UnitControl
                          label={__("Width", 'html5-audio-player-pro')}
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
                      <ColorControl
                        label={__("Primary Color", 'html5-audio-player-pro')}
                        onChange={(color) => setAttributes({ primaryColor: color })}
                        value={attributes.primaryColor}
                        defaultColor="rgb(245, 158, 11, var(--tw-bg-opacity, 1))"
                      />
                      <ColorControl
                        label={__("Background Color", 'html5-audio-player-pro')}
                        onChange={(color) => setAttributes({ bgColor: color })}
                        value={attributes.bgColor}
                        defaultColor="rgb(245, 158, 11, var(--tw-bg-opacity, 1))"
                      />
                      <ColorControl
                        label={__("Text Color", 'html5-audio-player-pro')}
                        onChange={(color) => setAttributes({ textColor: color })}
                        value={attributes.textColor}
                        defaultColor="rgb(245, 158, 11, var(--tw-bg-opacity, 1))"
                      />
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
          { title: __('Left', 'html5-audio-player-pro'), align: 'left', icon: 'align-left' },
          { title: __('Center', 'html5-audio-player-pro'), align: 'center', icon: 'align-center' },
          { title: __('Right', 'html5-audio-player-pro'), align: 'right', icon: 'align-right' }
        ]} />
      </BlockControls>
      <AdvertiseCard planLink={pricingURL || 'https://bplugins.com/products/html5-audio-player/pricing'} />
      <ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen}
        link={pricingURL || 'https://bplugins.com/products/html5-audio-player/pricing'}
        title={__('Unlock More with<br/>HTML5 Audio Player Pro!')}
        description={__(`The free or deactivated license of Plugin limits features—upgrade to PRO to unlock podcast RSS feeds, real-time search, and custom pagination.`)}
        features={[
          'Podcast RSS Feed URL import and auto-fetching.',
          'Podcast episode search and real-time filtering.',
          'Load More & Numbered Pagination for podcast episodes.',
          'Custom episode fetch limit and batch count control.',
          'Hide download button and full layout customization.'
        ]}
      />
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


export const ItemSettings = ({ attributes, arrKey, index, setAttributes }) => {
  const currentItem = attributes[arrKey]?.[index] || {};
  const { source = '', poster = '', title = '', artist = '' } = currentItem;

  const handleList = (property, value, index) => {
    const list = Array.isArray(attributes[arrKey]) ? attributes[arrKey] : [];
    const newAudios = produce(list, (draft) => {
      if (draft[index]) {
        draft[index][property] = value;
      }
    });
    setAttributes({ audios: newAudios });
  };

  return <>
    <InlineMediaUpload
      onChange={(audio) => handleList("source", audio, index)}
      value={source}
      types={["audio"]}
      placeholder={__("Audio Source", 'html5-audio-player-pro')}
      label={__("Audio Source", 'html5-audio-player-pro')}
      className="mb-0"
    />

    <label></label>
    <InlineMediaUpload
      onChange={(poster) => handleList("poster", poster, index)}
      value={poster}
      types={["image"]}
      placeholder={__("Thumbnail", 'html5-audio-player-pro')}
      label={__("Thumbnail", 'html5-audio-player-pro')}
    />

    <PanelRow>
      <TextControl label={__("Title", 'html5-audio-player-pro')} placeholder={__("Title", 'html5-audio-player-pro')} value={title} onChange={(title) => handleList("title", title, index)} />
    </PanelRow>
    <PanelRow>
      <TextControl label={__("Artist", 'html5-audio-player-pro')} placeholder={__("Artist", 'html5-audio-player-pro')} value={artist} onChange={(artist) => handleList("artist", artist, index)} />
    </PanelRow>
  </>
}
