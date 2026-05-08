const slug = 'html5-audio-player';

export const dashboardInfo = (info) => {
    const { version, isPremium, hasPro } = info;

    const proSuffix = isPremium ? ' Pro' : '';

    return {
        name: `HTML5 Audio Player${proSuffix}`,
        displayName: `HTML5 Audio Player${proSuffix} - The Ultimate No-Code Podcast, MP3 & Audio Player`,
        description:
            "HTML5 Audio Player is a powerful and flexible block plugin that allows you to display posts, display blog posts, and embed custom posts in a fully customizable and responsive layout.",
        slug,
        version,
        isPremium,
        hasPro,
        displayOurPlugins: true,
        media: {
            logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
            banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
            thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
            // proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
            video: 'https://youtu.be/n3B4SpbDS30',
            isYoutube: true
        },
        pages: {
            org: `https://wordpress.org/plugins/${slug}/`,
            landing: `https://bplugins.com/products/${slug}/`,
            docs: `https://bplugins.com/docs/${slug}/`,
            pricing: `https://bplugins.com/products/${slug}/pricing`,
        },
        freemius: {
            product_id: 14260,
            plan_id: 23850,
            public_key: 'pk_ea4da01be073820a5edf59346b675'
        },

        changelogs: [
            {
                version: '2.6.0 - 09 May, 2026',
                type: 'new',
                list: [
                    'New: Users can now turn shuffle on or off from Gutenberg and dashboard settings.',
                    'Update: Massive structural update unlocking several previously PRO features to the Free version (Sticky player, standard skins, poster images, border radius, repeat, and more).',
                    'Update: Cleaned up the free dashboard to neatly present premium-only settings via intuitive notice cards.',
                    'Update: Fully redesigned the Playlist Premium unlock notice block.',
                    'Update: Update brand new Dashboard.',
                    'Fix: Printing Garbage / Raw JSON on the Page.',
                    'Fix: Not Possible to Customise PRO Playlist Skin.',
                    'Fix: Fix the player controls in Gutenberg Block Editor.',
                    'Fix: Fix shuffle mode track mismatch issue.',
                    'Fix: Resolved "Player not loading" issue on public/live WordPress websites caused by a JavaScript compatibility error (ReactDOM is not defined).',
                    'Fix: Applied the fix across all player types — Fusion Player, Standard Player, Playlist (Narrow & Extensive), and Radio Player.',
                    'Improvement: Improved Quick Player Settings with Documentation Link & Search Form Shortcode UI.',
                    'Improvement: Completely revamped the HTML5 Audio Player "Playback Speed" menu with a premium, elegant design and custom scrollbars.'
                ]
            },
            {
                version: '2.5.3 - 15 Dec, 2025',
                type: 'fix',
                list: [
                    'Fix: Undefined array key "postId"'
                ]
            },
            {
                version: '2.5.2 - 15 Dec, 2025',
                type: 'update',
                list: [
                    'Update: Freemius SDK',
                    'New: Added settings to add whitelist domains list to protect against random URL requests in the radio player'
                ]
            }
        ],
        proFeatures: [
            'Advanced Playlist Player',
            '7 Additional Premium Skins',
            'Save State Functionality',
            'Single Button Player',
            'Premium Sticky Player Features',
            'Color Customization',
            'Fast Forward & Rewind Buttons',
            'Download & Playback Controls',
            'Start Time & Disable Pause',
            'Ad-Free Experience',
        ],
        startButton: {
            label: 'Start Now',
            url: 'wp-admin/post-new.php?post_type=radioplayer'
        }
    }
}

