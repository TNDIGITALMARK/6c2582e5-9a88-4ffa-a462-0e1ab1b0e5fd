import type { AttributionRequest, Answer, Comment } from './supabase/types';

// Mock data for AtFinder MVP demonstration
const TENANT_ID = 'U1IKRMhiLQb7xSrGGZRSq7FOkHW2';
const PROJECT_ID = '6c2582e5-9a88-4ffa-a462-0e1ab1b0e5fd';

export const mockAttributionRequests: AttributionRequest[] = [
  // NEW DUMMY POST 1: TikTok - @ Found (Solved)
  {
    id: 'dummy1',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Viral skateboard trick - who\'s the original creator?',
    description: '"Just learned this insane trick from watching repost after repost. Need to credit the OG! 🛹"\n\nSeen this skateboard trick explode across TikTok and Instagram. Everyone\'s doing it but no one credits the original. Help me find them!',
    media_url: 'https://dummyimage.com/600x800/1a1a1a/1DA1F2.png&text=Skateboard+Trick+%F0%9F%9B%B9',
    media_type: 'video',
    repost_url: 'https://tiktok.com/@skater_reposts/video/987654',
    platform: 'tiktok',
    status: 'solved',
    verified_creator_handle: '@tony_hawk_vibes',
    verified: true,
    upvotes: 156,
    answer_count: 4,
    comment_count: 23,
    submitted_by: 'skate_detective',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },

  // NEW DUMMY POST 2: Instagram - @ Needed (Open)
  {
    id: 'dummy2',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Aesthetic coffee art - trying to find the artist',
    description: '"This latte art style is EVERYWHERE on my feed. The original artist deserves recognition! ☕️"\n\nI keep seeing this specific latte art technique reposted by coffee accounts, but none of them credit the creator. The original video had 2M+ views. Anyone know the source?',
    media_url: 'https://dummyimage.com/600x750/2a2a2a/ff69b4.png&text=Latte+Art+%E2%98%95',
    media_type: 'image',
    repost_url: 'https://instagram.com/p/coffee_reposts_456',
    platform: 'instagram',
    status: 'open',
    verified_creator_handle: null,
    verified: false,
    upvotes: 89,
    answer_count: 2,
    comment_count: 15,
    submitted_by: 'coffee_curator',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },

  // NEW DUMMY POST 3: YouTube - @ Needed (Open)
  {
    id: 'dummy3',
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Gaming montage editing style - need to credit!',
    description: '"Yo this editing style is fire 🔥 but I see it stolen everywhere. Help me find the original editor!"\n\nThis specific montage editing technique with the beat drops and transitions went viral on YouTube Shorts. Now every gaming channel copies it without credit. Let\'s find the OG!',
    media_url: 'https://dummyimage.com/600x400/0a0a0a/ff0000.png&text=Gaming+Montage+%F0%9F%8E%AE',
    media_type: 'video',
    repost_url: 'https://youtube.com/shorts/gaming_edit_789',
    platform: 'youtube',
    status: 'open',
    verified_creator_handle: null,
    verified: false,
    upvotes: 203,
    answer_count: 3,
    comment_count: 31,
    submitted_by: 'editor_hunter',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },

  // EXISTING POSTS (keep for feed variety)
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
  // ANSWERS FOR DUMMY POST 1 (Skateboard trick - SOLVED)
  'dummy1': [
    {
      id: 'a_dummy1_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy1',
      creator_handle: '@tony_hawk_vibes',
      creator_platform: 'tiktok',
      proof_url: 'https://tiktok.com/@tony_hawk_vibes/video/original_trick_123',
      explanation: 'This is definitely @tony_hawk_vibes! He posted the original trick video 2 weeks ago with the caption "New move I\'ve been working on". I have the link to his first post - it\'s timestamped and everything. He deserves all the credit!',
      is_verified: true,
      verified_by: 'moderator_atf',
      verified_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      upvotes: 187,
      comment_count: 8,
      submitted_by: 'skate_historian',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy1_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy1',
      creator_handle: '@skate_legends',
      creator_platform: 'instagram',
      proof_url: null,
      explanation: 'I thought it was @skate_legends on Instagram but after checking his profile, I think I was wrong. My bad!',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 5,
      comment_count: 3,
      submitted_by: 'confused_skater',
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy1_3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy1',
      creator_handle: '@pro_skater_22',
      creator_platform: 'tiktok',
      proof_url: 'https://tiktok.com/@pro_skater_22/video/456',
      explanation: 'Might be @pro_skater_22 - they had a similar video around the same time',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 12,
      comment_count: 2,
      submitted_by: 'skate_fan',
      created_at: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 48 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy1_4',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy1',
      creator_handle: '@tony_hawk_vibes',
      creator_platform: 'tiktok',
      proof_url: 'https://tiktok.com/@tony_hawk_vibes/bio',
      explanation: 'Yeah it\'s 100% @tony_hawk_vibes. Just checked his bio and he mentions creating this trick. Plus he has a whole series teaching it.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 34,
      comment_count: 1,
      submitted_by: 'skate_detective_2',
      created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 42 * 60 * 1000).toISOString()
    }
  ],

  // ANSWERS FOR DUMMY POST 2 (Coffee art - OPEN)
  'dummy2': [
    {
      id: 'a_dummy2_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy2',
      creator_handle: '@latte_art_queen',
      creator_platform: 'instagram',
      proof_url: 'https://instagram.com/p/latte_art_queen_original',
      explanation: 'Pretty sure this is @latte_art_queen on Instagram! Her style matches this technique perfectly. She\'s been doing this specific rosetta pattern for months.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 45,
      comment_count: 6,
      submitted_by: 'barista_daily',
      created_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy2_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy2',
      creator_handle: '@cafe_aesthetics',
      creator_platform: 'instagram',
      proof_url: null,
      explanation: 'Could be @cafe_aesthetics? They do similar latte art but I\'m not 100% certain this specific technique is theirs.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 18,
      comment_count: 4,
      submitted_by: 'coffee_lover_99',
      created_at: new Date(Date.now() - 2.8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.8 * 60 * 60 * 1000).toISOString()
    }
  ],

  // ANSWERS FOR DUMMY POST 3 (Gaming montage - OPEN)
  'dummy3': [
    {
      id: 'a_dummy3_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy3',
      creator_handle: '@velocity_edits',
      creator_platform: 'youtube',
      proof_url: 'https://youtube.com/@velocity_edits/montage_tutorial',
      explanation: 'This editing style is 100% @velocity_edits! He created this specific beat-sync transition technique and even made a tutorial about it. Check his channel - he has a whole series on these montage edits.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 92,
      comment_count: 12,
      submitted_by: 'editor_pro',
      created_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy3_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy3',
      creator_handle: '@fps_highlights',
      creator_platform: 'youtube',
      proof_url: 'https://youtube.com/@fps_highlights/early_video',
      explanation: 'I think it might be @fps_highlights - they were doing similar edits around the same time but I\'m not sure if they were first.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 23,
      comment_count: 5,
      submitted_by: 'gaming_fan_123',
      created_at: new Date(Date.now() - 4.7 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.7 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a_dummy3_3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      request_id: 'dummy3',
      creator_handle: '@montage_master',
      creator_platform: 'youtube',
      proof_url: null,
      explanation: 'Could be @montage_master but their style is slightly different. Not confident on this one.',
      is_verified: false,
      verified_by: null,
      verified_at: null,
      upvotes: 8,
      comment_count: 2,
      submitted_by: 'casual_gamer',
      created_at: new Date(Date.now() - 4.8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.8 * 60 * 60 * 1000).toISOString()
    }
  ],

  // EXISTING ANSWERS (keep for variety)
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
  // COMMENTS FOR DUMMY POST 1 - Top Answer (Verified)
  'a_dummy1_1': [
    {
      id: 'c_dummy1_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'YES! Finally someone credited him properly. @tony_hawk_vibes has been creating sick tricks for months and people just steal them without credit.',
      user_id: 'skate_community',
      user_handle: '@skate_community',
      upvotes: 67,
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'This is the original @ for sure! I\'ve been following him since day one and watched him develop this trick over weeks.',
      user_id: 'early_follower',
      user_handle: '@early_follower',
      upvotes: 42,
      created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 32 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'Just went to his profile and gave him a follow. Thanks for finding the original!',
      user_id: 'new_supporter',
      user_handle: '@new_supporter',
      upvotes: 28,
      created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 28 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_4',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'He also posted a tutorial breaking down this trick step-by-step. Super helpful creator.',
      user_id: 'tutorial_fan',
      user_handle: '@tutorial_fan',
      upvotes: 51,
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_5',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'Respect for finding the source. This is what the internet should be about - crediting creators properly! 🙌',
      user_id: 'credit_advocate',
      user_handle: '@credit_advocate',
      upvotes: 89,
      created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 22 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_6',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'The timestamp on his original video proves this 100%. Good detective work!',
      user_id: 'fact_checker',
      user_handle: '@fact_checker',
      upvotes: 34,
      created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 18 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_7',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'Can confirm - I go to the same skate park as him and watched him perfect this trick IRL before posting it.',
      user_id: 'local_skater',
      user_handle: '@local_skater',
      upvotes: 103,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy1_8',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy1_1',
      content: 'W community for finding and crediting the original creator 💯',
      user_id: 'community_member',
      user_handle: '@community_member',
      upvotes: 45,
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
    }
  ],

  // COMMENTS FOR DUMMY POST 2 - Top Answer
  'a_dummy2_1': [
    {
      id: 'c_dummy2_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'I follow @latte_art_queen and this is definitely her signature style! The rosetta pattern with that specific pour technique.',
      user_id: 'coffee_expert',
      user_handle: '@coffee_expert',
      upvotes: 52,
      created_at: new Date(Date.now() - 2.3 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy2_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'Just checked her Instagram and yep, this matches her work perfectly. She should get proper credit!',
      user_id: 'barista_life',
      user_handle: '@barista_life',
      upvotes: 38,
      created_at: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy2_3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'She posted a tutorial for this exact technique 3 months ago. Definitely the original artist.',
      user_id: 'tutorial_hunter',
      user_handle: '@tutorial_hunter',
      upvotes: 61,
      created_at: new Date(Date.now() - 2.1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2.1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy2_4',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'Coffee artists work so hard on these techniques and rarely get credit. Thank you for finding the source!',
      user_id: 'support_artists',
      user_handle: '@support_artists',
      upvotes: 44,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy2_5',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'Need someone to verify this so we can mark it as solved!',
      user_id: 'verification_needed',
      user_handle: '@verification_needed',
      upvotes: 27,
      created_at: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy2_6',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy2_1',
      content: 'Her Instagram stories show her developing this technique over time. This is 100% her work.',
      user_id: 'story_watcher',
      user_handle: '@story_watcher',
      upvotes: 55,
      created_at: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString()
    }
  ],

  // COMMENTS FOR DUMMY POST 3 - Top Answer
  'a_dummy3_1': [
    {
      id: 'c_dummy3_1',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'FACTS! @velocity_edits pioneered this whole editing style. I\'ve seen SO many people copy it without giving credit.',
      user_id: 'editor_community',
      user_handle: '@editor_community',
      upvotes: 124,
      created_at: new Date(Date.now() - 4.3 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_2',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'His tutorial on this technique has 500K+ views. He literally created the blueprint that everyone copies now.',
      user_id: 'tutorial_watcher',
      user_handle: '@tutorial_watcher',
      upvotes: 87,
      created_at: new Date(Date.now() - 4.2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_3',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'I learned editing from his tutorials and his montage series is legendary. Give the man his credit!',
      user_id: 'aspiring_editor',
      user_handle: '@aspiring_editor',
      upvotes: 96,
      created_at: new Date(Date.now() - 4.1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4.1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_4',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'The beat-sync transitions + velocity zoom effect combo is his signature. No doubt this is @velocity_edits.',
      user_id: 'editor_analysis',
      user_handle: '@editor_analysis',
      upvotes: 73,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_5',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'Been following him since 50K subs. Watched him innovate this entire editing style. 100% the OG.',
      user_id: 'og_subscriber',
      user_handle: '@og_subscriber',
      upvotes: 108,
      created_at: new Date(Date.now() - 3.9 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.9 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_6',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'He deserves so much more recognition. Half of YouTube gaming editors copied his style and got famous off it.',
      user_id: 'fair_credit',
      user_handle: '@fair_credit',
      upvotes: 142,
      created_at: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_7',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'Just checked his channel and saw the original tutorial from 6 months ago. This needs to be verified ASAP.',
      user_id: 'timestamp_checker',
      user_handle: '@timestamp_checker',
      upvotes: 64,
      created_at: new Date(Date.now() - 3.7 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.7 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_8',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'The gaming editor community knows @velocity_edits is the GOAT. Respect to everyone finding the original sources 🔥',
      user_id: 'community_respect',
      user_handle: '@community_respect',
      upvotes: 176,
      created_at: new Date(Date.now() - 3.6 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_9',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'Shoutout to AtFinder for helping credit original creators. This platform is exactly what we need!',
      user_id: 'platform_fan',
      user_handle: '@platform_fan',
      upvotes: 91,
      created_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_10',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'His After Effects project file for this style is available on his Patreon. He\'s been transparent about teaching it.',
      user_id: 'patreon_supporter',
      user_handle: '@patreon_supporter',
      upvotes: 58,
      created_at: new Date(Date.now() - 3.4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_11',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'W for finding the original. L for everyone who stole the style without credit.',
      user_id: 'community_justice',
      user_handle: '@community_justice',
      upvotes: 112,
      created_at: new Date(Date.now() - 3.3 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c_dummy3_12',
      tenantid: TENANT_ID,
      projectid: PROJECT_ID,
      target_type: 'answer',
      target_id: 'a_dummy3_1',
      content: 'Can we get this verified? There\'s enough proof here to confirm @velocity_edits as the original.',
      user_id: 'verification_request',
      user_handle: '@verification_request',
      upvotes: 83,
      created_at: new Date(Date.now() - 3.2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3.2 * 60 * 60 * 1000).toISOString()
    }
  ],

  // EXISTING COMMENTS (keep for variety)
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
