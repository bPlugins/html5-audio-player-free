import React, { useEffect } from "react";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";
import { resolveAudioSrc } from "../../../../../utils/gDriveProxy";

export default ({ attributes, containerRef, playerRef, className }) => {
    const { source: rawSource, controls, preload, repeat, autoplay, muted, seekTime, startTime, disablePause, saveState, i18n, speed, uniqueId } = attributes;
    const source = resolveAudioSrc(rawSource);


    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const defaultControlsList = ['play', 'progress', 'current-time', 'mute', 'volume', 'settings'];
        const rawControlsList = controls && typeof controls === 'object'
            ? Object.keys(controls).filter(key => controls[key])
            : defaultControlsList;

        const hasCritical = rawControlsList.some(k => ['progress', 'current-time', 'mute', 'volume'].includes(k));
        const finalControls = (rawControlsList.length > 0 && hasCritical) ? rawControlsList : defaultControlsList;

        const speedOptions = Array.isArray(speed)
            ? speed.map(Number)
            : (Array.isArray(speed?.speed) ? speed.speed.map(Number) : (window.h5apPlayer?.speed ? window.h5apPlayer.speed.map(Number) : [0.5, 1, 1.5, 2]));

        const config = {
            controls: finalControls,
            loop: { active: repeat },
            autoplay,
            seekTime,
            muted,
            tooltips: {
                controls: true,
                seek: true,
            },
            speed: { selected: 1, options: speedOptions }
        }

        if (i18n) {
            config.i18n = i18n;
        }
        const player = new Plyr(containerRef.current.querySelector('audio'), config);
        player.muted = muted;


        playerRef.current = player;

        new PlyrExtend(player, { disablePause, startTime, saveState, muted })

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

    return <>
        <div ref={containerRef} className={`skin_default ${className}`}>
            <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
            <audio id={uniqueId} className={uniqueId} preload={preload} src={source} controls>
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
    </>
}