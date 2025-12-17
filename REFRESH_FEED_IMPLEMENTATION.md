# Feed Refresh Implementation

## Overview

The main feed now fetches the latest posts from the Supabase database on every page refresh or pull-to-refresh action. New posts appear at the top based on creation time or popularity.

## Features Implemented

### 1. Database Integration
- **Supabase Queries Module** (`src/lib/supabase/queries.ts`)
  - `getAttributionRequests()` - Fetch posts with sorting (recent/popular)
  - `getAttributionRequestsByStatus()` - Filter by open/solved status
  - `getAttributionRequestById()` - Fetch single post
  - `getAnswersForRequest()` - Fetch answers for a post
  - `getCommentsForTarget()` - Fetch comments
  - `createAttributionRequest()` - Create new post
  - `updateRequestUpvote()` - Update upvote counts

### 2. Refresh-Based Updates
- **Page Refresh**: Automatically fetches latest posts on every page load
- **Manual Refresh Button**: Top-right refresh icon triggers data reload
- **Pull-to-Refresh**: Mobile-friendly pull gesture to refresh feed
  - Visual feedback with rotating icon
  - 80px pull threshold
  - Smooth animation and haptic feel

### 3. Sorting & Filtering
- **Sort Options**:
  - **Recent** (default): Posts ordered by `created_at` descending
  - **Popular**: Posts ordered by `upvotes` descending

- **Filter Options**:
  - **All** (default): Shows all posts
  - **Solved**: Only posts with verified creators
  - **Open**: Only posts still looking for attribution

### 4. Loading States
- Initial load: Full-screen spinner
- Refresh: Spinning refresh icon in header
- Pull-to-refresh: Rotating icon that follows pull distance
- Error handling: Friendly error messages with retry option
- Empty states: Clear messaging when no posts match filters

## User Experience

### Desktop/Laptop
1. **Initial Load**: Posts load automatically sorted by most recent
2. **Refresh Button**: Click the refresh icon in the header to get latest posts
3. **Filter/Sort**: Click any filter or sort button to change view (auto-refreshes)

### Mobile/Touch Devices
1. **Initial Load**: Posts load automatically
2. **Pull-to-Refresh**:
   - Pull down from the top of the feed
   - Watch the refresh icon rotate as you pull
   - Release when threshold reached to trigger refresh
3. **Tap Refresh**: Tap the refresh icon in header
4. **Filter/Sort**: Tap any filter button to change view

## Technical Details

### Data Flow
```
User Action → fetchRequests() → Supabase Query → RLS Filter → Sort/Filter → Update State → Render
```

### RLS (Row Level Security)
- All queries automatically filtered by tenant and project
- Users only see posts from their tenant/project scope
- No manual WHERE clauses needed

### Performance
- Queries optimized with proper indexes
- Pagination ready (20 posts per page)
- Efficient re-fetching on filter/sort changes
- No auto-inserting posts while scrolling (stable experience)

## Database Schema

The feed uses the `attribution_requests` table:

```sql
attribution_requests (
  id uuid PRIMARY KEY,
  tenantid text NOT NULL,
  projectid uuid NOT NULL,
  title text NOT NULL,
  description text,
  media_url text,
  media_type text, -- 'image' | 'video' | 'gif'
  repost_url text,
  platform text, -- 'tiktok' | 'instagram' | 'twitter' | 'youtube' | 'other'
  status text, -- 'open' | 'solved' | 'closed'
  verified_creator_handle text,
  verified boolean,
  upvotes integer,
  answer_count integer,
  comment_count integer,
  submitted_by text,
  created_at timestamptz,
  updated_at timestamptz
)
```

## Seeding Test Data

To populate the database with sample posts for testing:

```bash
npx tsx scripts/seed-attribution-requests.ts
```

This will insert 5 sample attribution requests into your database.

## Files Modified

### New Files
- `src/lib/supabase/queries.ts` - Database query functions
- `scripts/seed-attribution-requests.ts` - Data seeding script
- `REFRESH_FEED_IMPLEMENTATION.md` - This documentation

### Modified Files
- `src/app/page.tsx` - Main feed component with refresh logic
- `package.json` - Added `@supabase/supabase-js` dependency

## Testing the Implementation

1. **Page Refresh**: Reload the browser - posts should fetch from database
2. **Manual Refresh**: Click refresh icon - loading indicator should appear
3. **Pull-to-Refresh** (mobile): Pull down from top - icon should rotate
4. **Sort/Filter**: Click buttons - data should re-fetch with new criteria
5. **Empty State**: Filter to a category with no posts - should show empty message

## Future Enhancements (Not Implemented)

These features are ready for future implementation:
- **Pagination**: "Load More" button structure is in place
- **Infinite Scroll**: Can be added using Intersection Observer
- **Real-time Updates**: Supabase subscriptions can be added for live updates
- **Optimistic Updates**: Can add optimistic upvote handling
- **Caching**: React Query can be integrated for better caching

## Notes

- **No Live Auto-Insert**: Posts do not automatically insert while scrolling
- **Refresh-Based**: All updates happen on explicit refresh actions
- **MVP Focus**: Simple, reliable, user-controlled updates
- **Mobile-First**: Pull-to-refresh provides native app feel
