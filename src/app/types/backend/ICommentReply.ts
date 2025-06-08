import IComment from "./IComment";
import ILike from "./ILike";
import ILikeComment from "./ILikeComment";
import IProperty from "./IProperty";
import IUser from "./IUser";

interface ICommentReply {
    id: string | bigint;
    content: string;
    userId: string;
    commentId: string | bigint;
    propertyId: string | bigint;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Relations
    user?: IUser;
    comment?: IComment;
    property?: IProperty;
    likes?: ILikeComment[];

    // UI-specific fields
    likesCount?: number;
    isLiked?: boolean;
}

export default ICommentReply;