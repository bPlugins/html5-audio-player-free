# HTML5 Audio Player — The Ultimate No-Code Podcast, MP3 & Audio Player

![HTML5 Audio Player Banner](https://ps.w.org/html5-audio-player/assets/banner-772x250.png)

[![WordPress Support](https://img.shields.io/badge/WordPress-5.8+-blue.svg?style=flat-square&logo=wordpress)](https://wordpress.org/plugins/html5-audio-player/)
[![PHP Support](https://img.shields.io/badge/PHP-7.1+-777bb4.svg?style=flat-square&logo=php)](./readme.txt)
[![GPLv2 License](https://img.shields.io/badge/License-GPLv2-green.svg?style=flat-square)](./readme.txt)
[![Stable Version](https://img.shields.io/badge/Version-2.6.0-blue.svg?style=flat-square)](./readme.txt)

**HTML5 Audio Player** is a powerful, lightweight, and fully responsive audio player plugin for WordPress. It lets you embed MP3 and OGG audio files into posts, pages, widget areas, or template files using shortcodes or the intuitive Gutenberg block—no coding required!

---

## 🚀 Key Features

### 💎 Core Functionality (Free)
Everything you need to build a professional audio experience on your site:
- **Advanced Player Types:** Choose from Standard or Sticky Player seamlessly.
- **Player Skins:** Access sleek and modern Default, Fusion, Stamp, and Wave skins for free.
- **Embed Anywhere:** Add audio to posts, pages, widgets, and theme templates using native shortcodes.
- **Responsive & Lightweight:** Adapts instantly to all devices and doesn’t slow down your page load times.
- **Customization Options:** Adjust player width, border radius, and add custom poster images effortlessly.
- **Title & Author Support:** Display custom audio titles and author metadata directly on the player.
- **Playback Controls:** Autoplay, Preload, Mute, and Repeat options out-of-the-box.
- **MP3 & OGG Support:** Automatically loads the right format based on the user’s device capabilities.

### 👑 Premium Power (Pro)
Unlock advanced functionality for high-performing podcasts, music sites, and audio courses:
- **The Playlist Player:** Unlock the fully-featured Playlist Player with dynamic Narrow and Extensive list designs.
- **7 Additional Premium Skins:** Access Card 1, Card 2, Simple 1, Simple 2, Player 9, Player 10, and Player 11.
- **Color Customization:** Set custom primary and background colors to perfectly fit your site’s branding.
- **Download Buttons:** Allow users to download your audio files with a single click.
- **Fast Forward & Rewind:** Enhance navigation with customizable seek time settings.
- **Start Time Settings:** Specify exactly when the audio should start playing upon loading.
- **Save State Functionality:** Save the player's time state so it resumes precisely from where the user left off.
- **Premium Sticky Player Features:** Unlock Background Color, Repeat, Save State, Initial Volume, and Download options for Sticky Players.

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
