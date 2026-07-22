import React, { useEffect, useState } from "react";

import skin from "./skin";
import "./style.scss";
import "../../../style.scss";
import PlyrPlaylist from "../../../../../utils/PlyrPlaylist";


function Playlist1(props) {
    const { attributes, containerRef } = props;
    const { audios = [], multiple_audio, hideDownload } = attributes;

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState({});

    const perPage = attributes.podcastPerPage && attributes.podcastPerPage > 0 ? attributes.podcastPerPage : 5;
    const [visibleCount, setVisibleCount] = useState(perPage);
    const [currentPage, setCurrentPage] = useState(1);

    const isPodcast = attributes.sourceType === 'podcast';
    const isLoadMoreEnabled = isPodcast && attributes.podcastLoadMore === true;
    const paginationType = attributes.podcastPaginationType || 'load_more';

    let filteredAudios = audios;
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredAudios = audios.filter(item =>
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.artist && item.artist.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
    }

    let itemsToDisplay = filteredAudios;
    let totalPages = 1;

    if (isLoadMoreEnabled && !searchQuery.trim()) {
        if (paginationType === 'pagination') {
            totalPages = Math.ceil(audios.length / perPage) || 1;
            const startIndex = (currentPage - 1) * perPage;
            itemsToDisplay = audios.slice(startIndex, startIndex + perPage);
        } else {
            itemsToDisplay = audios.slice(0, visibleCount);
        }
    } else if (!searchQuery.trim() && audios.length > 50) {
        itemsToDisplay = audios.slice(0, 50);
    }

    const firstSource = itemsToDisplay[0]?.source || '';

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const audioElement = container.querySelector('audio');
        if (!audioElement) return;

        const player = new Plyr(audioElement, {
            controls: skin(itemsToDisplay, {
                hide_download: hideDownload,
                sourceType: attributes.sourceType,
                podcastDate: attributes.podcastDate,
                podcastDesc: attributes.podcastDesc,
                podcastSearch: attributes.podcastSearch,
                podcastLoadMore: attributes.podcastLoadMore,
                paginationType,
                totalTracks: filteredAudios.length,
                currentPage,
                totalPages,
                visibleCount,
                searchQuery,
                expandedItems,
                isLoading: attributes._podcastLoading === true
            }),
        });

        window.player = player;

        new PlyrPlaylist(player, itemsToDisplay, { multipleAudio: multiple_audio });

        const loadMoreBtn = container.querySelector('[data-h5ap-action="load_more"]');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                setVisibleCount(prev => prev + perPage);
            });
        }

        const prevBtn = container.querySelector('[data-h5ap-action="prev"]');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                setCurrentPage(prev => Math.max(1, prev - 1));
            });
        }

        const nextBtn = container.querySelector('[data-h5ap-action="next"]');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
            });
        }

        const pageBtns = container.querySelectorAll('[data-h5ap-page]');
        pageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const pageNum = parseInt(btn.getAttribute('data-h5ap-page'));
                if (pageNum) setCurrentPage(pageNum);
            });
        });

        const expandBtns = container.querySelectorAll('[data-h5ap-expand]');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-h5ap-expand'));
                setExpandedItems(prev => ({
                    ...prev,
                    [idx]: !prev[idx]
                }));
            });
        });

        return () => {
            try {
                player?.destroy();
            } catch (e) {
                // Suppress DOM unmount warning
            }
        };
    }, [audios, hideDownload, currentPage, visibleCount, isLoadMoreEnabled, paginationType, perPage, searchQuery, attributes.podcastSearch, attributes.podcastLoadMore, attributes.podcastDate, attributes.podcastDesc, expandedItems]);

    return (
        <div className="skin_playlist1 h5ap_skin w-full rounded-2xl shadow-xl p-6" ref={containerRef}>
            {isPodcast && attributes.podcastSearch && (
                <div className="h5ap-podcast-search-wrap mb-4" style={{ position: 'relative', width: '100%', marginBottom: '18px' }}>
                    <svg className="h5ap-search-icon" viewBox="0 0 24 24" width="16" height="16" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', pointerEvents: 'none', zIndex: 2 }}>
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input
                        type="text"
                        className="h5ap-podcast-search-input"
                        placeholder="Search episodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}
            <div className="h5ap-audio-element-container">
                <audio src={firstSource}></audio>
            </div>
        </div>
    );
}

export default Playlist1;