import React from 'react';

const Header = ({ mode, setMode, currentUser, setCurrentUser }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Healthcare AR Follow-up Tool</h1>
          <div className="flex items-center space-x-4">
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="admin">Admin Mode</option>
              <option value="user">User Mode</option>
            </select>
            {mode === 'user' && (
              <select 
                value={currentUser} 
                onChange={(e) => setCurrentUser(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
                <option value="user3">User 3</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
