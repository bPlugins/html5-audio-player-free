const DashboardStyle = ({ title, sourceType, subtitle, statusText }) => (`
    <div class="skin_container rounded-2xl p-6 border border-slate-200 shadow-xl bg-gradient-to-r from-slate-50 to-slate-100">
        <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="col-span-2">
                ${sourceType === 'stream' ? `<div class="flex items-center space-x-2 mb-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span class="status-text rounded px-2 text-xs font-bold text-red-600 uppercase tracking-wider">${statusText}</span>
                </div>` : ''}
                <h3 class="title font-bold text-xl text-slate-900 mb-1">${title}</h3>
                ${subtitle ? `<p class="subtitle text-sm text-slate-600 mb-2">${subtitle}</p>` : ''}
            </div>
            <div class="flex items-center justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio text-blue-500"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg>
            </div>
        </div>

        <div class="bg-white rounded-lg p-4 mb-4 border border-slate-200 secondary-container">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-slate-500 uppercase">Now Playing</span>
                <span class="text-xs text-slate-400" hidden>108.5 FM</span>
            </div>
            <div class="overflow-hidden">
                <p class="text-sm font-medium text-slate-800 animate-pulse" data-plyr="current-track"></p>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <button data-plyr="play"
                    class="plyr__control play-icon w-12 h-12 border-none rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play icon--not-pressed">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon> </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause icon--pressed"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>
                </button>
                <div class="flex flex-col">
                    <div class="flex items-center space-x-2 no-thumb">
                        <button class="leading-none cursor-pointer text-gray-500 hover:bg-transparent border-none" aria-label="Mute" data-plyr="mute">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide lucide-volume2 ">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                        </button>
                        <input type="range" data-plyr="volume" min="0" max="1" step="0.01" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value="1" />
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <Heart class="w-5 h-5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
                <Share2 class="w-5 h-5 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" />
                <Settings class="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
            </div>
        </div>
    </div>
`);

export default DashboardStyle;