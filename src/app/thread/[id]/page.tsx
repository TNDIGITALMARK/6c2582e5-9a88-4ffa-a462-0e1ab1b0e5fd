'use client';

import { use } from 'react';
import { AtFinderHeader } from '@/components/atfinder/header';
import { AnswerCard } from '@/components/atfinder/answer-card';
import { getMockRequest, getMockAnswers } from '@/lib/mock-data';
import { ArrowBigUp, MessageCircle, Share2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { notFound } from 'next/navigation';

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
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
  other: 'Other'
};

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const request = getMockRequest(id);
  const answers = getMockAnswers(id);
  const [upvoted, setUpvoted] = useState(false);

  if (!request) {
    notFound();
  }

  const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });
  const platformColor = request.platform ? platformColors[request.platform] : platformColors.other;
  const platformLabel = request.platform ? platformLabels[request.platform] : platformLabels.other;

  // Sort answers: verified first, then by upvotes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.is_verified && !b.is_verified) return -1;
    if (!a.is_verified && b.is_verified) return 1;
    return b.upvotes - a.upvotes;
  });

  const topAnswer = sortedAnswers.find(a => a.is_verified);

  return (
    <div className="min-h-screen bg-background">
      <AtFinderHeader />

      <main className="container-centered py-6">
        {/* Original Request */}
        <article className="bg-card border border-border rounded-lg p-6 mb-6">
          {/* Status Badge */}
          {request.status === 'solved' && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                Solved - Original @ found
              </span>
            </div>
          )}

          <div className="flex gap-4">
            {/* Upvote Column */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setUpvoted(!upvoted)}
                className={`tap-target p-1 rounded hover:bg-accent transition-colors ${
                  upvoted ? 'text-primary' : 'text-muted-foreground'
                }`}
                aria-label="Upvote"
              >
                <ArrowBigUp className={`w-7 h-7 ${upvoted ? 'fill-current' : ''}`} />
              </button>
              <span className={`text-base font-bold ${upvoted ? 'text-primary' : 'text-foreground'}`}>
                {request.upvotes + (upvoted ? 1 : 0)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground mb-3">
                {request.title}
              </h1>

              {/* Description */}
              {request.description && (
                <p className="text-base text-foreground mb-4 leading-relaxed">
                  {request.description}
                </p>
              )}

              {/* Media Preview */}
              {request.media_url && (
                <div className="mb-4">
                  <div className="rounded-lg overflow-hidden bg-muted max-w-md">
                    <img
                      src={request.media_url}
                      alt="Request media"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {/* Repost Link */}
              {request.repost_url && (
                <a
                  href={request.repost_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Post
                </a>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {request.platform && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${platformColor}`}>
                    {platformLabel}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  Asked {timeAgo}
                </span>
                {request.submitted_by && (
                  <span className="text-sm text-muted-foreground">
                    by @{request.submitted_by}
                  </span>
                )}
              </div>

              {/* Verified Creator */}
              {request.verified && request.verified_creator_handle && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-semibold text-green-800">
                        Verified Original Creator
                      </div>
                      <div className="text-base font-bold text-green-900">
                        {request.verified_creator_handle}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors tap-target py-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{request.comment_count} comments</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors tap-target py-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Answers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            <select className="px-3 py-1 bg-muted text-foreground text-sm rounded-lg border border-input">
              <option>Best</option>
              <option>Recent</option>
              <option>Most Votes</option>
            </select>
          </div>

          {/* Answers List */}
          <div className="space-y-4">
            {sortedAnswers.length > 0 ? (
              sortedAnswers.map((answer, index) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isTopAnswer={index === 0 && answer.is_verified}
                />
              ))
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  No answers yet. Be the first to help identify the original creator!
                </p>
                <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
                  Submit an Answer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Answer Section */}
        {answers.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Know the Original Creator?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your knowledge and help give credit where it's due. Login required.
            </p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
              Submit an Answer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
