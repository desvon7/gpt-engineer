import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/services/auth';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">GPT Engineer</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 