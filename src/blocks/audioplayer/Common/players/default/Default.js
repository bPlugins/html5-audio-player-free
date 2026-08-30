import React, { useEffect } from "react";
import CloseStickyIcon from "../../../Components/CloseStickyIcon";
import fadeOut from "../../../../../utils/fadeOut";
import PlyrExtend from "../../../../../utils/PlyrExtend";
import { resolveAudioSrc } from "../../../../../utils/gDriveProxy";

export default ({ attributes, containerRef, playerRef, className }) => {
    const { source: rawSource, controls, preload, repeat, autoplay, muted, seekTime, startTime, disablePause, saveState, i18n, speed, uniqueId } = attributes;
    const source = resolveAudioSrc(rawSource);
    const isMuted = Boolean(muted === true || muted === 'true');
    const effectiveMuted = autoplay ? true : isMuted;


    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const standardOrder = ['restart', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'download'];
        const defaultControlsList = ['play', 'progress', 'current-time', 'mute', 'volume', 'settings'];
        const activeControls = controls && typeof controls === 'object'
            ? Object.keys(controls).filter(key => Boolean(controls[key])).sort((a, b) => {
                const indexA = standardOrder.indexOf(a);
                const indexB = standardOrder.indexOf(b);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                return 0;
            })
            : defaultControlsList;

        const finalControls = activeControls.length > 0 ? activeControls : ['play'];

        const speedOptions = Array.isArray(speed)
            ? speed.map(Number)
            : (Array.isArray(speed?.speed) ? speed.speed.map(Number) : (window.h5apPlayer?.speed ? window.h5apPlayer.speed.map(Number) : [0.5, 1, 1.5, 2]));

        const config = {
            controls: finalControls,
            loop: { active: repeat },
            autoplay,
            seekTime,
            muted: effectiveMuted,
            storage: { enabled: false },
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
        player.muted = effectiveMuted;

        if (playerRef) {
            playerRef.current = player;
        }

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

    return <>
        <div ref={containerRef} className={`skin_default ${className}`}>
            <CloseStickyIcon onClick={() => fadeOut(containerRef.current)} />
            <audio id={uniqueId} className={uniqueId} preload={preload || 'metadata'} src={source} muted={effectiveMuted} controls>
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
    </>
}