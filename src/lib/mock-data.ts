import type { AttributionRequest, Answer, Comment } from './supabase/types';

// Mock data for AtFinder MVP demonstration
const TENANT_ID = 'U1IKRMhiLQb7xSrGGZRSq7FOkHW2';
const PROJECT_ID = '6c2582e5-9a88-4ffa-a462-0e1ab1b0e5fd';

export const mockAttributionRequests: AttributionRequest[] = [
  {
    id: '1',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Who started this dance trend?',
    description: 'This dance has been going viral on TikTok for weeks. I\'ve seen hundreds of people doing it but can\'t find the original creator. Does anyone know who started it?',
    media_url: 'https://images.unsplash.com/photo-1547153760-18fc9b232b96?w=200&h=200&fit=crop',
    media_type: 'video',
    repost_url: 'https://tiktok.com/@dancer123/video/123456',
    platform: 'tiktok',
    status: 'solved',
    verified_creator_handle: '@jalaiah_harmon',
    verified: true,
    upvotes: 47,
    answer_count: 3,
    comment_count: 12,
    submitted_by: 'user_sarah_creates',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Need to credit this artist properly',
    description: 'Found this amazing meme template being used everywhere. Want to make sure I credit the original artist before using it in my content.',
    media_url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=200&h=200&fit=crop',
    media_type: 'image',
    repost_url: null,
    platform: 'instagram',
    status: 'open',
    verified_creator_handle: null,
    verified: false,
    upvotes: 23,
    answer_count: 2,
    comment_count: 8,
    submitted_by: 'user_content_hunter',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Looking for original creator for partnership',
    description: 'This video format has incredible engagement. Our brand wants to partner with the original creator. Anyone know who started this trend?',
    media_url: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=200&h=200&fit=crop',
    media_type: 'video',
    repost_url: 'https://youtube.com/shorts/abc123',
    platform: 'youtube',
    status: 'solved',
    verified_creator_handle: '@original_creator',
    verified: true,
    upvotes: 89,
    answer_count: 5,
    comment_count: 31,
    submitted_by: 'user_brand_manager',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'This sound is everywhere - who made it?',
    description: 'Hearing this audio clip in every other video now. Would love to find the original so I can support them!',
    media_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop',
    media_type: 'video',
    repost_url: null,
    platform: 'tiktok',
    status: 'open',
    verified_creator_handle: null,
    verified: false,
    upvotes: 15,
    answer_count: 1,
    comment_count: 4,
    submitted_by: 'user_music_lover',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Recipe video going viral - original chef?',
    description: 'This cooking technique has been reposted thousands of times. I want to properly credit the chef who created it.',
    media_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
    media_type: 'video',
    repost_url: 'https://instagram.com/reel/xyz789',
    platform: 'instagram',
    status: 'open',
    verified_creator_handle: null,
    verified: false,
    upvotes: 34,
    answer_count: 2,
    comment_count: 9,
    submitted_by: 'user_foodie_fan',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

export const mockAnswers: Record<string, Answer[]> = {
  '1': [
    {
      id: 'a1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: '1',
      creator_handle: '@jalaiah_harmon',
      creator_platform: 'tiktok',
      proof_url: 'https://tiktok.com/@jalaiah_harmon/video/original',
      explanation: 'Jalaiah Harmon created the Renegade dance in 2019. She posted the original video on her TikTok and it went viral after being picked up by bigger creators.',
      is_verified: true,
      verified_by: 'moderator_team',
      verified_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      upvotes: 92,
      comment_count: 5,
      submitted_by: 'user_dance_historian',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: '1',
      creator_handle: '@dance_moves_official',
      creator_platform: 'tiktok',
      proof_url: null,
      explanation: 'I think it might be from this creator but not 100% sure.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 12,
      comment_count: 2,
      submitted_by: 'user_casual_observer',
      created_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '3': [
    {
      id: 'a3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: '3',
      creator_handle: '@original_creator',
      creator_platform: 'youtube',
      proof_url: 'https://youtube.com/@original_creator/first-video',
      explanation: 'This is definitely from @original_creator. They posted the first video using this format 3 months ago. Here\'s the timestamp and everything.',
      is_verified: true,
      verified_by: 'moderator_team',
      verified_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      upvotes: 156,
      comment_count: 8,
      submitted_by: 'user_youtube_detective',
      created_at: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

export const mockComments: Record<string, Comment[]> = {
  'a1': [
    {
      id: 'c1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a1',
      content: 'Thank you for crediting Jalaiah! She deserves all the recognition for creating this.',
      user_id: 'user_thankful',
      user_handle: '@thankful_user',
      upvotes: 24,
      created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a1',
      content: 'Here\'s the NY Times article that covered the story: [link]',
      user_id: 'user_source_provider',
      user_handle: '@source_provider',
      upvotes: 18,
      created_at: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Helper functions to get mock data
export function getMockRequests(): AttributionRequest[] {
  return mockAttributionRequests;
}

export function getMockRequest(id: string): AttributionRequest | undefined {
  return mockAttributionRequests.find(r => r.id === id);
}

export function getMockAnswers(requestId: string): Answer[] {
  return mockAnswers[requestId] || [];
}

export function getMockComments(targetId: string): Comment[] {
  return mockComments[targetId] || [];
}
