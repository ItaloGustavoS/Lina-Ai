'use client';

import withAuth from '@/components/withAuth';

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your financial dashboard.</p>
    </div>
  );
};

export default withAuth(Home);
