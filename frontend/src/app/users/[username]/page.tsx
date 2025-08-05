'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  posts: Array<{ id: number; imageUrl: string; caption: string }>;
}

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const params = useParams();
  const { username } = params;
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [user, isAuthReady, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (username && user) {
      fetchUserProfile();
    }
  }, [username, user]);

  if (!isAuthReady) return null; // Render nothing until auth state is determined
  if (!user || !userProfile) return null; // Render nothing if not authenticated or profile not loaded, redirect will handle it

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold mr-8">
          {userProfile.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{userProfile.username}</h1>
          <p className="text-gray-600">{userProfile.email}</p>
          <p className="mt-2 text-lg font-semibold">{userProfile.posts.length} posts</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {userProfile.posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Image 
              src={`http://localhost:3001/${post.imageUrl}`} 
              alt={post.caption} 
              width={300} // Adjust based on your design needs
              height={300} // Adjust based on your design needs
              className="w-full h-48 object-cover" 
            />
          </Link>
        ))}
      </div>
    </div>
  );
}