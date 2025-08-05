'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Home, PlusSquare, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-semibold">Instagram</h1>
        </Link>
        <nav>
          {user ? (
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/">
                  <Home className="text-2xl" />
                </Link>
              </li>
              <li>
                <Link href="/posts/create">
                  <PlusSquare className="text-2xl" />
                </Link>
              </li>
              <li>
                <Link href={`/users/${user.username}`}>
                  <User className="text-2xl" />
                </Link>
              </li>
              <li>
                <button onClick={logout} className="text-sm text-gray-500">Logout</button>
              </li>
            </ul>
          ) : (
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}