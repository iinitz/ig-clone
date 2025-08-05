'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  author: { username: string };
  createdAt: string;
  likes: Array<{ userId: number }>;
  comments: any[];
}

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleLike = async (postId: number, isCurrentlyLiked: boolean) => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const updatedLikes = isCurrentlyLiked
                ? post.likes.filter((like) => like.userId !== user?.userId)
                : [...post.likes, { userId: user?.userId || 0 }];
              return { ...post, likes: updatedLikes };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {user ? (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = post.likes.some((like) => like.userId === user.userId);
            return (
              <div key={post.id} className="bg-white border rounded-lg">
                <div className="p-4 flex items-center">
                  <p className="font-bold">{post.author.username}</p>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <Image 
                    src={`http://localhost:3001/${post.imageUrl}`} 
                    alt={post.caption} 
                    width={500} // Adjust based on your design needs
                    height={500} // Adjust based on your design needs
                    className="w-full" 
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-2">
                    {isLiked ? (
                      <Heart
                        className="text-2xl cursor-pointer fill-red-500 text-red-500"
                        onClick={() => handleLike(post.id, isLiked)}
                      />
                    ) : (
                      <Heart
                        className="text-2xl cursor-pointer"
                        onClick={() => handleLike(post.id, isLiked)}
                      />
                    )}
                    <Link href={`/posts/${post.id}`}>
                      <MessageCircle className="text-2xl cursor-pointer" />
                    </Link>
                  </div>
                  <p className="font-bold">{post.likes.length} likes</p>
                  <p><span className="font-bold">{post.author.username}</span> {post.caption}</p>
                  <Link href={`/posts/${post.id}`} className="text-gray-500">
                    View all {post.comments.length} comments
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl">Please login to continue</h1>
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}