import { ZyloConfig } from './types';

/**
 * Loads Zylo Client configuration from environment variables
 *
 * Note: Supabase configuration has been removed.
 * Backend/auth will be redesigned separately.
 */
export function getZyloConfig(): ZyloConfig {
  const config: ZyloConfig = {
    controlPlaneUrl: process.env.NEXT_PUBLIC_CONTROL_PLANE_API_URL || '',
    signedAppContext: process.env.NEXT_PUBLIC_SIGNED_APP_CONTEXT,
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  };

  // Note: Configuration is optional during template phase
  // Will be injected at deployment time

  return config;
}

/**
 * Debug utility to log configuration
 */
export function debugConfig(config: ZyloConfig): void {
  console.log('[Zylo Config]', {
    controlPlaneUrl: config.controlPlaneUrl || '(not configured)',
    hasSignedContext: !!config.signedAppContext,
    tenantId: config.tenantId || '(not configured)',
    projectId: config.projectId || '(not configured)',
  });
}
