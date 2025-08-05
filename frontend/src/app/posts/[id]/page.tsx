'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  author: { username: string };
}

interface Like {
  id: number;
  userId: number;
}

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  author: { username: string };
  comments: Comment[];
  likes: Like[];
}

export default function PostPage() {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const params = useParams();
  const { id } = params;
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          if (user) {
            setIsLiked(data.likes.some((like: Like) => like.userId === user.userId));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id && user) {
      fetchPost();
    }
  }, [id, user]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ content: comment }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setPost((prevPost) => prevPost ? { ...prevPost, comments: [...prevPost.comments, newComment] } : null);
        setComment('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${id}/likes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        setIsLiked(!isLiked);
        setPost((prevPost) => {
          if (!prevPost) return null;
          const updatedLikes = isLiked
            ? prevPost.likes.filter((like) => like.userId !== user?.userId)
            : [...prevPost.likes, { id: Date.now(), userId: user?.userId || 0 }];
          return { ...prevPost, likes: updatedLikes };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user || !post) return null; // Render nothing if not authenticated or post not loaded, redirect will handle it

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg flex">
        <div className="w-1/2">
          <img src={`http://localhost:3001/${post.imageUrl}`} alt={post.caption} className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex items-center mb-4">
            <p className="font-bold">{post.author.username}</p>
          </div>
          <div className="flex-grow overflow-y-auto">
            <p className="mb-4"><span className="font-bold">{post.author.username}</span> {post.caption}</p>
            {post.comments.map((comment) => (
              <div key={comment.id} className="mb-2">
                <span className="font-bold">{comment.author.username}</span> {comment.content}
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center space-x-4 mb-2">
              {isLiked ? (
                <Heart className="text-2xl cursor-pointer fill-red-500 text-red-500" onClick={handleLike} />
              ) : (
                <Heart className="text-2xl cursor-pointer" onClick={handleLike} />
              )}
            </div>
            <p className="font-bold">{post.likes.length} likes</p>
            <form onSubmit={handleCommentSubmit} className="mt-4 flex">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-l-md"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
