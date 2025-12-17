'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { ZyloClient } from './client';
import { getZyloConfig } from './config';
import { ZyloContextValue } from './types';

export const ZyloContext = createContext<ZyloContextValue | null>(null);

interface ZyloProviderProps {
  children: ReactNode;
}

/**
 * Zylo Provider - Initializes and provides Zylo Client to the app
 *
 * Note: Supabase integration has been removed.
 * This provider now boots a stub client while backend is being redesigned.
 */
export function ZyloProvider({ children }: ZyloProviderProps) {
  const [client] = useState(() => {
    const config = getZyloConfig();
    return new ZyloClient(config);
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Boot the client on mount
    client
      .boot()
      .then(() => {
        setIsReady(true);
        setIsLoading(false);
        console.log('✅ Zylo Provider: Client ready');
      })
      .catch((err) => {
        console.error('❌ Zylo Provider: Boot failed', err);
        setError(err);
        setIsLoading(false);
      });

    // Cleanup on unmount
    return () => {
      client.cleanup();
    };
  }, [client]);

  // Provide client to children (no error state blocking - let app render)
  return (
    <ZyloContext.Provider value={{ client, isLoading, error, isReady }}>
      {children}
    </ZyloContext.Provider>
  );
}
