'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string | null | undefined;
}

const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="p-3 mb-4 bg-red-500/20 text-red-400 rounded-md flex items-center">
      <AlertCircle className="h-5 w-5 mr-3" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorBanner;