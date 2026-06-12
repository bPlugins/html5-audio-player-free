import thumb from './../../../../../assets/img/sticky-default.jpg';

const skin = (audios) => {

   return `<div class="plyr-wrapper w-full bg-zinc-900 rounded-2xl shadow-xl p-6">
   <div class="items grid grid-cols-3 gap-4 mb-6">
   ${audios.slice(0, 6).map((audio) => {
      return `<div class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group" data-plyr="playlist-item">
         <img src="${audio.poster || thumb}" alt="Lost in the City Lights" class="w-full h-full object-cover">
         <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="icon--not-pressed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play ">
               <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg fill="currentColor" width="24px" height="24px" class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
         </div>
      </div>`
   }).join('')}
   </div>
   <div class="grid grid-cols-3 gap-4 mb-6" data-plyr="playlist-see-more-items">
   ${audios.slice(5, -1).map((audio) => {
      return `<div class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group" data-plyr="playlist-item">
         <img src="${audio.poster || thumb}" alt="Lost in the City Lights" class="w-full h-full object-cover">
         <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play ">
               <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
           <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
         </div>
      </div>`
   }).join('')}
   </div>
   ${audios.slice(5, -1).length ? `<a class="text-center block no-underline cursor-pointer rotate-180" data-plyr="see-more"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up "><path d="m18 15-6-6-6 6"></path></svg></a>
        ` : ''}
   <div class="text-center mb-6">
      <h2 class="text-xl font-bold mb-1" data-plyr="playlist-title">${audios[0]?.title}</h2>
      <p class="opacity-80" data-plyr="playlist-artist">${audios[0]?.artist}</p>
   </div>
   <div class="mb-4">
      <div class="plyr__progress">
        <input class="h-1 bg-zinc-800 rounded-full cursor-pointer" data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
    </div>
   <div class="flex justify-between text-sm mt-1"><span class="plyr__time--current">0:00</span><span class="plyr__time--duration">0:00</span></div>
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
</div>`

}

export default skin;

