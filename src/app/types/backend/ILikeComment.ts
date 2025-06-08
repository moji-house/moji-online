import IComment from "./IComment";
import ICommentReply from "./ICommentReply";
import IProperty from "./IProperty";
import IUser from "./IUser";

interface ILikeComment {
  id: string | bigint;
  userId: string;
  commentId: string | bigint;
  replyId?: string | bigint;
  propertyId?: string | bigint;
  createdAt: Date | string;
  
  // Relations
  user?: IUser;
  comment?: IComment;
  reply?: ICommentReply;
  property?: IProperty;
}

export default ILikeComment;