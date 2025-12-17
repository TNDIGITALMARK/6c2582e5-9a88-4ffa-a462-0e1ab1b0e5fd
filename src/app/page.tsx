'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { AtFinderHeader } from '@/components/atfinder/header';
import { FeedCard } from '@/components/atfinder/feed-card';
import { CommentsModal } from '@/components/atfinder/comments-modal';
import { FilterDropdown } from '@/components/atfinder/filter-dropdown';
import { Button } from '@/components/ui/button';
import { getAttributionRequests, getAttributionRequestsByStatus } from '@/lib/supabase/queries';
import type { AttributionRequest } from '@/lib/supabase/types';
import { RefreshCw, Loader2, AlertCircle, X } from 'lucide-react';

type SortMode = 'recent' | 'popular';
type FilterMode = 'all' | 'open' | 'solved';
type PlatformMode = 'all' | 'tiktok' | 'instagram' | 'x' | 'youtube' | 'streaming' | 'underground';

export default function DiscoveryFeed() {
  const [requests, setRequests] = useState<AttributionRequest[]>([]);
  const [cachedRequests, setCachedRequests] = useState<AttributionRequest[]>([]); // Keep stale data visible
  const [selectedRequest, setSelectedRequest] = useState<AttributionRequest | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [platformMode, setPlatformMode] = useState<PlatformMode>('all');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Pull-to-refresh state
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullThreshold = 80;
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false); // Prevent concurrent fetches

  // Fetch requests from database with improved error handling
  const fetchRequests = useCallback(async (isManualRefresh = false) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    // Set appropriate loading state
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else if (!hasLoadedOnce) {
      setIsInitialLoading(true);
    }

    // Clear error only on manual refresh
    if (isManualRefresh) {
      setError(null);
    }

    try {
      let result;

      if (filterMode === 'all') {
        result = await getAttributionRequests(sortMode, 20, 0);
      } else {
        result = await getAttributionRequestsByStatus(
          filterMode as 'open' | 'solved',
          sortMode,
          20,
          0
        );
      }

      if (result.error) {
        // Set error message but keep showing cached/skeleton content
        setError(cachedRequests.length > 0 ? 'Failed to load latest posts. Showing cached content.' : 'Unable to load posts. Please check your connection and try again.');
        console.error('Error fetching requests:', result.error);
        // Don't clear initial loading if we have no data - keep skeleton visible
        if (cachedRequests.length === 0 && !hasLoadedOnce) {
          // Keep skeleton visible until user manually retries
          setIsInitialLoading(false);
        }
      } else {
        // Update both current and cached data
        setRequests(result.data);
        setCachedRequests(result.data);
        setError(null);
        setHasLoadedOnce(true);
      }
    } catch (err) {
      // Set error message but keep showing cached/skeleton content
      setError(cachedRequests.length > 0 ? 'Failed to load latest posts. Showing cached content.' : 'Unable to load posts. Please check your connection and try again.');
      console.error('Unexpected error:', err);
      // Don't clear initial loading if we have no data - keep skeleton visible
      if (cachedRequests.length === 0 && !hasLoadedOnce) {
        setIsInitialLoading(false);
      }
    } finally {
      setIsRefreshing(false);
      isFetchingRef.current = false;
      // Only clear initial loading if we got data or have cached data
      if (hasLoadedOnce || cachedRequests.length > 0 || requests.length > 0) {
        setIsInitialLoading(false);
      }
    }
  }, [sortMode, filterMode, platformMode, hasLoadedOnce, cachedRequests.length]);

  // Initial load - fetch once on mount
  useEffect(() => {
    fetchRequests(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when filters or sort mode change
  useEffect(() => {
    // Only refetch after initial load has completed
    if (hasLoadedOnce) {
      fetchRequests(false);
    }
  }, [sortMode, filterMode, platformMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual refresh handler
  const handleRefresh = () => {
    fetchRequests(true);
  };

  // Pull-to-refresh handlers - optimized to only work at scroll top
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only activate pull-to-refresh when scrolled to the very top
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop <= 5) {  // Small threshold for touch precision
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || pullStartY === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;
    const scrollTop = containerRef.current?.scrollTop || 0;

    // Only allow pulling down when at the top and pulling downward
    if (distance > 0 && scrollTop <= 5) {
      const dampedDistance = Math.min(distance * 0.5, pullThreshold * 1.5);  // Dampen pull for better feel
      setPullDistance(dampedDistance);

      // Prevent default scrolling while pulling (only when pull is significant)
      if (distance > 20) {
        e.preventDefault();
      }
    } else {
      // Cancel pull if user scrolls down
      setIsPulling(false);
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= pullThreshold) {
      handleRefresh();
    }

    setIsPulling(false);
    setPullStartY(0);
    setPullDistance(0);
  };

  const handleCommentClick = (requestId: string) => {
    // Look in both current and cached requests
    const request = requests.find(r => r.id === requestId) || cachedRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsCommentsOpen(true);
    }
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  // Filter/sort change handlers
  const handleSortChange = (newSort: SortMode) => {
    if (newSort !== sortMode) {
      setSortMode(newSort);
      // Save to localStorage
      localStorage.setItem('atfinder_sort', newSort);
    }
  };

  const handleFilterChange = (newFilter: FilterMode) => {
    if (newFilter !== filterMode) {
      setFilterMode(newFilter);
      // Save to localStorage
      localStorage.setItem('atfinder_status', newFilter);
    }
  };

  const handlePlatformChange = (newPlatform: PlatformMode) => {
    if (newPlatform !== platformMode) {
      setPlatformMode(newPlatform);
      // Save to localStorage
      localStorage.setItem('atfinder_platform', newPlatform);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSortMode('popular');
    setFilterMode('all');
    setPlatformMode('all');
    // Clear from localStorage
    localStorage.removeItem('atfinder_sort');
    localStorage.removeItem('atfinder_status');
    localStorage.removeItem('atfinder_platform');
  };

  // Check if any non-default filters are active
  const hasActiveFilters = sortMode !== 'popular' || filterMode !== 'all' || platformMode !== 'all';

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const savedSort = localStorage.getItem('atfinder_sort') as SortMode | null;
    const savedStatus = localStorage.getItem('atfinder_status') as FilterMode | null;
    const savedPlatform = localStorage.getItem('atfinder_platform') as PlatformMode | null;

    if (savedSort) setSortMode(savedSort);
    if (savedStatus) setFilterMode(savedStatus);
    if (savedPlatform) setPlatformMode(savedPlatform);
  }, []);

  // Client-side platform filtering (since API doesn't support it yet)
  const applyPlatformFilter = (requests: AttributionRequest[]) => {
    if (platformMode === 'all') return requests;

    const platformKeywords: Record<PlatformMode, string[]> = {
      all: [],
      tiktok: ['tiktok', 'tik tok'],
      instagram: ['instagram', 'ig', 'insta'],
      x: ['twitter', 'x.com', 'tweet'],
      youtube: ['youtube', 'yt'],
      streaming: ['twitch', 'stream', 'kick'],
      underground: ['soundcloud', 'bandcamp', 'underground']
    };

    const keywords = platformKeywords[platformMode] || [];

    return requests.filter(request => {
      const searchText = `${request.description || ''} ${request.media_url || ''}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });
  };

  // Determine which data to display - prioritize current, fallback to cached, apply platform filter
  const rawDisplayRequests = requests.length > 0 ? requests : cachedRequests;
  const displayRequests = applyPlatformFilter(rawDisplayRequests);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-y-auto"
      style={{ overflowY: 'auto' }}
    >
      <AtFinderHeader />

      <main className="max-w-2xl mx-auto">
        {/* Pull-to-refresh zone - only active at scroll top */}
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull-to-refresh indicator */}
          {isPulling && (
            <div
              className="flex justify-center py-4 transition-all"
              style={{
                height: `${Math.min(pullDistance, pullThreshold)}px`,
                opacity: Math.min(pullDistance / pullThreshold, 1)
              }}
            >
              <RefreshCw
                className={`w-6 h-6 text-primary ${pullDistance >= pullThreshold ? 'animate-spin' : ''}`}
                style={{
                  transform: `rotate(${Math.min(pullDistance * 3, 360)}deg)`
                }}
              />
            </div>
          )}
        </div>

        {/* Feed Header with Refresh Button */}
        <div className="px-4 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1.5">
              ATF (@Found)
            </h1>
            <p className="text-sm text-muted-foreground">
              Find the original @. Credit the creator.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-accent rounded-full transition-colors tap-target"
            aria-label="Refresh feed"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter/Sort Bar - Three-part segmented filter UI */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Sort By Dropdown */}
            <FilterDropdown
              label="Sort by"
              value={sortMode}
              options={[
                { value: 'popular', label: 'Popular' },
                { value: 'recent', label: 'Recent' }
              ]}
              onChange={(value) => handleSortChange(value as SortMode)}
              isActive={sortMode !== 'popular'}
            />

            {/* Status Dropdown */}
            <FilterDropdown
              label="Status"
              value={filterMode}
              options={[
                { value: 'all', label: 'All' },
                { value: 'open', label: 'Open' },
                { value: 'solved', label: 'Solved' }
              ]}
              onChange={(value) => handleFilterChange(value as FilterMode)}
              isActive={filterMode !== 'all'}
            />

            {/* Platform Dropdown */}
            <FilterDropdown
              label="Platform"
              value={platformMode}
              options={[
                { value: 'all', label: 'All Platforms' },
                { value: 'tiktok', label: 'TikTok', icon: '🎵' },
                { value: 'instagram', label: 'Instagram', icon: '📸' },
                { value: 'x', label: 'X', icon: '✖️' },
                { value: 'youtube', label: 'YouTube', icon: '▶️' },
                { value: 'streaming', label: 'Streaming', icon: '🎮' },
                { value: 'underground', label: 'Underground Artists', icon: '🎤' }
              ]}
              onChange={(value) => handlePlatformChange(value as PlatformMode)}
              isActive={platformMode !== 'all'}
            />
          </div>

          {/* Active Filters Indicator & Clear Button */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Active filters:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {sortMode !== 'popular' && (
                    <button
                      onClick={() => handleSortChange('popular')}
                      className="group flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
                      aria-label="Remove Recent filter"
                    >
                      <span>{sortMode === 'recent' ? 'Recent' : 'Popular'}</span>
                      <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  {filterMode !== 'all' && (
                    <button
                      onClick={() => handleFilterChange('all')}
                      className="group flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
                      aria-label={`Remove ${filterMode} filter`}
                    >
                      <span>{filterMode.charAt(0).toUpperCase() + filterMode.slice(1)}</span>
                      <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  {platformMode !== 'all' && (
                    <button
                      onClick={() => handlePlatformChange('all')}
                      className="group flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
                      aria-label="Remove platform filter"
                    >
                      <span>
                        {platformMode === 'tiktok' ? 'TikTok' :
                         platformMode === 'instagram' ? 'Instagram' :
                         platformMode === 'x' ? 'X' :
                         platformMode === 'youtube' ? 'YouTube' :
                         platformMode === 'streaming' ? 'Streaming' :
                         'Underground Artists'}
                      </span>
                      <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-2 py-1 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Error Banner - Non-blocking error notification */}
        {error && (displayRequests.length > 0 || isInitialLoading) && (
          <div className="mx-4 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 mb-1 font-medium">
                {displayRequests.length > 0 ? 'Showing cached content' : 'Connection issue'}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {error}{' '}
                <button
                  onClick={handleRefresh}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Skeleton Loading State - Only on initial load */}
        {isInitialLoading && !hasLoadedOnce && (
          <div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border-b border-border">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
                {/* Media skeleton */}
                <div className="w-full h-80 bg-muted animate-pulse" />
                {/* Content skeleton */}
                <div className="px-4 py-3 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </div>
                {/* Actions skeleton */}
                <div className="flex items-center justify-around border-t border-border px-4 py-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feed Cards - Always show available content */}
        {!isInitialLoading && (
          <div className="animate-in fade-in duration-300">
            {displayRequests.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">
                  {error ? 'Unable to load posts' : hasActiveFilters ? 'No posts found' : 'No posts yet'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error
                    ? 'There was a problem loading the feed. Please check your connection and try again.'
                    : hasActiveFilters
                    ? 'No posts found — try changing filters'
                    : 'Be the first to ask for an @ and help credit creators!'}
                </p>
                <div className="flex flex-col gap-2 items-center">
                  {error ? (
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Try again
                    </button>
                  ) : (
                    <Link href="/ask">
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2 rounded-full text-sm"
                      >
                        Ask for an @
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {displayRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="animate-in fade-in duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <FeedCard
                      request={request}
                      onCommentClick={handleCommentClick}
                    />
                  </div>
                ))}
                {/* Load More - Placeholder for future pagination */}
                {displayRequests.length >= 20 && (
                  <div className="py-8 text-center">
                    <button className="px-6 py-3 bg-muted text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors">
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Comments Modal */}
      {selectedRequest && (
        <CommentsModal
          isOpen={isCommentsOpen}
          onClose={handleCloseComments}
          request={selectedRequest}
        />
      )}
    </div>
  );
}
