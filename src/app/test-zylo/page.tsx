'use client';

import { useZylo, useZyloLoading, useZyloReady } from '@/lib/zylo/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Zylo Client Test Page - Placeholder
 *
 * Authentication backend is being redesigned.
 * This page shows the current stub client status.
 */
export default function TestZyloPage() {
  const client = useZylo();
  const isLoading = useZyloLoading();
  const isReady = useZyloReady();

  const config = client.getConfig();

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Zylo Client Test Dashboard</h1>

      <Alert className="mb-6">
        <AlertDescription>
          Authentication backend is being redesigned. The Zylo client is currently in stub mode.
        </AlertDescription>
      </Alert>

      {/* Client Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Client Status</CardTitle>
          <CardDescription>Current Zylo client state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Loading:</span>
            <Badge variant={isLoading ? 'secondary' : 'default'}>
              {isLoading ? 'Yes' : 'No'}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">Ready:</span>
            <Badge variant={isReady ? 'default' : 'secondary'}>
              {isReady ? 'Yes' : 'No'}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">Mode:</span>
            <Badge variant="outline">Stub (Backend Pending)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Environment configuration (from .env)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-medium">Control Plane URL:</span>
            <code className="block mt-1 p-2 bg-muted rounded text-xs">
              {config.controlPlaneUrl || '(not configured)'}
            </code>
          </div>

          <div>
            <span className="font-medium">Tenant ID:</span>
            <code className="block mt-1 p-2 bg-muted rounded text-xs">
              {config.tenantId || '(not configured)'}
            </code>
          </div>

          <div>
            <span className="font-medium">Project ID:</span>
            <code className="block mt-1 p-2 bg-muted rounded text-xs">
              {config.projectId || '(not configured)'}
            </code>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">Has Signed Context:</span>
            <Badge variant={config.signedAppContext ? 'default' : 'outline'}>
              {config.signedAppContext ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Full configuration object</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
