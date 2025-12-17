import { supabase, TENANT_ID, PROJECT_ID } from './client';
import type { AttributionRequest, Answer, Comment } from './types';

/**
 * Fetch attribution requests with sorting options
 * @param sortBy - 'recent' (creation time) or 'popular' (upvotes)
 * @param limit - Number of requests to fetch
 * @param offset - Pagination offset
 */
export async function getAttributionRequests(
  sortBy: 'recent' | 'popular' = 'recent',
  limit: number = 20,
  offset: number = 0
): Promise<{ data: AttributionRequest[]; error: Error | null; count: number | null }> {
  try {
    let query = supabase
      .from('attribution_requests')
      .select('*', { count: 'exact' });

    // Apply sorting
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('upvotes', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching attribution requests:', error);
      return { data: [], error: new Error(error.message), count: null };
    }

    return { data: data as AttributionRequest[], error: null, count };
  } catch (err) {
    console.error('Unexpected error fetching attribution requests:', err);
    return {
      data: [],
      error: err instanceof Error ? err : new Error('Unknown error'),
      count: null
    };
  }
}

/**
 * Fetch attribution requests filtered by status
 */
export async function getAttributionRequestsByStatus(
  status: 'open' | 'solved' | 'closed',
  sortBy: 'recent' | 'popular' = 'recent',
  limit: number = 20,
  offset: number = 0
): Promise<{ data: AttributionRequest[]; error: Error | null }> {
  try {
    let query = supabase
      .from('attribution_requests')
      .select('*')
      .eq('status', status);

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('upvotes', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching requests by status:', error);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data as AttributionRequest[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching requests by status:', err);
    return {
      data: [],
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

/**
 * Fetch a single attribution request by ID
 */
export async function getAttributionRequestById(
  id: string
): Promise<{ data: AttributionRequest | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('attribution_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching request:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AttributionRequest, error: null };
  } catch (err) {
    console.error('Unexpected error fetching request:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

/**
 * Fetch answers for a specific attribution request
 */
export async function getAnswersForRequest(
  requestId: string
): Promise<{ data: Answer[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('request_id', requestId)
      .order('upvotes', { ascending: false });

    if (error) {
      console.error('Error fetching answers:', error);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data as Answer[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching answers:', err);
    return {
      data: [],
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

/**
 * Fetch comments for a specific target (request or answer)
 */
export async function getCommentsForTarget(
  targetType: 'request' | 'answer',
  targetId: string
): Promise<{ data: Comment[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return { data: [], error: new Error(error.message) };
    }

    return { data: data as Comment[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching comments:', err);
    return {
      data: [],
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

/**
 * Create a new attribution request
 */
export async function createAttributionRequest(
  request: Omit<AttributionRequest, 'id' | 'tenantid' | 'projectid' | 'created_at' | 'updated_at' | 'upvotes' | 'answer_count' | 'comment_count'>
): Promise<{ data: AttributionRequest | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('attribution_requests')
      .insert({
        ...request,
        tenantid: TENANT_ID,
        projectid: PROJECT_ID,
        upvotes: 0,
        answer_count: 0,
        comment_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AttributionRequest, error: null };
  } catch (err) {
    console.error('Unexpected error creating request:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}

/**
 * Update upvote count for a request (optimistic update)
 */
export async function updateRequestUpvote(
  requestId: string,
  increment: number
): Promise<{ data: AttributionRequest | null; error: Error | null }> {
  try {
    // Fetch current upvote count
    const { data: current, error: fetchError } = await supabase
      .from('attribution_requests')
      .select('upvotes')
      .eq('id', requestId)
      .single();

    if (fetchError) {
      console.error('Error fetching current upvotes:', fetchError);
      return { data: null, error: new Error(fetchError.message) };
    }

    // Update with new count
    const { data, error } = await supabase
      .from('attribution_requests')
      .update({
        upvotes: Math.max(0, (current.upvotes || 0) + increment),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating upvotes:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AttributionRequest, error: null };
  } catch (err) {
    console.error('Unexpected error updating upvotes:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    };
  }
}
