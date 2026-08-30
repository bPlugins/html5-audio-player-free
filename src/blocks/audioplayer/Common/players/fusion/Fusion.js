import React, { useEffect } from "react";

import skinFusion from "./skinFusion";
import "./fusion.scss";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";
import { resolveAudioSrc } from "../../../../../utils/gDriveProxy";


function Fusion(props) {
    const { attributes, containerRef, className } = props;
    const { source: rawSource, title, poster, download, repeat, autoplay, muted, seekTime, disablePause, startTime, saveState, preload, options = {} } = attributes;
    const { volume } = options;
    const source = resolveAudioSrc(rawSource);
    const isMuted = Boolean(muted === true || muted === 'true');
    const effectiveMuted = autoplay ? true : isMuted;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const safeVolume = isNaN(parseFloat(volume)) ? 0.5 : parseFloat(volume);
        const player = new Plyr(containerRef.current.querySelector('audio'), {
            controls: skinFusion(poster, title, source, { download, repeat: true }),
            loop: { active: repeat },
            autoplay,
            muted: effectiveMuted,
            seekTime,
            volume: safeVolume,
            storage: { enabled: false },
        })

        player.muted = effectiveMuted;

        new PlyrExtend(player, { source, disablePause, startTime, saveState, muted: effectiveMuted });

        if (autoplay) {
            try {
                const playPromise = player.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(e => console.log('Autoplay blocked by browser in editor preview:', e));
                }
            } catch (e) {
                console.log('Autoplay failed:', e);
            }
        }

        player.on('ready', () => {
            const safeVolume = isNaN(parseFloat(volume)) ? 0.5 : parseFloat(volume);
            player.volume = safeVolume;
            player.muted = effectiveMuted;
        });

        return () => {
            player.destroy()
        }
    }, [attributes])

    return <div className={`skin_fusion ${className}`} ref={containerRef}>
        <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
        <audio preload={preload} src={source} muted={effectiveMuted}></audio>
    </div>
}

export default Fusion;