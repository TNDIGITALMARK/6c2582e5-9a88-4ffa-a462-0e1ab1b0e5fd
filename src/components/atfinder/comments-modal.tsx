'use client';

import { useState, useEffect } from 'react';
import { X, ArrowBigUp, MessageCircle, CheckCircle2 } from 'lucide-react';
import type { AttributionRequest, Answer, Comment } from '@/lib/supabase/types';
import { getMockAnswers, getMockComments } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AttributionRequest;
}

export function CommentsModal({ isOpen, onClose, request }: CommentsModalProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      // Load answers for this request
      const loadedAnswers = getMockAnswers(request.id);
      setAnswers(loadedAnswers);

      // Auto-select the first verified answer or the top answer
      if (loadedAnswers.length > 0) {
        const topAnswer = loadedAnswers.find(a => a.is_verified) || loadedAnswers[0];
        setSelectedAnswer(topAnswer);

        // Load comments for the top answer
        if (topAnswer) {
          const loadedComments = getMockComments(topAnswer.id);
          setComments(loadedComments);
        }
      }

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, request.id]);

  const handleAnswerClick = (answer: Answer) => {
    setSelectedAnswer(answer);
    const loadedComments = getMockComments(answer.id);
    setComments(loadedComments);
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && selectedAnswer) {
      // In real implementation, this would call Supabase
      const newCommentObj: Comment = {
        id: `c${Date.now()}`,
        tenantid: request.tenantid,
        projectid: request.projectid,
        target_type: 'answer',
        target_id: selectedAnswer.id,
        content: newComment,
        user_id: 'current_user',
        user_handle: '@you',
        upvotes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleCommentUpvote = (commentId: string) => {
    setUpvotedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel - Slide up from bottom (Instagram style) */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Comments & Answers
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Answers Section */}
          <div className="border-b border-border">
            <div className="px-4 py-3 bg-muted/50">
              <h3 className="text-sm font-semibold text-foreground">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h3>
            </div>

            {answers.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <p>No answers yet. Be the first to identify the creator!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedAnswer?.id === answer.id ? 'bg-accent/30' : ''
                    }`}
                    onClick={() => handleAnswerClick(answer)}
                  >
                    {/* Answer Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">
                          {answer.creator_handle}
                        </span>
                        {answer.is_verified && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Answer Content */}
                    <p className="text-sm text-foreground mb-2">
                      {answer.explanation}
                    </p>

                    {/* Proof Link */}
                    {answer.proof_url && (
                      <a
                        href={answer.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View proof →
                      </a>
                    )}

                    {/* Answer Engagement */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ArrowBigUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{answer.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{answer.comment_count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section (Reddit-style threaded) */}
          {selectedAnswer && (
            <div className="px-4 py-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Discussion
              </h4>

              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No comments yet. Start the discussion!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {/* Comment Thread Line */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                          {comment.user_handle.charAt(1).toUpperCase()}
                        </div>
                        {/* Vertical line for replies would go here */}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {comment.user_handle}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCommentUpvote(comment.id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              upvotedComments.has(comment.id)
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            <ArrowBigUp className={`w-4 h-4 ${upvotedComments.has(comment.id) ? 'fill-current' : ''}`} />
                            <span>{comment.upvotes + (upvotedComments.has(comment.id) ? 1 : 0)}</span>
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-primary">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Input (Fixed at bottom) */}
        {selectedAnswer && (
          <div className="border-t border-border px-4 py-3 bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
