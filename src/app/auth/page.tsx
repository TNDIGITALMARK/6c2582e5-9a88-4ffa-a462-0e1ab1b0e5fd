'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Combined Authentication Page - Placeholder
 *
 * Authentication backend is being redesigned.
 * This page will be updated when the new auth system is ready.
 */
export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-semibold text-center tracking-tight">
            Welcome
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <Alert className="mb-6">
                <AlertDescription className="text-sm">
                  Authentication is currently being redesigned. This feature will be available soon.
                </AlertDescription>
              </Alert>

              <Button asChild className="w-full h-11 font-medium">
                <Link href="/">Return to Home</Link>
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <Alert className="mb-6">
                <AlertDescription className="text-sm">
                  Authentication is currently being redesigned. This feature will be available soon.
                </AlertDescription>
              </Alert>

              <Button asChild className="w-full h-11 font-medium">
                <Link href="/">Return to Home</Link>
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
