import { useRef } from "react";
import Playlist1 from "./playlist/playlist1/Playlist1";
import Style from "./Style";

const Playlist = ({ attributes, id }) => {
    const { skin } = attributes;
    const skins = { Playlist1 };
    const containerRef = useRef(null);

    const SkinComponent = skins[skin] || null;

    return SkinComponent ? (
        <>
            <Style attributes={attributes} id={id} />
            <SkinComponent attributes={attributes} containerRef={containerRef} />
        </>
    ) : (
        <h2>Audio Playlist</h2>
    );

}


export default Playlist;