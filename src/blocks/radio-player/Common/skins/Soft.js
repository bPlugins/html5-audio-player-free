const Soft = ({ title, sourceType, statusText = 'LIVE' }) => (`
    <div class="skin_container bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div class="flex items-center space-x-2 mb-3">
            ${sourceType === 'stream' ? `<div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="status-text rounded px-2 text-xs font-medium text-blue-700">${statusText}</span>` : ''}
            <span class="title text-xs text-blue-500">${title}</span>
        </div>
        <div class="mb-3">
            <div class="overflow-hidden">
                <p class="text-sm text-blue-800 animate-pulse" data-plyr="current-track"></p>
            </div>
        </div>
        <div class="flex items-center justify-between">
            <button class="w-12 h-12 p-0 plyr___control play-icon rounded-full bg-white border-none text-gray-800 flex items-center justify-center transition-colors duration-200 flex-shrink-0" data-plyr="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play icon--not-pressed">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause icon--pressed"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 icon--loading h5ap-animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
            </button>
            <div class="flex items-center space-x-2">
                <button class="svg-icon cursor-pointer text-gray-500 hover:bg-transparent border-none plyr___control" aria-label="Mute" data-plyr="mute">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume2 icon--not-pressed">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x icon--pressed">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="22" y1="9" x2="16" y2="15"></line>
                        <line x1="16" y1="9" x2="22" y2="15"></line>
                    </svg>
                </button>
                <input type="range" data-plyr="volume" min="0" max="1" step="0.01" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value="1" />
            </div>
        </div>
    </div>
`);

export default Soft;