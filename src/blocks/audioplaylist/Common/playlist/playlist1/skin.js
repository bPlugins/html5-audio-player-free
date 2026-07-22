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

    return `<div class="plyr-wrapper w-full">
    <div class="h5ap-scrollable-playlist ${hasMany ? 'has-many-items' : ''}" style="min-height: 180px;">
       <div class="items grid grid-cols-3 gap-4">
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
                   <button type="button" class="h5ap-show-more-btn" data-h5ap-expand="0" style="background:none;border:none;color:var(--plyr-color-main, #f59e0b);padding:0;font-size:11.5px;cursor:pointer;margin-top:6px;margin-bottom:6px;font-weight:600;display:inline-block;outline:none;">
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
    <div class="flex justify-between text-sm mt-1">
        <span class="plyr__time--current">0:00</span>
        <div class="flex items-center gap-2">
            <span class="plyr__time--duration">0:00</span>
            ${!customOptions?.hide_download && audios[0]?.source ? `
                <a class="plyr__control p-1 text-white opacity-80 hover:opacity-100" target="_blank" download href="${audios[0].source}" title="Download Track">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
            ` : ''}
        </div>
    </div>
    </div>
    <div class="flex items-center justify-center gap-6">
       <button class="plyr__control p-2 hover:text-white" data-plyr="prev">
          <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
       </button>
       <button class="plyr__control p-4 bg-amber-500 rounded-full hover:bg-amber-400 leading-0" data-plyr="play">
          <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
          <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
          <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
          <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
       </button>
       <button class="plyr__control p-2 hover:text-white" data-plyr="next">
          <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>
       </button>
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
