const { __ } = wp.i18n;
import { TabPanel, Panel, PanelBody, PanelRow, __experimentalUnitControl as UnitControl, TextControl, ToggleControl } from '@wordpress/components';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { useState } from "react";

import { ColorControl, InlineMediaUpload, ItemsPanel } from './../../../../../bpl-tools/Components'
import { produce } from 'immer';

const Settings = (props) => {
  const { attributes, setAttributes, clientId } = props;
  const { width, alignment, lazyLoad } = attributes;
  const { activeIndex, setActiveIndex } = useState(0);



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
                    <PanelBody className="bPlPanelBody" title={__("Tracks", "h5ap")}>
                      <ItemsPanel {...{ attributes, setAttributes, clientId, arrKey: 'audios', newItem: { source: '' }, ItemSettings, itemLabel: 'Item', activeIndex, setActiveIndex, design: 'sortable', }} />
                    </PanelBody>
                    <PanelBody title={__("Options", "h5vp")} className='bPlPanelBody'>
                      <ToggleControl
                        className="mt10"
                        help={__("Only load the player and audio resources when it enters the viewport.", "h5ap")}
                        label={__("Enable Lazy Load", "h5ap")}
                        id="lazyLoad"
                        checked={lazyLoad}
                        onChange={() => setAttributes({ lazyLoad: !lazyLoad })}
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
                      <ColorControl
                        label={__("Primary Color", "h5ap")}
                        onChange={(color) => setAttributes({ primaryColor: color })}
                        value={attributes.primaryColor}
                        defaultColor="rgb(245, 158, 11, var(--tw-bg-opacity, 1))"
                      />
                      <ColorControl
                        label={__("Background Color", "h5ap")}
                        onChange={(color) => setAttributes({ bgColor: color })}
                        value={attributes.bgColor}
                        defaultColor="rgb(245, 158, 11, var(--tw-bg-opacity, 1))"
                      />
                      <ColorControl
                        label={__("Text Color", "h5ap")}
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
          { title: __('Left', 'h5ap'), align: 'left', icon: 'align-left' },
          { title: __('Center', 'h5ap'), align: 'center', icon: 'align-center' },
          { title: __('Right', 'h5ap'), align: 'right', icon: 'align-right' }
        ]} />
      </BlockControls>
    </InspectorControls>
  );
};

export default Settings;


export const ItemSettings = ({ attributes, arrKey, index, setAttributes }) => {
  const { source, poster, title, artist } = attributes[arrKey][index];

  const handleList = (property, value, index) => {
    const newAudios = produce(attributes[arrKey], (draft) => {
      draft[index][property] = value;
    });
    setAttributes({ audios: newAudios });
  };

  return <>
    <InlineMediaUpload
      onChange={(audio) => handleList("source", audio, index)}
      value={source}
      types={["audio"]}
      placeholder={__("Audio Source", "h5ap")}
      label={__("Audio Source", "h5ap")}
      className="mb-0"
    />

    <label></label>
    <InlineMediaUpload
      onChange={(poster) => handleList("poster", poster, index)}
      value={poster}
      types={["image"]}
      placeholder={__("Thumbnail", "h5ap")}
      label={__("Thumbnail", "h5ap")}
    />

    <PanelRow>
      <TextControl label={__("Title", "h5ap")} placeholder={__("Title", "h5ap")} value={title} onChange={(title) => handleList("title", title, index)} />
    </PanelRow>
    <PanelRow>
      <TextControl label={__("Artist", "h5ap")} placeholder={__("Artist", "h5ap")} value={artist} onChange={(artist) => handleList("artist", artist, index)} />
    </PanelRow>
  </>
}
