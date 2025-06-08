"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaPaperPlane,
  FaReply,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { useUserProfile } from "@/context/UserProfileContext";
import { toast } from "react-hot-toast";
import { ISerializedComment } from "@/app/types/frontend";

export default function Comments({ propertyId, initialComments = [] }: { propertyId: string | bigint, initialComments?: any[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { userProfiles } = useUserProfile();
  const [comments, setComments] = useState<ISerializedComment[]>(initialComments);
  const [commentsLikeCount, setCommentsLikeCount] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likedUsers, setLikedUsers] = useState<ISerializedComment[]>([]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserProfile = userProfiles.find(
    (profile) => profile.email === session?.user?.email
  );

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newComment.trim() || !session || !currentUserProfile) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/comments/property/${propertyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const newCommentObj = await response.json();

      // อัพเดท state ด้วยคอมเม้นใหม่
      setComments((prevComments) => [newCommentObj, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      // อาจจะเพิ่มการแสดง error message ให้ผู้ใช้เห็น
    } finally {
      setIsSubmitting(false);
    }
  };
  // ตอบกลับคอมเม้น
  const handleSubmitReply = async (commentId: string | number) => {
    if (!replyContent.trim() || !session || !currentUserProfile) return;

    try {
      const response = await fetch(
        `/api/comments/property/${propertyId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyContent,
            commentId: commentId,
            userId: currentUserProfile.id,
            propertyId: parseInt(propertyId as string),
            Likes: {
              userId: currentUserProfile.id,
              commentId: commentId,
              propertyId: parseInt(propertyId as string),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      const newReplyObj = await response.json();

      // อัพเดท state ด้วย reply ใหม่
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              commentReplies: [...(comment.commentReplies || []), newReplyObj],
            };
          }
          return comment;
        })
      );

      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error posting reply:", error);
      // อาจจะเพิ่มการแสดง error message ให้ผู้ใช้เห็น
    }
  };
  // ลบคอมเม้น
  const handleDeleteComment = async (
    commentId: string,
    isReply = false,
    parentId: string | null
  ) => {
    if (!session || !currentUserProfile) return;

    try {
      const response = await fetch(`/api/comments/property/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      if (isReply && parentId) {
        // ลบ reply
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                commentReplies: comment.commentReplies?.filter(
                  (reply) => reply.id !== commentId
                ),
              };
            }
            return comment;
          })
        );
      } else {
        // ลบคอมเม้นหลัก
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      // อาจจะเพิ่มการแสดง error message ให้ผู้ใช้เห็น
    }
  };
  // อัพเดทคอมเม้น
  // const handleUpdateComment = async (commentId, content) => {
  //   if (!session || !currentUserProfile) return;

  //   try {
  //     const response = await fetch(`/api/comments/property/${propertyId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         commentId,
  //         content,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update comment");
  //     }

  //     const updatedComment = await response.json();

  //     // อัพเดท state ด้วยคอมเม้นที่แก้ไขแล้ว
  //     setComments((prevComments) =>
  //       prevComments.map((comment) => {
  //         if (comment.id === commentId) {
  //           return updatedComment;
  //         }
  //         return comment;
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error updating comment:", error);
  //     // อาจจะเพิ่มการแสดง error message ให้ผู้ใช้เห็น
  //   }
  // };

  // โหลดคอมเม้นเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);

        // ดึงคอมเม้นทั้งหมดพร้อมข้อมูล like
        const commentsResponse = await fetch(
          `/api/comments/property/${propertyId}?includeLikes=true`
        );
        if (!commentsResponse.ok) {
          throw new Error("Failed to fetch comments");
        }
        const commentsData: ISerializedComment[] = await commentsResponse.json();

        // ตั้งค่า comments และ like counts
        setComments(commentsData);

        // ตั้งค่า like counts
        const initialLikeCounts: { [key: string]: number } = {};
        commentsData.forEach((comment) => {
          // นับไลก์ของคอมเมนต์หลัก
          initialLikeCounts[comment.id] = comment.likesCount || 0;

          // ถ้ามี replies ให้วนลูปเพื่อนับไลก์ในแต่ละ reply
          if (comment.commentReplies && comment.commentReplies.length > 0) {
            comment.commentReplies.forEach((reply) => {
              initialLikeCounts[reply.id] = reply.likesCount || 0;
            });
          }
        });

        setCommentsLikeCount(initialLikeCounts);

        // ถ้ามีการล็อกอิน ให้ดึงคอมเม้นของผู้ใช้
        if (session && currentUserProfile) {
          const userCommentsResponse = await fetch(
            `/api/comments/property/${propertyId}/user`
          );
          if (userCommentsResponse.ok) {
            const userCommentsData = await userCommentsResponse.json();

            // ตรวจสอบว่า userCommentsData มี likedCommentIds หรือไม่
            const likedCommentIds = userCommentsData.likedCommentIds || [];

            // อัพเดทสถานะ isLiked สำหรับคอมเมนต์หลักและ replies
            setComments((prevComments) =>
              prevComments.map((comment) => ({
                ...comment,
                isLiked: likedCommentIds.includes(comment.id),
                commentReplies: comment.commentReplies?.map((reply) => ({
                  ...reply,
                  isLiked: likedCommentIds.includes(reply.id),
                })),
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [propertyId, session, currentUserProfile]);

  // แสดงรายชื่อผู้ที่กดไลค์
  const handleShowLikes = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`);
      if (response.ok) {
        const data = await response.json();
        setLikedUsers(data.comment.likes);
        setShowLikesModal(true);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  // แสดงคอมเม้นและ replies
  const renderComment = (comment: ISerializedComment, isReply: boolean, parentId: string | null = null) => {
    // ตรวจสอบว่า currentUserProfile เคยกดไลค์ comment/reply นี้หรือไม่
    const isLikedByCurrentUser = isReply
      ? comment.likes?.some(like => like.userId === currentUserProfile?.id)
      : comment.likes?.some(like => like.userId === currentUserProfile?.id);

    return (
      <div key={comment.id} className="mb-4 p-2">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <img
              src={comment.user?.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-semibold">
            {comment.user?.firstName} {comment.user?.lastName}
          </span>
        </div>
        <p className="ml-10 mt-1">{comment.content}</p>
        <div className="ml-10 mt-1 flex items-center gap-2">
          <button
            onClick={() => handleLikeComment(comment.id, isReply)}
            disabled={isLoading}
            className={`flex items-center text-sm text-gray-500 hover:text-blue-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLikedByCurrentUser ? (
              <FaHeart className="mr-1 text-red-500" />
            ) : (
              <FaRegHeart className="mr-1" />
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleShowLikes(comment.id);
              }}
              className="cursor-pointer hover:underline"
            >
              {commentsLikeCount[comment.id] || 0}
            </span>
          </button>

          {!isReply && session && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
            >
              <FaReply className="mr-1" />
              Reply
            </button>
          )}
          {session && currentUserProfile?.id === comment.user?.id && (
            <button
              onClick={() => handleDeleteComment(comment.id, isReply, parentId)}
              className="flex items-center text-sm text-gray-500 hover:text-red-500"
            >
              <FaTrash className="mr-1" />
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="ml-10 mt-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {currentUserProfile?.avatar ? (
                  <div className="relative w-8 h-8">
                    <img
                      src={currentUserProfile.avatar}
                      alt={`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
                      className="w-full h-full rounded-full object-cover mr-3"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-500 font-bold">
                      {currentUserProfile?.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.user?.firstName} ${comment.user?.lastName}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-gray-600 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
                  >
                    <FaPaperPlane className="mr-1" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.commentReplies && comment.commentReplies.length > 0 && (
          <div className="ml-10 mt-2 border-l pl-4 border-gray-300">
            {comment.commentReplies.map((reply) => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    );
  };

  // กดถูกใจคอมเม้น
  const handleLikeComment = async (commentId: string, isReply = false) => {
    if (!session) return router.push("/api/auth/signin");

    try {
      setIsLoading(true);

      // ตรวจสอบว่าเป็น reply หรือไม่
      const endpoint = isReply
        ? `/api/comments/reply/${commentId}/like`
        : `/api/comments/${commentId}/like`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like comment");
      }

      const data = await response.json();

      // อัพเดทจำนวน like ใน state
      setCommentsLikeCount((prev) => ({
        ...prev,
        [commentId]: data.isLiked
          ? (prev[commentId] || 0) + 1
          : Math.max(0, (prev[commentId] || 0) - 1)
      }));

      // อัพเดทสถานะ isLiked
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (isReply) {
            // อัพเดท reply
            if (comment.commentReplies?.some(reply => reply.id === commentId)) {
              return {
                ...comment,
                commentReplies: comment.commentReplies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, isLiked: data.isLiked }
                    : reply
                ),
              };
            }
          } else {
            // อัพเดท comment หลัก
            if (comment.id === commentId) {
              return { ...comment, isLiked: data.isLiked };
            }
          }
          return comment;
        })
      );

      // แสดง toast notification
      toast.success(data.message);
    } catch (error: any) {
      console.error("Error liking comment:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการกดไลค์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {currentUserProfile?.avatar ? (
                <div className="relative w-8 h-8">
                  <img
                    src={currentUserProfile.avatar}
                    alt={`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
                    className="w-full h-full rounded-full object-cover mr-3"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-bold">
                    {currentUserProfile?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>
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
          comments.map((comment) => renderComment(comment, false))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Likes Modal */}
      {showLikesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">ผู้ที่กดไลค์</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {likedUsers.map((like) => (
                <div key={like.id} className="flex items-center gap-3">
                  <div className="relative w-8 h-8">
                    <img
                      src={like.user?.avatar}
                      alt={`${like.user?.firstName} ${like.user?.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-medium">
                    {like.user?.firstName} {like.user?.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}