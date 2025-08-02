import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Lina AI</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Dashboard</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Transactions</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Accounts</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Categories</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Goals</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
