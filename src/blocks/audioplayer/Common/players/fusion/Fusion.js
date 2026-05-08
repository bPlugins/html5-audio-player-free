import React, { useEffect } from "react";

import skinFusion from "./skinFusion";
import "./fusion.scss";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";


function Fusion(props) {
    const { attributes, containerRef, className } = props;
    const { source, title, poster, download, repeat, autoplay, muted, seekTime, disablePause, startTime, saveState, preload, options = {} } = attributes;
    const { volume } = options;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const player = new Plyr(containerRef.current.querySelector('audio'), {
            controls: skinFusion(poster, title, source, { download, repeat: true }),
            loop: { active: repeat },
            autoplay,
            muted,
            seekTime,
            volume: parseFloat(volume),
        })


        new PlyrExtend(player, { disablePause, startTime, saveState, muted });

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
            player.volume = parseFloat(volume);
        });

        return () => {
            player.destroy()
        }
    }, [attributes])

    return <div className={`skin_fusion ${className}`} ref={containerRef}>
        <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
        <audio preload={preload} src={source}></audio>
    </div>
}

export default Fusion;