'use client';

import { ArrowBigUp, MessageCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import type { Answer } from '@/lib/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface AnswerCardProps {
  answer: Answer;
  isTopAnswer?: boolean;
}

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
  other: 'Other Platform'
};

export function AnswerCard({ answer, isTopAnswer = false }: AnswerCardProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(answer.created_at), { addSuffix: true });

  const handleUpvote = () => {
    setUpvoted(!upvoted);
  };

  return (
    <div className={`bg-card border rounded-lg p-4 ${
      isTopAnswer ? 'border-green-500 border-2' : 'border-border'
    }`}>
      {/* Verified Badge for Top Answer */}
      {isTopAnswer && answer.is_verified && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-600">
            Verified Original Creator
          </span>
        </div>
      )}

      {/* Answer Header */}
      <div className="flex items-start gap-3">
        {/* Upvote Column */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleUpvote}
            className={`tap-target p-1 rounded hover:bg-accent transition-colors ${
              upvoted ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-label="Upvote"
          >
            <ArrowBigUp className={`w-6 h-6 ${upvoted ? 'fill-current' : ''}`} />
          </button>
          <span className={`text-sm font-bold ${upvoted ? 'text-primary' : 'text-foreground'}`}>
            {answer.upvotes + (upvoted ? 1 : 0)}
          </span>
        </div>

        {/* Answer Content */}
        <div className="flex-1">
          {/* Creator Info */}
          <div className="mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-base">
                {answer.creator_handle}
              </span>
              <span className="text-xs text-muted-foreground">
                on {platformLabels[answer.creator_platform] || 'Other Platform'}
              </span>
              {answer.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Answered {timeAgo}
            </div>
          </div>

          {/* Explanation */}
          {answer.explanation && (
            <p className="text-sm text-foreground mb-3 leading-relaxed">
              {answer.explanation}
            </p>
          )}

          {/* Proof Link */}
          {answer.proof_url && (
            <a
              href={answer.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-3"
            >
              <ExternalLink className="w-4 h-4" />
              View Proof
            </a>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors tap-target"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{answer.comment_count} {answer.comment_count === 1 ? 'comment' : 'comments'}</span>
            </button>
          </div>

          {/* Comments Section (Collapsed) */}
          {showComments && answer.comment_count > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-border space-y-3">
              <div className="text-xs text-muted-foreground">
                Comments are available in the full implementation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
