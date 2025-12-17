import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration with scoped authentication
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SCOPED_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IlUxSUtSTWhpTFFiN3hTckdHWlJTcTdGT2tIVzIiLCJwcm9qZWN0X2lkIjoiNmMyNTgyZTUtOWE4OC00ZmZhLWE0NjItMGUxYWIxYjBlNWZkIiwianRpIjoiMzc5NmFlYmQtYzJkMi00NzQxLWJhM2YtMjAyNjE4ODUwNjMzIiwiaWF0IjoxNzY1OTM4OTk3LCJleHAiOjE3NjU5NDE2OTd9.bKXy1Y0wGcmE6QAbbSHj9gNOSg2rxgeoldTI1voi4mU'}`
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// Tenant and Project IDs (automatically scoped via JWT)
export const TENANT_ID = 'U1IKRMhiLQb7xSrGGZRSq7FOkHW2';
export const PROJECT_ID = '6c2582e5-9a88-4ffa-a462-0e1ab1b0e5fd';
