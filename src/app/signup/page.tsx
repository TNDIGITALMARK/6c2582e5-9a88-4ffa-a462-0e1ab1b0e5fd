'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Signup Page - Placeholder
 *
 * Authentication backend is being redesigned.
 * This page will be updated when the new auth system is ready.
 */
export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-semibold text-center tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign up to get started with your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-6">
            <AlertDescription className="text-sm">
              Authentication is currently being redesigned. This feature will be available soon.
            </AlertDescription>
          </Alert>

          <Button asChild className="w-full h-11 font-medium">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border py-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
