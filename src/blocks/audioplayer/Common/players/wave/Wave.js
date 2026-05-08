import React, { useEffect, useRef } from "react";

import "./style.scss";
import skinWave from "./skin";
import handleWave from "./handleWave";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";


function Wave(props) {
    const { attributes, containerRef, className } = props;
    const { source, title, poster, artist, bgColor, primaryColor, controlColor, repeat, autoplay, muted, seekTime, disablePause, startTime, saveState, preload } = attributes;

    const playerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const player = new Plyr(containerRef.current.querySelector('audio'), {
            controls: skinWave(poster, title, artist),
            loop: { active: repeat },
            autoplay,
            muted,
            seekTime,
            storage: { enabled: false },
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

        playerRef.current = player;
        handleWave(containerRef.current, playerRef.current, controlColor, bgColor);

        return () => {
            player.destroy()
        }
    }, [source, title, poster, artist, primaryColor, bgColor]);

    return <div className={`skin_wave ${className}`} id="" ref={containerRef}>
        <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
        <audio preload={preload} src={source}></audio>
    </div>
}

export default Wave;