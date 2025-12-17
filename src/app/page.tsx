'use client';

import { useState } from 'react';
import { AtFinderHeader } from '@/components/atfinder/header';
import { FeedCard } from '@/components/atfinder/feed-card';
import { CommentsModal } from '@/components/atfinder/comments-modal';
import { getMockRequests } from '@/lib/mock-data';
import type { AttributionRequest } from '@/lib/supabase/types';

export default function DiscoveryFeed() {
  const requests = getMockRequests();
  const [selectedRequest, setSelectedRequest] = useState<AttributionRequest | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleCommentClick = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsCommentsOpen(true);
    }
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
    // Delay clearing selectedRequest to allow animation to complete
    setTimeout(() => setSelectedRequest(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <AtFinderHeader />

      <main className="max-w-2xl mx-auto">
        {/* Feed Header */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            @ Discovery Feed
          </h1>
          <p className="text-sm text-muted-foreground">
            Help identify original creators and get credit where credit is due
          </p>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex items-center gap-2 px-4 mb-4 overflow-x-auto">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium whitespace-nowrap">
            Recent
          </button>
          <button className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded-full text-sm font-medium whitespace-nowrap">
            Popular
          </button>
          <button className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded-full text-sm font-medium whitespace-nowrap">
            Solved
          </button>
          <button className="px-4 py-2 bg-muted text-foreground hover:bg-accent rounded-full text-sm font-medium whitespace-nowrap">
            Open
          </button>
        </div>

        {/* Feed Cards - Full-card inline display (no spacing between cards) */}
        <div>
          {requests.map((request) => (
            <FeedCard
              key={request.id}
              request={request}
              onCommentClick={handleCommentClick}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="py-8 text-center">
          <button className="px-6 py-3 bg-muted text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors">
            Load More
          </button>
        </div>
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
