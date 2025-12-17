'use client';

import { useState } from 'react';
import { ArrowBigUp, MessageCircle, Share2, CheckCircle2, ExternalLink } from 'lucide-react';
import type { AttributionRequest } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
  request: AttributionRequest;
  onCommentClick?: (requestId: string) => void;
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
  instagram: 'Instagram',
  twitter: 'X',
  youtube: 'YouTube',
  other: 'Other'
};

export function FeedCard({ request, onCommentClick }: FeedCardProps) {
  const [upvoted, setUpvoted] = useState(false);
  const platformColor = request.platform ? platformColors[request.platform] : platformColors.other;
  const platformLabel = request.platform ? platformLabels[request.platform] : platformLabels.other;
  const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });

  const handleUpvote = () => {
    setUpvoted(!upvoted);
  };

  const handleComment = () => {
    if (onCommentClick) {
      onCommentClick(request.id);
    }
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: request.description || '',
        url: window.location.href
      });
    }
  };

  return (
    <article className="bg-card border-b border-border feed-card">
      {/* Header: Creator @ handle + Platform Badge */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Creator Handle */}
          {request.verified && request.verified_creator_handle ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">
                {request.verified_creator_handle}
              </span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              @original_creator_found
            </span>
          )}

          {/* Platform Badge */}
          {request.platform && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${platformColor}`}>
              {platformLabel}
            </span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground">
          {timeAgo}
        </span>
      </div>

      {/* Full-size Media Display (TikTok/Twitter style) */}
      {request.media_url && (
        <div className="w-full bg-black">
          {request.media_type === 'video' ? (
            <video
              src={request.media_url}
              className="w-full max-h-[600px] object-contain"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={request.media_url}
              alt={request.title}
              className="w-full max-h-[600px] object-contain"
            />
          )}
        </div>
      )}

      {/* Caption/Description */}
      <div className="px-4 py-3">
        <h3 className="text-base font-semibold text-foreground mb-1">
          {request.title}
        </h3>
        {request.description && (
          <p className="text-sm text-foreground leading-relaxed">
            {request.description}
          </p>
        )}

        {/* Status Badge (if solved) */}
        {request.status === 'solved' && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Solved
            </span>
          </div>
        )}

        {/* External Link (if available) */}
        {request.repost_url && (
          <a
            href={request.repost_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            View original post
          </a>
        )}
      </div>

      {/* Action Buttons (Like, Comment, Share) */}
      <div className="flex items-center justify-around border-t border-border px-4 py-2">
        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors tap-target ${
            upvoted
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <ArrowBigUp className={`w-5 h-5 ${upvoted ? 'fill-current' : ''}`} />
          <span className="font-medium text-sm">
            {upvoted ? request.upvotes + 1 : request.upvotes}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleComment}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-accent tap-target"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{request.comment_count}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-accent tap-target"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium text-sm">Share</span>
        </button>

        {/* Answers Count (if available) */}
        {request.answer_count > 0 && (
          <button
            onClick={handleComment}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-accent tap-target"
          >
            <span className="font-medium text-sm">{request.answer_count} answers</span>
          </button>
        )}
      </div>
    </article>
  );
}
