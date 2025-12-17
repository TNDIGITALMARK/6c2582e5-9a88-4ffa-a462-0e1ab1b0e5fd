import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hfndfmtxhqvubnfiwzlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbmRmbXR4aHF2dWJuZml3emx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk4MDgsImV4cCI6MjA3NjIwNTgwOH0.n0NK_Ov03-UbDQYr5mio3ggYa5XTN-XI1kB6X81N4nA',
  {
    global: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYW5vbiIsInRlbmFudF9pZCI6IlUxSUtSTWhpTFFiN3hTckdHWlJTcTdGT2tIVzIiLCJwcm9qZWN0X2lkIjoiNmMyNTgyZTUtOWE4OC00ZmZhLWE0NjItMGUxYWIxYjBlNWZkIiwianRpIjoiMzc5NmFlYmQtYzJkMi00NzQxLWJhM2YtMjAyNjE4ODUwNjMzIiwiaWF0IjoxNzY1OTM4OTk3LCJleHAiOjE3NjU5NDE2OTd9.bKXy1Y0wGcmE6QAbbSHj9gNOSg2rxgeoldTI1voi4mU`
      }
    }
  }
);

async function exploreSchema() {
  console.log('=== DATABASE SCHEMA EXPLORATION ===\n');

  // Check for common table names
  const tablesToCheck = ['attribution_requests', 'attributions', 'posts', 'answers', 'votes', 'comments', 'users', 'profiles'];

  for (const tableName of tablesToCheck) {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${tableName}: exists (${count} rows)`);
    } else {
      console.log(`❌ ${tableName}: does not exist`);
    }
  }

  console.log('\n=== EXPLORATION COMPLETE ===');
}

exploreSchema();
