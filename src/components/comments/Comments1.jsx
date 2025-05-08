"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaTrash } from "react-icons/fa";

// เลือกใช้ useSession จริงหรือ mock version
const useSessionHook = process.env.NODE_ENV === 'development' 
  ? () => ({
      data: {
        user: {
          id: "user-123",
          name: "John Doe",
          email: "john@example.com",
          image: "https://randomuser.me/api/portraits/men/1.jpg"
        }
      }
    })
  : require("next-auth/react").useSession;

export default function Comments({ propertyId, initialComments = [] }) {
  const router = useRouter();
  
  // ใช้ hook ที่เลือกไว้
  const { data: session } = useSessionHook();
  
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !session) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock response for now
      const newCommentObj = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: session.user.id || "user-1",
          name: session.user.name || "Current User",
          image: session.user.image || "/images/placeholder.png"
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-4 bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
      
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
                rows={2}
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