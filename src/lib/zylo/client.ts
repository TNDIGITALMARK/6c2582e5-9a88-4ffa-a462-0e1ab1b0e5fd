import { ZyloConfig } from './types';

/**
 * Zylo Client - Placeholder
 *
 * Supabase integration has been removed.
 * This is a stub client that will be redesigned for the new backend.
 *
 * TODO: Implement new backend client when ready
 */
export class ZyloClient {
  private config: ZyloConfig;

  constructor(config: ZyloConfig) {
    this.config = config;
  }

  /**
   * Boot the client - placeholder
   */
  async boot(): Promise<void> {
    console.log('🚀 Zylo Client: Booting (stub mode - no backend configured)');

    if (!this.config.controlPlaneUrl) {
      console.log('⚠️ Zylo Client: No control plane URL configured');
    }

    // Stub - no actual initialization
    console.log('✅ Zylo Client: Ready (stub mode)');
  }

  /**
   * Sign up - placeholder
   */
  async signUp(
    _email: string,
    _password: string,
    _userData?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    console.warn('⚠️ Zylo Client: signUp() not implemented - backend redesign pending');
    throw new Error('Authentication not available - backend is being redesigned');
  }

  /**
   * Login - placeholder
   */
  async login(_email: string, _password: string): Promise<void> {
    console.warn('⚠️ Zylo Client: login() not implemented - backend redesign pending');
    throw new Error('Authentication not available - backend is being redesigned');
  }

  /**
   * Logout - placeholder
   */
  async logout(): Promise<void> {
    console.warn('⚠️ Zylo Client: logout() not implemented - backend redesign pending');
  }

  /**
   * Check if user is authenticated - placeholder
   */
  async isAuthenticated(): Promise<boolean> {
    return false;
  }

  /**
   * Get current user - placeholder
   */
  async getCurrentUser(): Promise<null> {
    return null;
  }

  /**
   * Get config
   */
  getConfig(): ZyloConfig {
    return this.config;
  }

  /**
   * Cleanup - placeholder
   */
  cleanup(): void {
    // Nothing to clean up in stub mode
  }
}
