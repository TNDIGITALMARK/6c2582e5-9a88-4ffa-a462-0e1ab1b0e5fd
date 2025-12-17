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

async function inspectTables() {
  console.log('=== TABLE STRUCTURE INSPECTION ===\n');

  const tables = ['attribution_requests', 'answers', 'votes', 'comments'];

  for (const tableName of tables) {
    console.log(`\n📋 ${tableName.toUpperCase()}`);
    console.log('─'.repeat(50));

    // Try to select one row to see structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]).join(', '));
      console.log('Sample:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('✓ Table exists but is empty');
      console.log('Trying to get column info from error...');

      // Try an insert with minimal data to get column hints
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({});

      if (insertError) {
        console.log(`Error message: ${insertError.message}`);
      }
    }
  }

  console.log('\n\n=== INSPECTION COMPLETE ===');
}

inspectTables();
