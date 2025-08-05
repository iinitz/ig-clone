'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';

console.log("PostPage component rendering"); // Added for debugging

interface Comment {
  id: number;
  content: string;
  author: { username: string };
  parentId?: number;
  replies?: Comment[];
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

const CommentItem = ({ comment, postId, user, onCommentAdded }: { comment: Comment; postId: string | string[]; user: any; onCommentAdded: () => void }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ content: replyContent, parentId: comment.id }),
      });
      if (res.ok) {
        setReplyContent('');
        setShowReplyInput(false);
        onCommentAdded(); // Trigger re-fetch of comments
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mb-2 ml-4 border-l pl-2">
      <span className="font-bold">{comment.author.username}</span> {comment.content}
      <button onClick={() => setShowReplyInput(!showReplyInput)} className="ml-2 text-blue-500 text-sm">
        {showReplyInput ? 'Cancel' : 'Reply'}
      </button>
      {showReplyInput && (
        <form onSubmit={handleReplySubmit} className="mt-2 flex">
          <input
            type="text"
            placeholder={`Reply to ${comment.author.username}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-1 border rounded-l-md text-sm"
          />
          <button type="submit" className="bg-blue-500 text-white p-1 rounded-r-md text-sm">Post</button>
        </form>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} user={user} onCommentAdded={onCommentAdded} />
      ))}
    </div>
  );
};

export default function PostPage() {
  const { user, isAuthReady } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const params = useParams();
  const { id } = params;
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [user, isAuthReady, router]);

  useEffect(() => {
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
        setComment('');
        fetchPost(); // Re-fetch comments to include the new one
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

  if (!isAuthReady) return null; // Render nothing until auth state is determined
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
            {post.comments.filter(c => !c.parentId).map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={id} user={user} onCommentAdded={fetchPost} />
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