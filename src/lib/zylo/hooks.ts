'use client';

import { useContext } from 'react';
import { ZyloContext } from './provider';
import { ZyloClient } from './client';

/**
 * Hook to access the Zylo Client instance
 *
 * @throws Error if used outside ZyloProvider
 */
export function useZylo(): ZyloClient {
  const context = useContext(ZyloContext);
  if (!context) {
    throw new Error('useZylo must be used within ZyloProvider');
  }
  return context.client;
}

/**
 * Hook to access authentication methods
 *
 * Note: These are currently stubs - backend is being redesigned
 */
export function useAuth() {
  const client = useZylo();
  return {
    signUp: client.signUp.bind(client),
    login: client.login.bind(client),
    logout: client.logout.bind(client),
    isAuthenticated: client.isAuthenticated.bind(client),
    getCurrentUser: client.getCurrentUser.bind(client),
  };
}

/**
 * Hook to access loading state
 */
export function useZyloLoading(): boolean {
  const context = useContext(ZyloContext);
  if (!context) {
    throw new Error('useZyloLoading must be used within ZyloProvider');
  }
  return context.isLoading;
}

/**
 * Hook to check if Zylo is ready
 */
export function useZyloReady(): boolean {
  const context = useContext(ZyloContext);
  if (!context) {
    throw new Error('useZyloReady must be used within ZyloProvider');
  }
  return context.isReady;
}
