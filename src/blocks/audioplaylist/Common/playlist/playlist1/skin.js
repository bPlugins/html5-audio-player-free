import thumb from './../../../../../assets/img/sticky-default.jpg';

const renderPaginationPages = (current, total, disabled = false) => {
    let pages = [];
    if (total <= 5) {
        pages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
        if (current <= 3) {
            pages = [1, 2, 3, '...', total];
        } else if (current >= total - 2) {
            pages = [1, '...', total - 2, total - 1, total];
        } else {
            pages = [1, '...', current, '...', total];
        }
    }
    return pages.map(p => {
        if (p === '...') return `<span class="h5ap-pagination-ellipsis">&hellip;</span>`;
        return `<button type="button" class="h5ap-pagination-num ${p === current ? 'is-active' : ''}" data-h5ap-page="${p}" ${disabled ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>${p}</button>`;
    }).join('');
};

const skin = (audios = [], customOptions = {}) => {
    const isPodcast = customOptions?.sourceType === 'podcast';
    const isSearch = isPodcast && customOptions?.podcastSearch === true;
    const isLoadMore = isPodcast && customOptions?.podcastLoadMore === true;
    const paginationType = customOptions?.paginationType || 'load_more';
    const totalTracks = customOptions?.totalTracks || audios.length;
    const currentPage = customOptions?.currentPage || 1;
    const totalPages = customOptions?.totalPages || 1;
    const visibleCount = customOptions?.visibleCount || audios.length;
    const searchQuery = customOptions?.searchQuery || '';
    const isLoading = customOptions?.isLoading === true;
    const hasMany = audios?.length > 6;

    const isSkipEnabled = customOptions?.episodeSkip === true;
    const skipTime = customOptions?.skipTime || 15;
    const isSpeedEnabled = customOptions?.enableSpeed === true;

    return `<div class="plyr-wrapper w-full box-border overflow-hidden">
    <div class="h5ap-scrollable-playlist ${hasMany ? 'has-many-items' : ''}" style="min-height: 180px; overflow-x: hidden; box-sizing: border-box;">
       <div class="items grid grid-cols-3 gap-3 w-full box-border">
       ${audios.length === 0 ? `
           <div class="col-span-3 text-center py-10 opacity-60 text-xs" style="grid-column: 1 / -1; padding: 40px 0;">
               ${isLoading ? 'Loading episodes...' : (searchQuery ? `No episodes found matching "${searchQuery}"` : 'No episodes found')}
           </div>
       ` : audios.map((audio, index) => {
        return `<div class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group" data-plyr="playlist-item" data-index="${index}">
              <img src="${audio.poster || thumb}" alt="${audio.title || ''}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg class="icon--not-pressed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play ">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                 </svg>
                 <svg fill="currentColor" width="24px" height="24px" class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
              </div>
           </div>`
    }).join('')}
       </div>
    </div>
    <div class="text-center mt-5 mb-4">
       <h2 class="text-xl font-bold mb-1" data-plyr="playlist-title">${audios[0]?.title || ''}</h2>
       <p class="opacity-80" data-plyr="playlist-artist">${audios[0]?.artist || ''}</p>
       ${isPodcast && customOptions?.podcastDate !== false && audios[0]?.date ? `<span class="podcast-date" style="display:block;font-size:12px;opacity:0.6;margin-top:2px;">${audios[0].date}</span>` : ''}
       ${isPodcast && customOptions?.podcastDesc !== false && audios[0]?.description ? `
           <div class="podcast-desc" style="margin-top:6px;margin-bottom:14px;max-width:90%;margin-left:auto;margin-right:auto;">
               <p class="podcast-desc-text" style="display:${customOptions?.expandedItems?.[0] ? 'block' : '-webkit-box'};-webkit-line-clamp:${customOptions?.expandedItems?.[0] ? 'none' : 2};-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;font-size:12px;opacity:0.75;line-height:1.4;margin:0;">
                   ${audios[0].description}
               </p>
               ${audios[0].description.length > 100 ? `
                   <button type="button" class="h5ap-show-more-btn" data-h5ap-expand="0" style="background:none;border:none;color:inherit;padding:0;font-size:11.5px;cursor:pointer;margin-top:6px;margin-bottom:6px;font-weight:600;display:inline-block;outline:none;">
                       ${customOptions?.expandedItems?.[0] ? 'Show Less' : 'Show More'}
                   </button>
               ` : ''}
           </div>
       ` : ''}
    </div>
    <div class="mb-4 mt-5">
       <div class="plyr__progress">
         <input class="h-1 bg-zinc-800 rounded-full cursor-pointer" data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
         <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
         <span role="tooltip" class="plyr__tooltip">00:00</span>
     </div>
    <div class="flex justify-between text-sm items-center" style="margin-top: 8px; margin-left: 0; margin-right: 0; padding: 0 2px;">
        <span class="plyr__time--current" style="margin: 0 !important; padding: 0 !important;">0:00</span>
        <div class="flex items-center gap-2" style="line-height: 1; margin: 0 !important; padding: 0 !important;">
            <span class="plyr__time--duration" style="margin: 0 !important; padding: 0 !important;">0:00</span>
            ${!customOptions?.hide_download && audios[0]?.source ? `
                <a class="p-1 text-white opacity-80 hover:opacity-100 flex items-center justify-center" target="_blank" download href="${audios[0].source}" title="Download Track" style="margin: 0 !important; padding: 0 !important; line-height: 1; display: inline-flex;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: block; margin: 0 !important;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
            ` : ''}
        </div>
    </div>
    </div>
    <div class="flex items-center justify-center gap-4 flex-wrap">
       ${customOptions?.shuffle ? `
       <button class="plyr__control p-2 hover:text-white active" data-plyr="shuffle" title="Shuffle" aria-label="Shuffle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polyline points="16 3 21 3 21 8"></polyline>
             <line x1="4" y1="20" x2="21" y2="3"></line>
             <polyline points="21 16 21 21 16 21"></polyline>
             <line x1="15" y1="15" x2="21" y2="21"></line>
             <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
       </button>
       ` : ''}
       <button class="plyr__control p-2 hover:text-white" data-plyr="prev" title="Previous Track" aria-label="Previous Track">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
             <polygon points="19 20 9 12 19 4 19 20"></polygon>
             <line x1="5" y1="19" x2="5" y2="5" stroke-width="2.5"></line>
          </svg>
       </button>
       ${isSkipEnabled ? `
       <button type="button" class="plyr__control p-2 hover:text-white" data-plyr="rewind" title="Rewind ${skipTime}s" aria-label="Rewind ${skipTime}s">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polygon points="11 19 2 12 11 5 11 19"></polygon>
             <polygon points="22 19 13 12 22 5 22 19"></polygon>
          </svg>
          <span class="plyr__tooltip" role="tooltip">Rewind ${skipTime}s</span>
       </button>
       ` : ''}
       <button class="plyr__control p-4 bg-amber-500 rounded-full hover:bg-amber-400 leading-0" data-plyr="play">
          <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
          <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
          <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
          <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
       </button>
       ${isSkipEnabled ? `
       <button type="button" class="plyr__control p-2 hover:text-white" data-plyr="fast-forward" title="Forward ${skipTime}s" aria-label="Forward ${skipTime}s">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polygon points="13 19 22 12 13 5 13 19"></polygon>
             <polygon points="2 19 11 12 2 5 2 19"></polygon>
          </svg>
          <span class="plyr__tooltip" role="tooltip">Forward ${skipTime}s</span>
       </button>
       ` : ''}
       <button class="plyr__control p-2 hover:text-white" data-plyr="next" title="Next Track" aria-label="Next Track">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
             <polygon points="5 4 15 12 5 20 5 4"></polygon>
             <line x1="19" y1="5" x2="19" y2="19" stroke-width="2.5"></line>
          </svg>
       </button>
       ${isSpeedEnabled ? `
       <div class="h5ap-speed-wrapper inline-flex items-center relative select-none" data-plyr="speed-wrapper">
           <button type="button" class="plyr__control h5ap-speed-btn" data-plyr="speed-btn" aria-label="Playback Speed" title="Playback Speed">
               <span class="h5ap-speed-label">1×</span>
           </button>
           <div class="h5ap-speed-dropdown">
               <div class="h5ap-speed-heading">Speed</div>
               <button type="button" class="h5ap-speed-opt" data-speed="0.5">0.5×</button>
               <button type="button" class="h5ap-speed-opt" data-speed="0.75">0.75×</button>
               <button type="button" class="h5ap-speed-opt is-active" data-speed="1">1×</button>
               <button type="button" class="h5ap-speed-opt" data-speed="1.25">1.25×</button>
               <button type="button" class="h5ap-speed-opt" data-speed="1.5">1.5×</button>
               <button type="button" class="h5ap-speed-opt" data-speed="1.75">1.75×</button>
               <button type="button" class="h5ap-speed-opt" data-speed="2">2×</button>
           </div>
       </div>
       ` : ''}
    </div>

    ${isLoadMore && !searchQuery ? `
        <div class="h5ap-pagination-wrap mt-6 text-center">
            ${paginationType === 'load_more' ? `
                <button type="button" class="h5ap-load-more-btn ${visibleCount >= totalTracks ? 'is-all-loaded' : ''}" data-h5ap-action="load_more" ${visibleCount >= totalTracks ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>
                    ${totalTracks === 0 ? 'No Episodes Available' : (visibleCount >= totalTracks ? 'All Episodes Loaded' : 'Load More Episodes')}
                </button>
            ` : ''}

            ${paginationType === 'pagination' && totalPages >= 1 ? `
                <div class="h5ap-pagination-container">
                    <button type="button" class="h5ap-pagination-btn h5ap-pagination-prev" data-h5ap-action="prev" ${currentPage === 1 || totalTracks === 0 ? 'disabled' : ''}>
                        &laquo;
                    </button>
                    <div class="h5ap-pagination-pages">
                        ${renderPaginationPages(currentPage, totalPages, totalTracks === 0)}
                    </div>
                    <button type="button" class="h5ap-pagination-btn h5ap-pagination-next" data-h5ap-action="next" ${currentPage === totalPages || totalTracks === 0 ? 'disabled' : ''}>
                        &raquo;
                    </button>
                </div>
            ` : ''}
        </div>
    ` : ''}
 </div>`

}

export default skin;
