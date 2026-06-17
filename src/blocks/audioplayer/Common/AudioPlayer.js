import { useEffect, useRef } from 'react';

import Wave from "./players/wave/Wave";
import Default from "./players/default/Default";
import Fusion from "./players/fusion/Fusion";
import Stamp from "./players/stamp/Stamp";

import Style from "./Style";
import { resolveAudioSrc } from "../../../utils/gDriveProxy";

const AudioPlayer = ({ attributes, id, isBackend = false }) => {
    const containerRef = useRef(null);
    const skins = { Default, Fusion, Stamp, Wave };

    const resolvedAttributes = {
        ...attributes,
        source: resolveAudioSrc(attributes.source),
        preload: (attributes.lazyLoad && !isBackend) ? 'none' : attributes.preload
    };
    const { isSticky, skin, width, multiple_audio} = resolvedAttributes;

    const SkinComponent = skins[skin] || null;

    useEffect(() => {
        if (!multiple_audio) {
            const audios = document.querySelectorAll('audio');
            audios.forEach(item => {
                item.addEventListener('play', () => {
                    audios.forEach(audio => {
                        if (audio !== item) {
                            audio.pause();
                        }
                    })
                })
            })
        }
    }, [])


    const playerRef = useRef(null);

    return SkinComponent ? (
        <>
            <Style attributes={resolvedAttributes} id={id} />
            <SkinComponent attributes={resolvedAttributes} containerRef={containerRef} playerRef={playerRef} className={`h5ap_skin ${isSticky && ["Default", "Fusion", "Stamp", "Wave"].includes(skin) ? `h5ap-sticky${width === '100%' ? ' full-width' : ''}` : ''} `} />
        </>
    ) : (
        <h2>Audio Player</h2>
    );
};

export default AudioPlayer;