'use client';

import { AtFinderHeader } from '@/components/atfinder/header';
import { AttributionForm } from '@/components/atfinder/attribution-form';

export default function AskPage() {
  return (
    <div className="min-h-screen bg-background">
      <AtFinderHeader />

      <main className="container-centered py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Ask for an @
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Submit a repost or viral content and let the community help you find the original creator.
            Proper attribution matters.
          </p>
        </div>

        {/* Attribution Form */}
        <AttributionForm />

        {/* How It Works Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Submit</h3>
              <p className="text-sm text-muted-foreground">
                Share the link or upload the media you want to attribute
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Helps</h3>
              <p className="text-sm text-muted-foreground">
                Others identify the original creator and provide proof
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Get Verified</h3>
              <p className="text-sm text-muted-foreground">
                Upvoted answers become verified, giving proper credit
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
