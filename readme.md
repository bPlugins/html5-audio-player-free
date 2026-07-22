# HTML5 Audio Player — The Ultimate No-Code Podcast, MP3 & Audio Player

![HTML5 Audio Player Banner](https://ps.w.org/html5-audio-player/assets/banner-772x250.png)

[![WordPress Support](https://img.shields.io/badge/WordPress-5.8+-blue.svg?style=flat-square&logo=wordpress)](https://wordpress.org/plugins/html5-audio-player/)
[![PHP Support](https://img.shields.io/badge/PHP-7.1+-777bb4.svg?style=flat-square&logo=php)](./readme.txt)
[![GPLv2 License](https://img.shields.io/badge/License-GPLv2-green.svg?style=flat-square)](./readme.txt)
[![Stable Version](https://img.shields.io/badge/Version-2.8.0-blue.svg?style=flat-square)](./readme.txt)

**HTML5 Audio Player** is a powerful, lightweight, and fully responsive audio player plugin for WordPress. It lets you embed MP3 and OGG audio files into posts, pages, widget areas, or template files using shortcodes or the intuitive Gutenberg block—no coding required!

---

## 🚀 Key Features

### 💎 Core Functionality (Free)
Everything you need to build a professional audio experience on your site:
- **Advanced Player Layouts**: Includes Standard Player, Sticky Player (fixed bottom/top), and the newly unlocked Audio Playlist Player.
- **Podcast RSS Feed Import**: Easily import podcast channels and playlists from any RSS feed URL (capped at the latest 5 episodes).
- **Modern Player Skins**: Access clean and responsive skins including Default, Fusion, Stamp, and Wave.
- **Google Drive & SoundCloud Support**: Play shared files directly from Google Drive or stream tracks via SoundCloud URLs using our built-in bypass proxy.
- **Lossless & Standard Formats**: Seamless playback of MP3, OGG, and FLAC audio files with native WordPress Media Library upload support.
- **Gutenberg & Widget Ready**: Embed players instantly using the custom Gutenberg block or versatile shortcodes on posts, pages, and sidebar widgets.
- **Autoplay & Browser Policy Handling**: Smart fallback rules to start streams muted if modern browsers block autoplay audio playback.
- **Live Streaming Support**: Stream live audio broadcasts seamlessly using HLS (m3u8) protocol integrations.
- **Interactive Status Indicators**: Instant visual state updates including "Connecting...", "Buffering...", and "Offline" status notifications.
- **Custom Styling & Metadata**: Easily customize player width, border radius, poster thumbnails, audio titles, and artist details.
- **Cross-Browser & Responsive**: Fully responsive layout optimized for all modern browsers, smartphones, tablets, and iOS/Android devices.

### 👑 Premium Power (Pro)
Unlock advanced functionality for high-performing podcasts, music sites, and audio courses:
- **Unlimited Podcast Feeds**: Fetch unlimited podcast episodes with no caps, custom fetch limits, and episode batch settings.
- **Podcast Episode Search & Filter**: Real-time frontend keyword search to filter and find specific episodes inside playlist layers.
- **Numbered & Load More Pagination**: Configure batch sizes with standard numbered pagination (1, 2, 3...) or Load More buttons.
- **Static Waveform Visualizer**: SoundCloud-style static waveform visualizer using the wavesurfer library inside the Wave skin.
- **Advanced Playlist Skins**: Access premium Narrow and Extensive playlist layouts with collapsible track descriptions.
- **7 Premium Player Skins**: Unlock Card 1, Card 2, Simple 1, Simple 2, Player 9, Player 10, and Player 11.
- **Multiple Radio Stations (Playlists)**: Unified player interface allowing users to switch between multiple radio stations or channels.
- **Recently Played Track History**: Display live song timelines and titles fetched dynamically from Icecast/Shoutcast metadata.
- **Backup/Fallback Stream URL**: Automatic failover switching to secondary audio streams if the primary server goes offline.
- **Full Color Customization**: Set custom primary, background, hover, active, and alternating track colors to match your brand.
- **Download Button**: Enable or disable direct download options for tracks and episodes.
- **Advanced Navigation & Seeking**: Add custom forward/rewind skip intervals, start/end time offsets, and disable pause locks.
- **State Saving**: Remember the user's playback timeline and resume tracks from where they last left off.
- **Single Button Player**: A clean, single-action play button suitable for inline audio samples.
- **Ad-Free Experience & Premium Support**: Dedicated support channel with priority bug fixes and updates.

---

## 📸 Visual Showcase

### Interactive Gutenberg Block
Easily insert audio players using the native Gutenberg block editor. Configure controls, toggle visibility, and preview your player instantly in the backend.

### Universal Compatibility
Works smoothly on Chrome, Firefox, Safari, Edge, IE7–IE9, and fully supports modern iOS and Android mobile devices.

### Dynamic Sticky Player
Keep your audio accessible no matter where the user scrolls. The Sticky Player docks beautifully at the bottom of the screen, providing continuous playback across pages.

---

## 🛠 Technical Stack

This project is built with modern web technologies to ensure flawless performance and flexibility:

- **Frontend Framework:** [React](https://reactjs.org/) (Powers the intuitive Gutenberg Editor blocks and dynamic admin dashboard).
- **Core Audio Engine:** [Plyr.io](https://plyr.io/) for a simple, accessible, and customizable HTML5 media player experience.
- **Build System:** `@wordpress/scripts` (Webpack) for block bundling and seamless compilation.
- **Styling:** Modular SASS/SCSS and Tailwind CSS utility classes for consistent, conflict-free UI.
- **Backend:** PHP with custom WordPress REST API extensions for seamless data handling.
- **Licensing & Analytics:** Custom **BPlugins SDK** (based on Freemius Lite) calling through `api.bplugins.com`.

---

## 📚 Third-Party Libraries

HTML5 Audio Player utilizes the following high-quality libraries to deliver a premium experience:

- **[Plyr](https://github.com/sampotts/plyr)** (MIT): The core accessible HTML5 media player engine.
- **[React](https://reactjs.org/)** (MIT): For interactive Gutenberg components and settings dashboards.
- **[Freemius Lite SDK (Custom)](https://bplugins.com)**: A modified version of the Freemius SDK optimized for the bPlugins API to handle usage tracking and analytics.

---

## 💻 Developer Guide

### Directory Structure
- **`/src`**: Main source code (React, SCSS, Block Metadata).
	- **`/blocks`**: React components for the Gutenberg Audio and Radio Player blocks.
	- **`/dashboard`**: Code for the plugin's React-powered admin dashboard UI.
	- **`/js`**: Legacy vanilla JS logic for the frontend shortcode rendering (`single.js`).
- **`/inc`**: PHP logic, including field configurations, options frameworks, and shortcode handlers.
- **`/build`**: Compiled assets (automatically generated via Webpack; do not edit manually).
- **`html5-audio-player.php`**: The main WordPress plugin executable file.

### Development Workflow
1. **Clone the repository** into your local WordPress `plugins` directory.
2. **Clone [bpl-tools](https://github.com/bPlugins/bpl-tools)** into the same `plugins` directory (required for shared components and dashboard logic).
3. **Install dependencies**:
	```bash
	npm install
	```
4. **Start development watch mode**:
	```bash
	npm start
	```
4. **Create a production build**:
	```bash
	npm run build
	```

### Data Flow & Lifecycle
1. **Editor:** The Gutenberg block (`src/blocks/audioplayer/edit.js`) manages block attributes.
2. **Database:** Attributes are saved as JSON within the `<!-- wp:h5ap/audioplayer ... -->` comment.
3. **Frontend (PHP):** `render.php` reads attributes and generates initial HTML + Data Attributes.
4. **Frontend (JS):** `view.js` detects the block, reads `data-attributes`, and mounts the React components to initialize Plyr and provide interactivity.

---

## 🔌 Developer API

### Shortcode Support
Embed any player configuration quickly using the generated ID:
```
[h5ap_audio id="123"]
```
For Radio Player:
```
[h5ap_radio_player id="1740"]
```

---

## 🔗 Useful Links
- [Live Demo](https://bplugins.com/products/html5-audio-player/#demos)
- [Support Forum](https://wordpress.org/support/plugin/html5-audio-player/)
- [Upgrade to Pro](https://bplugins.com/products/html5-audio-player/pricing)

---
*Developed by [bPlugins](https://bplugins.com)*
