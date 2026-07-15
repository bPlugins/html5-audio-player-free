const GlassMorphism = ({ title, sourceType, statusText = 'LIVE' }) => {

  return `<div class="skin_container relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              ${sourceType === 'stream' ? `<div class="relative">
                <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div class="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span class="status-text rounded px-2 text-sm font-medium text-gray-700 ">${statusText}</span>` : ``}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio w-5 h-5 text-blue-500"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg>
          </div>
          <div class="mb-4">
            <h3 class="title font-bold text-lg text-gray-800 mb-1">${title}</h3>
            <div class="overflow-hidden" >
              <p class="text-sm text-gray-600 animate-pulse" data-plyr="current-track"></p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <button class="w-12 h-12 p-0 plyr___control play-icon rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/40 transition-all duration-300 hover:scale-105" data-plyr="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play icon--not-pressed">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause icon--pressed"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 icon--loading h5ap-animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
            </button>
            <div class="flex items-center gap-2">
                <button class="leading-none cursor-pointer text-gray-500 hover:bg-transparent border-none plyr___control" aria-label="Mute" data-plyr="mute">
                <svg class="svg-icon icon--not-pressed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
                <svg class="svg-icon icon--pressed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="22" y1="9" x2="16" y2="15"></line>
                    <line x1="16" y1="9" x2="22" y2="15"></line>
                </svg>
                </button>
                <input type="range" data-plyr="volume" min="0" max="1" step="0.01" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value="1">
            </div>
          </div>
        </div>
      </div>`
}

export default GlassMorphism;