export const demoInfo = {
    allInOneLabel: 'See All Demos',
    allInOneLink: 'https://audioplayerwp.com/all-demos-in-one-place/',
    demos: [
        {
            "title": "Default Player",
            "description": "Clean player with basic controls.",
            "url": "https://audioplayerwp.com/demo/deme-1-default/",
            "icon": <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 512 512"
            >
                <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
            </svg>,
            "type": 'iframe'
        },
        {
            "title": "Muted & Autoplay",
            "description": "Starts muted and plays automatically.",
            "url": "https://audioplayerwp.com/demo/demo-2-muted-and-autoplay/",
            "icon": (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 576 512">
                    <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
                </svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Custom Size",
            "description": "Resize player to fit your layout.",
            "url": "https://audioplayerwp.com/demo/demo-3-custom-size/",
            "icon": (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 512 512">
                    <path d="M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
                </svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "All Controls",
            "description": "Shows every available control option.",
            "url": "https://audioplayerwp.com/demo/demo-4-enable-all-controls/",
            "icon": (
                <svg width={15} height={15} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"></path></svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Seek & Preload",
            "description": "Skip 2s and set preload behavior.",
            "url": "https://audioplayerwp.com/demo/demo-5-seek-time-2s-and-preload-none/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Repeat Mode",
            "description": "Loop tracks endlessly when enabled.",
            "url": "https://audioplayerwp.com/demo/demo-6-enable-repeat/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="repeat"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"></path></svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Fusion Skin",
            "description": "Sleek modern Fusion skin design.",
            "url": "https://audioplayerwp.com/demo/demo-7-fusion-skin/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Poster & Radius",
            "description": "Poster image with rounded corners in Fusion skin.",
            "url": "https://audioplayerwp.com/demo/demo-8-poster-and-border-radius-in-fusion-skin/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg>
            ),
            "type": 'iframe'
        },
        {
            "title": "Stamp Skin",
            "description": "Creative stamp-style player skin.",
            "url": "https://audioplayerwp.com/demo/demo-9-stamp-skin/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="cassette-fill"><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h.191l1.862-3.724A.5.5 0 0 1 4 10h8a.5.5 0 0 1 .447.276L14.31 14h.191a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zM4 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2M6 6a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1"></path><path d="m13.191 14-1.5-3H4.309l-1.5 3z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "title": "Playlist Autoplay",
            "description": "Autoplay-enabled playlist player.",
            "url": "https://audioplayerwp.com/demo/demo-10-playlist-player-autoplay/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "title": "Playlist Extended",
            "description": "Large playlist with extra controls.",
            "url": "https://audioplayerwp.com/demo/demo-11-playlist-player-extensive-skin-and-custom-size/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="layout-text-sidebar"><path d="M3.5 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM3 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"></path><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm12-1v14h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 0H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "title": "Light Theme",
            "description": "Minimal and clean light playlist.",
            "url": "https://audioplayerwp.com/demo/demo-12-playlist-player-light-theme/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="brightness-high"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "title": "Sticky Player",
            "description": "Player stays fixed while scrolling.",
            "url": "https://audioplayerwp.com/demo/demo-13-sticky-player/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "title": "Single Button",
            "description": "Simple one-button audio player.",
            "url": "https://audioplayerwp.com/demo/demo-14-single-play-button/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/audio-player-section-design-1/",
            "title": "Audio Player Section 1",
            "description": "Section-style player layout",
            "icon": (<svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="card-heading"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path><path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"></path></svg>),
            "type": "iframe",
        },
        {
            "url": "https://audioplayerwp.com/demo/card-player-design-2/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="card-heading"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path><path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"></path></svg>
            ),
            "description": "Audio player with card wrapper",
            "title": "Card Player Design 2",
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/simple-player-design-1/",
            "title": "Simple Player Design 1",
            "description": "Minimalist simple player",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/simple-player-design-2/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"></path></svg>
            ),
            "description": "Clean basic player layout",
            "title": "Simple Player Design 2",
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/styled-player-1/",
            "title": "Styled Player 1",
            "description": "Styled player with decoration",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="music-player-fill"><path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm1 2h6a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m3 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6"></path></svg>
            ),
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/styled-player-2/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="music-player-fill"><path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm1 2h6a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m3 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6"></path></svg>
            ),
            "title": "Styled Player 2",
            "description": "Decorated styled variant",
            "type": "iframe"
        },
        {
            "url": "https://audioplayerwp.com/demo/styled-player-3/",
            "icon": (
                <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="music-player-fill"><path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm1 2h6a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m3 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6"></path></svg>
            ),
            "title": "Styled Player 3",
            "description": "Third styled design with flair",
            "type": "iframe"
        }
    ]
}

export const pricingInfo = {
    logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`, // Optional
    pluginId: 14260,
    planId: 23850,
    licenses: [
        1,
        3,
        null
    ],
    button: {
        label: 'Buy Now ➜'
    },
    featured: {
        selected: 3, // choose from licenses item
    }
}