const CompactHorizontal = ({ title, sourceType, statusText }) => {

    return `
        <div class="skin_container bg-gray-800 rounded-full px-6 py-3 flex items-center space-x-4 shadow-lg">
            ${sourceType === 'stream' ? `<div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span class="status-text rounded px-2 text-xs font-medium text-red-400">${statusText}</span>
            </div>` : ''}
            <div class="flex-1 min-w-0">
                <div class="overflow-hidden">
                    <p class="title text-sm text-white animate-pulse truncate">${title}</p>
                </div>
            </div>
            <button class="w-12 h-12 p-0 plyr___control play-icon border-none rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 flex-shrink-0" data-plyr="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play icon--not-pressed">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause icon--pressed"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>
            </button>
        </div>
    `
}

export default CompactHorizontal;