import React, { useEffect } from "react";

import skin from "./skin";
import "./style.scss";
import PlyrPlaylist from "../../../../../utils/PlyrPlaylist";


function Playlist1(props) {
    const { attributes, containerRef } = props;
    const { audios, multiple_audio } = attributes;
    const { source } = audios[0];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const audioElement = container.querySelector('audio');
        if (!audioElement) return;

        const player = new Plyr(audioElement, {
            controls: skin(audios),
        });

        window.player = player;

        new PlyrPlaylist(player, audios, { multipleAudio: multiple_audio });

        return () => {
            player.destroy();
        };
    }, [attributes]);


    return <div className="skin_playlist1 h5ap_skin " ref={containerRef}>
        <audio src={source}></audio>
    </div>
}

export default Playlist1;