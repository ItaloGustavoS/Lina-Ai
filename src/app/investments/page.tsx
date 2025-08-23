'use client';

import InvestmentForm from '@/components/InvestmentForm';
import InvestmentList from '@/components/InvestmentList';
import withAuth from '@/components/withAuth';
import withPageTransitions from '@/components/withPageTransitions';

const InvestmentsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investments</h1>
      <InvestmentForm />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Investments</h2>
        <InvestmentList />
      </div>
    </div>
  );
};

export default withAuth(withPageTransitions(InvestmentsPage));
