"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaPaperPlane, FaTrash } from "react-icons/fa";

export default function CommentSection({ propertyId, initialComments = [] }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !session) return;
    
    setIsSubmitting(true);
    
    try {
      // ในสถานการณ์จริง คุณจะส่ง request ไปยัง API
      // const response = await fetch('/api/comments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ propertyId, content: newComment })
      // });
      // const data = await response.json();
      
      // Mock response for now
      const newCommentObj = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: session.user.id || "user-1",
          name: session.user.name || "Current User",
          image: session.user.image || "https://randomuser.me/api/portraits/men/1.jpg"
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!session) return;
    
    try {
      // ในสถานการณ์จริง คุณจะส่ง request ไปยัง API
      // await fetch(`/api/comments/${commentId}`, {
      //   method: 'DELETE'
      // });
      
      // Mock deletion
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      
      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-500 font-bold">
                  {session.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p>Please sign in to leave a comment</p>
          <button
            onClick={() => router.push("/api/auth/signin")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex border-b border-gray-100 pb-4">
              {comment.user?.image ? (
                <Image
                  src={comment.user.image}
                  alt={comment.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-bold">
                    {comment.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{comment.user?.name || "Anonymous"}</h4>
                  <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-1 text-gray-700">{comment.content}</p>
                
                {/* Delete button (only visible to comment author) */}
                {session && session.user?.id === comment.user?.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="mt-1 text-sm text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FaTrash className="mr-1" size={12} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
