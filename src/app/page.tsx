'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { AtFinderHeader } from '@/components/atfinder/header';
import { FeedCard } from '@/components/atfinder/feed-card';
import { CommentsModal } from '@/components/atfinder/comments-modal';
import { Button } from '@/components/ui/button';
import { getAttributionRequests, getAttributionRequestsByStatus } from '@/lib/supabase/queries';
import type { AttributionRequest } from '@/lib/supabase/types';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';

type SortMode = 'recent' | 'popular';
type FilterMode = 'all' | 'open' | 'solved';

export default function DiscoveryFeed() {
  const [requests, setRequests] = useState<AttributionRequest[]>([]);
  const [cachedRequests, setCachedRequests] = useState<AttributionRequest[]>([]); // Keep stale data visible
  const [selectedRequest, setSelectedRequest] = useState<AttributionRequest | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
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
  }, [sortMode, filterMode, hasLoadedOnce, cachedRequests.length]);

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
  }, [sortMode, filterMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
    }
  };

  const handleFilterChange = (newFilter: FilterMode) => {
    if (newFilter !== filterMode) {
      setFilterMode(newFilter);
    }
  };

  // Determine which data to display - prioritize current, fallback to cached
  const displayRequests = requests.length > 0 ? requests : cachedRequests;

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

        {/* Filter/Sort Bar */}
        <div className="flex items-center gap-2 px-4 mb-4 overflow-x-auto">
          {/* Sort Buttons */}
          <button
            onClick={() => handleSortChange('recent')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              sortMode === 'recent'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => handleSortChange('popular')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              sortMode === 'popular'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            Popular
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Filter Buttons */}
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterMode === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('solved')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterMode === 'solved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            Solved
          </button>
          <button
            onClick={() => handleFilterChange('open')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterMode === 'open'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            Open
          </button>
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
          <div>
            {displayRequests.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">
                  {error ? 'Unable to load posts' : 'No posts yet'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error
                    ? 'There was a problem loading the feed. Please check your connection and try again.'
                    : filterMode !== 'all'
                    ? 'Try changing your filters to see more posts.'
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
                        Be the first to ask for an @
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {displayRequests.map((request) => (
                  <FeedCard
                    key={request.id}
                    request={request}
                    onCommentClick={handleCommentClick}
                  />
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
