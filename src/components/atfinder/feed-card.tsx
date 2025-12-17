'use client';

import Link from 'next/link';
import { ArrowBigUp, MessageCircle, CheckCircle2 } from 'lucide-react';
import type { AttributionRequest } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
  request: AttributionRequest;
}

const platformColors: Record<string, string> = {
  tiktok: 'bg-black text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  twitter: 'bg-[#1DA1F2] text-white',
  youtube: 'bg-red-600 text-white',
  other: 'bg-gray-500 text-white'
};

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'IG',
  twitter: 'X',
  youtube: 'YT',
  other: 'Other'
};

export function FeedCard({ request }: FeedCardProps) {
  const platformColor = request.platform ? platformColors[request.platform] : platformColors.other;
  const platformLabel = request.platform ? platformLabels[request.platform] : platformLabels.other;
  const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });

  return (
    <Link href={`/thread/${request.id}`}>
      <article className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex gap-3">
          {/* Thumbnail Preview */}
          {request.media_url && (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                <img
                  src={request.media_url}
                  alt="Media preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Question Title */}
            <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
              {request.title}
            </h3>

            {/* Description */}
            {request.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {request.description}
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Platform Badge */}
              {request.platform && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${platformColor}`}>
                  {platformLabel}
                </span>
              )}

              {/* Verified Creator (if solved) */}
              {request.verified && request.verified_creator_handle && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {request.verified_creator_handle}
                </span>
              )}

              {/* Status Badge */}
              {request.status === 'solved' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Solved
                </span>
              )}

              {/* Time */}
              <span className="text-xs text-muted-foreground">
                {timeAgo}
              </span>
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {/* Upvotes */}
              <div className="flex items-center gap-1 tap-target">
                <ArrowBigUp className="w-5 h-5" />
                <span className="font-medium">{request.upvotes}</span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1 tap-target">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{request.comment_count} comments</span>
              </div>

              {/* Answers */}
              {request.answer_count > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">{request.answer_count} answers</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
