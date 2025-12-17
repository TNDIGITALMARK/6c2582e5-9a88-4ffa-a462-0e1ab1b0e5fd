'use client';

import { AtFinderHeader } from '@/components/atfinder/header';
import { FeedCard } from '@/components/atfinder/feed-card';
import { getMockRequests } from '@/lib/mock-data';

export default function DiscoveryFeed() {
  const requests = getMockRequests();

  return (
    <div className="min-h-screen bg-background">
      <AtFinderHeader />

      <main className="container-centered py-6">
        {/* Feed Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            @ Discovery Feed
          </h1>
          <p className="text-sm text-muted-foreground">
            Help identify original creators and get credit where credit is due
          </p>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
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

        {/* Feed Cards */}
        <div className="space-y-4">
          {requests.map((request) => (
            <FeedCard key={request.id} request={request} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-muted text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}