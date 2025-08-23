'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter();
    const { user, isLoading, checkSession } = useSession();

    useEffect(() => {
      checkSession();
    }, [checkSession]);

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login');
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
