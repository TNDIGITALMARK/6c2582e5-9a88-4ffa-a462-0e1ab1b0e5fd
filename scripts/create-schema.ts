// AtFinder Database Schema Creation
const createSchemaSQL = `
-- ============================================
-- Migration: Create AtFinder Attribution Platform Schema
-- Purpose: Build complete database for social attribution platform
-- Tables: attribution_requests, answers, votes, comments
-- ============================================

-- ============================================
-- TABLE: attribution_requests
-- Purpose: Store attribution requests (posts asking for original creator)
-- ============================================
create table if not exists public.attribution_requests (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Request content
  title text not null,
  description text,
  media_url text,
  media_type text check (media_type in ('image', 'video', 'gif', null)),
  repost_url text,

  -- Platform identification
  platform text check (platform in ('tiktok', 'instagram', 'twitter', 'youtube', 'other', null)),

  -- Status tracking
  status text default 'open' check (status in ('open', 'solved', 'closed')),
  verified_creator_handle text,
  verified boolean default false,

  -- Engagement metrics
  upvotes integer default 0,
  answer_count integer default 0,
  comment_count integer default 0,

  -- User tracking
  submitted_by text,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.attribution_requests
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade,
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.attribution_requests enable row level security;

-- RLS policies
create policy "anon_select_attribution_requests"
  on public.attribution_requests for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_attribution_requests"
  on public.attribution_requests for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_attribution_requests"
  on public.attribution_requests for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_attribution_requests"
  on public.attribution_requests for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_attribution_requests"
  on public.attribution_requests for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes
create index if not exists idx_attribution_requests_tenant_project
  on public.attribution_requests(tenantid, projectid);
create index if not exists idx_attribution_requests_status
  on public.attribution_requests(status);
create index if not exists idx_attribution_requests_created_at
  on public.attribution_requests(created_at desc);

-- Comments
comment on table public.attribution_requests is 'Attribution requests asking for original creator identification';
comment on column public.attribution_requests.tenantid is 'FK to tenants.id';
comment on column public.attribution_requests.projectid is 'FK to projects.id';


-- ============================================
-- TABLE: answers
-- Purpose: Store answers to attribution requests (claimed original creators)
-- ============================================
create table if not exists public.answers (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Reference to request
  request_id uuid not null,

  -- Answer content
  creator_handle text not null,
  creator_platform text check (creator_platform in ('tiktok', 'instagram', 'twitter', 'youtube', 'other')),
  proof_url text,
  explanation text,

  -- Verification
  is_verified boolean default false,
  verified_by text,
  verified_at timestamptz,

  -- Engagement
  upvotes integer default 0,
  comment_count integer default 0,

  -- User tracking
  submitted_by text,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.answers
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade,
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade,
  add constraint fk_request
    foreign key (request_id)
    references public.attribution_requests(id)
    on delete cascade;

-- Enable RLS
alter table public.answers enable row level security;

-- RLS policies
create policy "anon_select_answers"
  on public.answers for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_answers"
  on public.answers for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_answers"
  on public.answers for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_answers"
  on public.answers for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_answers"
  on public.answers for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes
create index if not exists idx_answers_tenant_project
  on public.answers(tenantid, projectid);
create index if not exists idx_answers_request_id
  on public.answers(request_id);
create index if not exists idx_answers_verified
  on public.answers(is_verified);
create index if not exists idx_answers_upvotes
  on public.answers(upvotes desc);

-- Comments
comment on table public.answers is 'Answers claiming original creator identification';
comment on column public.answers.tenantid is 'FK to tenants.id';
comment on column public.answers.projectid is 'FK to projects.id';


-- ============================================
-- TABLE: votes
-- Purpose: Track upvotes on requests and answers
-- ============================================
create table if not exists public.votes (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Vote target (either request or answer)
  target_type text not null check (target_type in ('request', 'answer')),
  target_id uuid not null,

  -- Vote value
  value integer default 1 check (value in (-1, 1)),

  -- User tracking
  user_id text not null,

  -- Timestamp
  created_at timestamptz default now(),

  -- Unique constraint: one vote per user per target
  unique(tenantid, projectid, target_type, target_id, user_id)
);

-- Foreign key constraints
alter table public.votes
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade,
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.votes enable row level security;

-- RLS policies
create policy "anon_select_votes"
  on public.votes for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_votes"
  on public.votes for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_votes"
  on public.votes for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_votes"
  on public.votes for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes
create index if not exists idx_votes_tenant_project
  on public.votes(tenantid, projectid);
create index if not exists idx_votes_target
  on public.votes(target_type, target_id);
create index if not exists idx_votes_user
  on public.votes(user_id);

-- Comments
comment on table public.votes is 'Upvotes on attribution requests and answers';
comment on column public.votes.tenantid is 'FK to tenants.id';
comment on column public.votes.projectid is 'FK to projects.id';


-- ============================================
-- TABLE: comments
-- Purpose: Discussion and proof for attribution answers
-- ============================================
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  tenantid text not null,
  projectid uuid not null,

  -- Comment target (either request or answer)
  target_type text not null check (target_type in ('request', 'answer')),
  target_id uuid not null,

  -- Comment content
  content text not null,

  -- User tracking
  user_id text not null,
  user_handle text,

  -- Engagement
  upvotes integer default 0,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Foreign key constraints
alter table public.comments
  add constraint fk_tenant
    foreign key (tenantid)
    references public.tenants(id)
    on delete cascade,
  add constraint fk_project
    foreign key (projectid)
    references public.projects(id)
    on delete cascade;

-- Enable RLS
alter table public.comments enable row level security;

-- RLS policies
create policy "anon_select_comments"
  on public.comments for select to anon
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_select_comments"
  on public.comments for select to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_insert_comments"
  on public.comments for insert to authenticated
  with check (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_update_comments"
  on public.comments for update to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

create policy "auth_delete_comments"
  on public.comments for delete to authenticated
  using (
    tenantid = (auth.jwt() ->> 'tenant_id')::text
    and projectid = (auth.jwt() ->> 'project_id')::uuid
  );

-- Indexes
create index if not exists idx_comments_tenant_project
  on public.comments(tenantid, projectid);
create index if not exists idx_comments_target
  on public.comments(target_type, target_id);
create index if not exists idx_comments_user
  on public.comments(user_id);
create index if not exists idx_comments_created_at
  on public.comments(created_at desc);

-- Comments
comment on table public.comments is 'Comments and discussion on attribution requests and answers';
comment on column public.comments.tenantid is 'FK to tenants.id';
comment on column public.comments.projectid is 'FK to projects.id';
`;

async function createSchema() {
  const response = await fetch('http://localhost:3006/api/supabase/migrations/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'create_atfinder_schema',
      sql: createSchemaSQL,
      autoApply: true
    })
  });

  const result = await response.json();

  console.log('=== MIGRATION RESULT ===\n');

  if (result.success) {
    console.log('✅ Migration successful!');
    console.log('   File:', result.fileName);
    console.log('   Applied:', result.applied);
    console.log('\n📋 Steps:');
    console.log('   - Create:', result.steps.create);
    console.log('   - Write:', result.steps.write);
    console.log('   - Validate:', result.steps.validate);
    console.log('   - Apply:', result.steps.apply);

    if (result.validation && result.validation.passed) {
      console.log('\n✅ Validation: PASSED');
    }
  } else {
    console.log('❌ Migration failed!');
    console.log('   Error:', result.error);

    if (result.validation && !result.validation.passed) {
      console.log('\n❌ Validation errors:');
      result.validation.errors.forEach((err: string) => {
        console.log('   -', err);
      });
    }

    console.log('\n📋 Failed at:', result.steps);
  }
}

createSchema();
