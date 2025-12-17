/**
 * Zylo Client Types
 *
 * Placeholder types for when Supabase client is redesigned
 */

/**
 * Zylo Client configuration
 */
export interface ZyloConfig {
  controlPlaneUrl: string;
  signedAppContext?: string;
  tenantId?: string;
  projectId?: string;
}

/**
 * Internal client state
 */
export interface ZyloClientState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Auth user placeholder
 */
export interface AuthUser {
  id: string;
  email?: string;
  [key: string]: any;
}

/**
 * React context value
 */
export interface ZyloContextValue {
  client: any;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
}
