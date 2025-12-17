'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AtFinderHeader } from '@/components/atfinder/header';
import { FeedCard } from '@/components/atfinder/feed-card';
import { CommentsModal } from '@/components/atfinder/comments-modal';
import { getAttributionRequests, getAttributionRequestsByStatus } from '@/lib/supabase/queries';
import type { AttributionRequest } from '@/lib/supabase/types';
import { RefreshCw, Loader2 } from 'lucide-react';

type SortMode = 'recent' | 'popular';
type FilterMode = 'all' | 'open' | 'solved';

export default function DiscoveryFeed() {
  const [requests, setRequests] = useState<AttributionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AttributionRequest | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull-to-refresh state
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullThreshold = 80; // Pixels to pull before triggering refresh
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch requests from database
  const fetchRequests = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

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
        setError('Failed to load posts. Please try again.');
        console.error('Error fetching requests:', result.error);
      } else {
        setRequests(result.data);
      }
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortMode, filterMode]);

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchRequests(true);
  };

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || pullStartY === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;

    // Only allow pulling down when at the top
    if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      setPullDistance(Math.min(distance, pullThreshold * 1.5));

      // Prevent default scrolling while pulling
      if (distance > 10) {
        e.preventDefault();
      }
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
    const request = requests.find(r => r.id === requestId);
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
    setSortMode(newSort);
  };

  const handleFilterChange = (newFilter: FilterMode) => {
    setFilterMode(newFilter);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ overflowY: 'auto' }}
    >
      <AtFinderHeader />

      <main className="max-w-2xl mx-auto">
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

        {/* Feed Header with Refresh Button */}
        <div className="px-4 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              @ Discovery Feed
            </h1>
            <p className="text-sm text-muted-foreground">
              Help identify original creators and get credit where credit is due
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-accent rounded-full transition-colors tap-target"
            aria-label="Refresh feed"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${refreshing ? 'animate-spin' : ''}`} />
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <button
              onClick={() => fetchRequests()}
              className="text-sm text-primary font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Feed Cards - Full-card inline display (no spacing between cards) */}
        {!loading && !error && (
          <div>
            {requests.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="text-muted-foreground mb-4">
                  No posts found. {filterMode !== 'all' && 'Try changing your filters.'}
                </p>
                {filterMode !== 'all' && (
                  <button
                    onClick={() => setFilterMode('all')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    View all posts
                  </button>
                )}
              </div>
            ) : (
              requests.map((request) => (
                <FeedCard
                  key={request.id}
                  request={request}
                  onCommentClick={handleCommentClick}
                />
              ))
            )}
          </div>
        )}

        {/* Load More - Placeholder for future pagination */}
        {!loading && !error && requests.length >= 20 && (
          <div className="py-8 text-center">
            <button className="px-6 py-3 bg-muted text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors">
              Load More
            </button>
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
