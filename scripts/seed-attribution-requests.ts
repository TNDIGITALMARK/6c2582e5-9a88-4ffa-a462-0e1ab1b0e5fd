#!/usr/bin/env tsx
/**
 * Seed attribution requests into the database
 * This script populates the database with sample data for testing
 */

import { createClient } from '@supabase/supabase-js';

const TENANT_ID = 'U1IKRMhiLQb7xSrGGZRSq7FOkHW2';
const PROJECT_ID = '6c2582e5-9a88-4ffa-a462-0e1ab1b0e5fd';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IlUxSUtSTWhpTFFiN3hTckdHWlJTcTdGT2tIVzIiLCJwcm9qZWN0X2lkIjoiNmMyNTgyZTUtOWE4OC00ZmZhLWE0NjItMGUxYWIxYjBlNWZkIiwianRpIjoiZGY1MTdmMzgtMmU2MC00NTQzLThiMGItM2QyMGUzYmI3ZTU2IiwiaWF0IjoxNzY1OTQ2MDAzLCJleHAiOjE3NjU5NDg3MDN9.fWaq0xlIMHfen8rnMYedSMIeXXfbNoWjIX9bolizVYA'
      }
    }
  }
);

const sampleRequests = [
  {
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Who started this dance trend?',
    description: 'This dance has been going viral on TikTok for weeks. I\'ve seen hundreds of people doing it but can\'t find the original creator. Does anyone know who started it?',
    media_url: 'https://images.unsplash.com/photo-1547153760-18fc9b232b96?w=400&h=400&fit=crop',
    media_type: 'video' as const,
    repost_url: 'https://tiktok.com/@dancer123/video/123456',
    platform: 'tiktok' as const,
    status: 'solved' as const,
    verified_creator_handle: '@jalaiah_harmon',
    verified: true,
    upvotes: 47,
    answer_count: 3,
    comment_count: 12,
    submitted_by: 'user_sarah_creates'
  },
  {
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Need to credit this artist properly',
    description: 'Found this amazing meme template being used everywhere. Want to make sure I credit the original artist before using it in my content.',
    media_url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop',
    media_type: 'image' as const,
    repost_url: null,
    platform: 'instagram' as const,
    status: 'open' as const,
    verified_creator_handle: null,
    verified: false,
    upvotes: 23,
    answer_count: 2,
    comment_count: 8,
    submitted_by: 'user_content_hunter'
  },
  {
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Looking for original creator for partnership',
    description: 'This video format has incredible engagement. Our brand wants to partner with the original creator. Anyone know who started this trend?',
    media_url: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=400&h=400&fit=crop',
    media_type: 'video' as const,
    repost_url: 'https://youtube.com/shorts/abc123',
    platform: 'youtube' as const,
    status: 'solved' as const,
    verified_creator_handle: '@original_creator',
    verified: true,
    upvotes: 89,
    answer_count: 5,
    comment_count: 31,
    submitted_by: 'user_brand_manager'
  },
  {
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'This sound is everywhere - who made it?',
    description: 'Hearing this audio clip in every other video now. Would love to find the original so I can support them!',
    media_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    media_type: 'video' as const,
    repost_url: null,
    platform: 'tiktok' as const,
    status: 'open' as const,
    verified_creator_handle: null,
    verified: false,
    upvotes: 15,
    answer_count: 1,
    comment_count: 4,
    submitted_by: 'user_music_lover'
  },
  {
    tenantid: TENANT_ID,
    projectid: PROJECT_ID,
    title: 'Recipe video going viral - original chef?',
    description: 'This cooking technique has been reposted thousands of times. I want to properly credit the chef who created it.',
    media_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
    media_type: 'video' as const,
    repost_url: 'https://instagram.com/reel/xyz789',
    platform: 'instagram' as const,
    status: 'open' as const,
    verified_creator_handle: null,
    verified: false,
    upvotes: 34,
    answer_count: 2,
    comment_count: 9,
    submitted_by: 'user_foodie_fan'
  }
];

async function seedData() {
  console.log('🌱 Seeding attribution requests...\n');

  try {
    // Check if table exists by attempting a simple query
    console.log('Checking database connection...');
    const { error: testError } = await supabase
      .from('attribution_requests')
      .select('id', { count: 'exact', head: true });

    if (testError) {
      console.error('❌ Database error:', testError.message);
      console.error('\n⚠️  The attribution_requests table may not exist yet.');
      console.error('   Please create the table using the migration system first.');
      process.exit(1);
    }

    console.log('✅ Database connection successful\n');

    // Insert sample data
    console.log(`Inserting ${sampleRequests.length} sample requests...`);
    const { data, error } = await supabase
      .from('attribution_requests')
      .insert(sampleRequests)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      console.error('\nDetails:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} requests\n`);
    console.log('Sample data:');
    data?.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.title} (${req.upvotes} upvotes)`);
    });

    console.log('\n✨ Seeding complete!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seedData();
