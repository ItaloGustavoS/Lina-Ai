import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Lina AI</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/dashboard">
              <a className="block p-2 rounded hover:bg-gray-700">Dashboard</a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/transactions">
              <a className="block p-2 rounded hover:bg-gray-700">Transactions</a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/accounts">
              <a className="block p-2 rounded hover:bg-gray-700">Accounts</a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/categories">
              <a className="block p-2 rounded hover:bg-gray-700">Categories</a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/history">
              <a className="block p-2 rounded hover:bg-gray-700">History</a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
