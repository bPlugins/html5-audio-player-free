import { useEffect, useRef } from 'react';

import './../tailwind.minimal.scss';

import Style from "./Style";
import CompactHorizontal from './skins/CompactHorizontal';
import GlassMorphism from './skins/GlassMorphism';
import Soft from './skins/Soft';
import DashboardStyle from './skins/DashboardStyle';
import useFetchStreamData from '../hooks/useFetchStreamData';

const RadioPlayer = ({ attributes, id, nonce }) => {
    const containerRef = useRef(null);
    const { streamData, fetchStreamData, isLoading, error } = useFetchStreamData(attributes.source, nonce);
    const { title, subtitle, sourceType, skin, source, options, statusText, multiple_audio } = attributes
    const { autoplay } = options;

    const skins = { GlassMorphism, CompactHorizontal, Soft, DashboardStyle };
    const SkinComponent = skins[attributes.skin] || null;

    const playerRef = useRef(null);


    useEffect(() => {
        if (playerRef.current) {
            const trackTitle = playerRef.current.elements?.container?.querySelector('[data-plyr=current-track]');

            if (trackTitle) {
                trackTitle.innerHTML = streamData?.trackTitle || '';
            }
        }
    }, [streamData, isLoading, error]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const player = new Plyr(containerRef.current.querySelector('audio'), {
            controls: SkinComponent ? SkinComponent({ sourceType, title, subtitle, statusText }) : ['play', 'progress', 'current-time', 'duration', 'mute', 'volume'],
            autoplay,
            tooltips: {
                controls: true,
                seek: true,
            },
        });


        player.on('play', () => {
            fetchStreamData();

            if (!multiple_audio) {
                const audios = document.querySelectorAll('audio');
                audios.forEach(item => {
                    if (!item.isEqualNode(player.elements.container.querySelector('audio'))) {
                        item.pause();
                    }
                })
            }
        })

        playerRef.current = player;

        return () => {
            player.destroy()
        }
    }, [source, options, skin, sourceType, title, subtitle, statusText, multiple_audio]);

    return SkinComponent ? (
        <>
            <Style attributes={attributes} id={id} />
            <div ref={containerRef} className={`radio_skin_${skin.toLowerCase()} radio-wrapper`}>
                <audio id={id} className={id} src={source} controls>
                    Your browser does not support the <code>audio</code> element.
                </audio>
            </div>
        </>
    ) : (
        <h2>Audio Player</h2>
    );
};

export default RadioPlayer;