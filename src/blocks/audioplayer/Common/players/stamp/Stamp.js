import React, { useEffect } from "react";

import skinStamp from "./skinStamp";
import "./stamp.scss";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";
import { resolveAudioSrc } from "../../../../../utils/gDriveProxy";


function Stamp(props) {
    const { attributes, containerRef, className } = props;
    const { source: rawSource, title, repeat, autoplay, muted, seekTime, startTime, disablePause, saveState, preload } = attributes;
    const source = resolveAudioSrc(rawSource);
    const isMuted = Boolean(muted === true || muted === 'true');
    const effectiveMuted = autoplay ? true : isMuted;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const player = new Plyr(containerRef.current.querySelector('audio'), {
            controls: skinStamp(title),
            loop: { active: repeat },
            autoplay,
            muted: effectiveMuted,
            seekTime,
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



        return () => {
            player.destroy()
        }
    }, [attributes])

    return <div className={`skin_stamp ${className}`} ref={containerRef}>
        <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
        <audio preload={preload} src={source} muted={effectiveMuted}></audio>
    </div>
}

export default Stamp;