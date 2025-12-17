// Database type definitions for AtFinder
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Platform = 'tiktok' | 'instagram' | 'twitter' | 'youtube' | 'other';
export type MediaType = 'image' | 'video' | 'gif';
export type RequestStatus = 'open' | 'solved' | 'closed';
export type VoteTargetType = 'request' | 'answer';

export interface AttributionRequest {
  id: string;
  tenantid: string;
  projectid: string;
  title: string;
  description: string | null;
  media_url: string | null;
  media_type: MediaType | null;
  repost_url: string | null;
  platform: Platform | null;
  status: RequestStatus;
  verified_creator_handle: string | null;
  verified: boolean;
  upvotes: number;
  answer_count: number;
  comment_count: number;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  tenantid: string;
  projectid: string;
  request_id: string;
  creator_handle: string;
  creator_platform: Platform;
  proof_url: string | null;
  explanation: string | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  upvotes: number;
  comment_count: number;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  tenantid: string;
  projectid: string;
  target_type: VoteTargetType;
  target_id: string;
  value: number;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  tenantid: string;
  projectid: string;
  target_type: VoteTargetType;
  target_id: string;
  content: string;
  user_id: string;
  user_handle: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      attribution_requests: {
        Row: AttributionRequest;
        Insert: Omit<AttributionRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AttributionRequest, 'id' | 'tenantid' | 'projectid'>>;
      };
      answers: {
        Row: Answer;
        Insert: Omit<Answer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Answer, 'id' | 'tenantid' | 'projectid'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'tenantid' | 'projectid'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Comment, 'id' | 'tenantid' | 'projectid'>>;
      };
    };
  };
}
