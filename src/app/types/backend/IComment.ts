import ICommentReply from "./ICommentReply";
import ILikeComment from "./ILikeComment";
import IProperty from "./IProperty";
import IUser from "./IUser";

interface IComment {
  id: string | bigint;
  content: string;
  userId: string;
  propertyId: string | bigint;
  parentId?: string | bigint;
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Relations
  user?: IUser;
  property?: IProperty;
  likes?: ILikeComment[];
  replies?: IComment[];
  commentReplies?: ICommentReply[];
  parent?: IComment;
  
  // UI-specific fields
  likesCount?: number;
  isLiked?: boolean;
}

export default IComment;