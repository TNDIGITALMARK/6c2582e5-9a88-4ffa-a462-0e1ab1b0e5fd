'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Link as LinkIcon } from 'lucide-react';

export function AttributionForm() {
  const [linkMode, setLinkMode] = useState(true);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Reset form
    setUrl('');
    setDescription('');
    setIsSubmitting(false);

    alert('Attribution request submitted! (Demo mode)');
  };

  const charCount = description.length;
  const maxChars = 280;

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Ask for Original Creator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLinkMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              linkMode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Paste Link
          </button>
          <button
            type="button"
            onClick={() => setLinkMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !linkMode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        {/* URL Input or File Upload */}
        {linkMode ? (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
              Repost Link
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tiktok.com/@user/video/..."
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Media
            </label>
            <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF or MP4 up to 10MB
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Description/Question */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Your Question (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
            placeholder="Who is the original creator? Any context helps..."
            rows={4}
            maxLength={maxChars}
            className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount} / {maxChars}
            </span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
          <p className="mb-1">
            <strong className="text-foreground">Public Visibility:</strong> Your request will be visible to everyone
          </p>
          <p>
            <strong className="text-foreground">Login Required:</strong> Only for submitting requests and voting
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || (!linkMode && !url)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 h-auto rounded-lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </Button>
      </form>
    </div>
  );
}
