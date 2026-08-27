import React, { useEffect, useState } from "react";

import skin from "./skin";
import "./style.scss";
import "../../../style.scss";
import PlyrPlaylist from "../../../../../utils/PlyrPlaylist";


function Playlist1(props) {
    const { attributes, containerRef } = props;
    const { audios = [], multiple_audio, hideDownload, shuffle } = attributes;

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('newest');
    const [expandedItems, setExpandedItems] = useState({});
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
    const hasSubLinks = attributes.spotifyUrl || attributes.applePodcastsUrl || attributes.amazonMusicUrl || attributes.youtubePodcastsUrl || attributes.rssFeedUrl;
    const subLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#334155',
        textDecoration: 'none',
        background: '#f8fafc',
        transition: 'all 0.15s ease'
    };

    const perPage = attributes.podcastPerPage && attributes.podcastPerPage > 0 ? attributes.podcastPerPage : 5;
    const [visibleCount, setVisibleCount] = useState(perPage);
    const [currentPage, setCurrentPage] = useState(1);

    const isPodcast = attributes.sourceType === 'podcast';
    const isLoadMoreEnabled = isPodcast && attributes.podcastLoadMore === true;
    const paginationType = attributes.podcastPaginationType || 'load_more';

    const parseAudioDate = (dateStr) => {
        if (!dateStr) return 0;
        const parsed = Date.parse(dateStr);
        return isNaN(parsed) ? 0 : parsed;
    };

    let filteredAudios = audios;
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredAudios = audios.filter(item =>
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.artist && item.artist.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
    }

    if (isPodcast && attributes.podcastFilter) {
        // Date Filtering
        if (filterType === '7days') {
            const limitDate = Date.now() - 7 * 24 * 60 * 60 * 1000;
            filteredAudios = filteredAudios.filter(item => parseAudioDate(item.date) >= limitDate);
        } else if (filterType === '30days') {
            const limitDate = Date.now() - 30 * 24 * 60 * 60 * 1000;
            filteredAudios = filteredAudios.filter(item => parseAudioDate(item.date) >= limitDate);
        } else if (filterType === 'thisyear') {
            const currentYearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
            filteredAudios = filteredAudios.filter(item => parseAudioDate(item.date) >= currentYearStart);
        }

        // Date Sorting
        if (filterType === 'oldest') {
            filteredAudios = [...filteredAudios].sort((a, b) => parseAudioDate(a.date) - parseAudioDate(b.date));
        } else {
            // Default to newest first (sorts descending)
            filteredAudios = [...filteredAudios].sort((a, b) => parseAudioDate(b.date) - parseAudioDate(a.date));
        }
    }

    let itemsToDisplay = filteredAudios;
    let totalPages = 1;

    if (isLoadMoreEnabled && !searchQuery.trim()) {
        if (paginationType === 'pagination') {
            totalPages = Math.ceil(filteredAudios.length / perPage) || 1;
            const startIndex = (currentPage - 1) * perPage;
            itemsToDisplay = filteredAudios.slice(startIndex, startIndex + perPage);
        } else {
            itemsToDisplay = filteredAudios.slice(0, visibleCount);
        }
    }

    const firstSource = itemsToDisplay[0]?.source || '';

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const audioElement = container.querySelector('audio');
        if (!audioElement) return;

        const skipSeconds = parseInt(attributes.skipTime || 15);

        const player = new Plyr(audioElement, {
            seekTime: skipSeconds,
            volume: 1,
            muted: false,
            storage: { enabled: false },
            controls: skin(itemsToDisplay, {
                hide_download: hideDownload,
                shuffle,
                episodeSkip: attributes.episodeSkip,
                skipTime: skipSeconds,
                enableSpeed: attributes.enableSpeed,
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

        new PlyrPlaylist(player, itemsToDisplay, { shuffle, multipleAudio: multiple_audio, container: containerRef.current });

        // Speed dropdown click handlers
        const speedWrappers = container.querySelectorAll('.h5ap-speed-wrapper, [data-plyr="speed-wrapper"]');
        speedWrappers.forEach(wrapper => {
            const btn = wrapper.querySelector('.h5ap-speed-btn, [data-plyr="speed-btn"]');
            const dropdown = wrapper.querySelector('.h5ap-speed-dropdown');
            const options = wrapper.querySelectorAll('.h5ap-speed-opt');

            if (btn && dropdown) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const isOpen = dropdown.classList.contains('is-open');
                    document.querySelectorAll('.h5ap-speed-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
                    if (!isOpen) {
                        dropdown.classList.add('is-open');
                    }
                };

                options.forEach(opt => {
                    opt.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const speed = parseFloat(opt.dataset.speed) || 1;
                        player.speed = speed;
                        options.forEach(o => o.classList.remove('is-active'));
                        opt.classList.add('is-active');
                        const label = wrapper.querySelector('.h5ap-speed-label');
                        if (label) {
                            label.textContent = `${speed}×`;
                        }
                        dropdown.classList.remove('is-open');
                    };
                });
            }
        });

        const handleOutsideClick = (e) => {
            if (!e.target.closest('.h5ap-speed-wrapper') && !e.target.closest('[data-plyr="speed-wrapper"]')) {
                document.querySelectorAll('.h5ap-speed-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
            }
        };
        document.addEventListener('click', handleOutsideClick);

        const searchInput = container.querySelector('[data-h5ap-search]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => setSearchQuery(e.target.value));
        }

        const filterSelect = container.querySelector('[data-h5ap-filter]');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => setFilterType(e.target.value));
        }

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
            document.removeEventListener('click', handleOutsideClick);
            try {
                player?.destroy();
            } catch (e) {
                // Suppress DOM unmount warning
            }
        };
    }, [audios, hideDownload, shuffle, currentPage, visibleCount, isLoadMoreEnabled, paginationType, perPage, searchQuery, filterType, attributes.podcastFilter, attributes.podcastSearch, attributes.podcastLoadMore, attributes.podcastDate, attributes.podcastDesc, attributes.episodeSkip, attributes.skipTime, attributes.enableSpeed, expandedItems]);

    useEffect(() => {
        const handleOutsideSubClick = (e) => {
            if (!e.target.closest('.h5ap-subscribe-btn')) {
                setIsSubscribeOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideSubClick);
        return () => {
            document.removeEventListener('click', handleOutsideSubClick);
        };
    }, []);

    return (
        <div className="skin_playlist1 h5ap_skin w-full max-w-xl mx-auto rounded-2xl shadow-xl p-6" ref={containerRef}>
            {((isPodcast && (attributes.podcastSearch === true || attributes.podcastFilter === true)) || attributes.enableSubscribe === true) && (
                <div className="h5ap-podcast-controls-row" style={{ display: 'flex', gap: '10px', marginBottom: '16px', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'center', minWidth: (attributes.podcastSearch || attributes.podcastFilter) ? '180px' : 'auto' }}>
                        {isPodcast && attributes.podcastSearch && (
                            <div className="h5ap-podcast-search" style={{ flex: 1, marginBottom: 0 }}>
                                <div className="h5ap-podcast-search-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <svg className="h5ap-search-icon" viewBox="0 0 24 24" width="16" height="16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }}>
                                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="h5ap-podcast-search-input"
                                        placeholder="Search episodes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '34px' }}
                                    />
                                </div>
                            </div>
                        )}
                        {isPodcast && attributes.podcastFilter && (
                            <div className="h5ap-podcast-filter-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                                <select
                                    className="h5ap-podcast-filter-select"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="thisyear">This Year</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {attributes.enableSubscribe === true && (
                        <div className="h5ap-subscribe-wrapper" style={{ position: 'relative', flexShrink: 0, marginLeft: 'auto' }}>
                            <button
                                type="button"
                                className="h5ap-subscribe-btn"
                                onClick={() => setIsSubscribeOpen(prev => !prev)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    height: '35px',
                                    padding: '0 14px',
                                    borderRadius: '18px',
                                    background: attributes.primaryColor || 'var(--plyr-color-main, #00b2ff)',
                                    color: '#ffffff',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                </svg>
                                <span>{attributes.subscribeTitle || 'Subscribe'}</span>
                            </button>

                            {isSubscribeOpen && (
                                <div
                                    className="h5ap-subscribe-modal"
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 6px)',
                                        right: 0,
                                        background: '#ffffff',
                                        color: '#0f172a',
                                        borderRadius: '10px',
                                        padding: '12px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                                        minWidth: '180px',
                                        zIndex: 99999,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    }}
                                >
                                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '2px' }}>
                                        Listen On
                                    </div>
                                    {attributes.spotifyUrl && (
                                        <a href={attributes.spotifyUrl} target="_blank" rel="noopener noreferrer" style={subLinkStyle} onClick={() => setIsSubscribeOpen(false)}>
                                            🎵 Spotify
                                        </a>
                                    )}
                                    {attributes.applePodcastsUrl && (
                                        <a href={attributes.applePodcastsUrl} target="_blank" rel="noopener noreferrer" style={subLinkStyle} onClick={() => setIsSubscribeOpen(false)}>
                                            🍏 Apple Podcasts
                                        </a>
                                    )}
                                    {attributes.amazonMusicUrl && (
                                        <a href={attributes.amazonMusicUrl} target="_blank" rel="noopener noreferrer" style={subLinkStyle} onClick={() => setIsSubscribeOpen(false)}>
                                            📦 Amazon Music
                                        </a>
                                    )}
                                    {attributes.youtubePodcastsUrl && (
                                        <a href={attributes.youtubePodcastsUrl} target="_blank" rel="noopener noreferrer" style={subLinkStyle} onClick={() => setIsSubscribeOpen(false)}>
                                            ▶️ YouTube
                                        </a>
                                    )}
                                    {attributes.rssFeedUrl && (
                                        <a href={attributes.rssFeedUrl} target="_blank" rel="noopener noreferrer" style={subLinkStyle} onClick={() => setIsSubscribeOpen(false)}>
                                            📡 RSS Feed
                                        </a>
                                    )}
                                    {!hasSubLinks && (
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', padding: '4px' }}>
                                            No links set in settings
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="h5ap-audio-element-container">
                <audio src={firstSource}></audio>
            </div>
        </div>
    );
}

export default Playlist1;