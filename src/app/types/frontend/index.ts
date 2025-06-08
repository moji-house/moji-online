import IUser from "../backend/IUser";
import ICoinTx from "../backend/ICoinTx";
import ICommentReply from "../backend/ICommentReply";
import ILikeComment from "../backend/ILikeComment";
import IPropertyVote from "../backend/IPropertyVote";
import { IComment, ILike, IPropertyDocument, IPropertyImage, IPropertyVideo, IVote } from "../backend";

// Forward declaration to handle circular references
export interface ISerializedProperty {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    state?: string;
    zip_code?: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    status: string;
    phone?: string;
    line_id?: string;
    google_map_link?: string;
    co_agent_commission?: number;
    co_agent_incentive?: string;
    co_agent_notes?: string;
    points: number;
    createdAt: string;
    updatedAt: string;
    userId: string;

    // Relations
    user?: ISerializedUser | null;
    images?: ISerializedPropertyImage[];
    videos?: ISerializedPropertyVideo[];
    documents?: ISerializedPropertyDocument[];
    votes?: ISerializedVote[];
    propertyVotes?: IPropertyVideo[];
    comments?: ISerializedComment[];
    likes?: ISerializedLike[];
    commentReplies?: ISerializedCommentReply[];
    likeComments?: ISerializedLikeComment[];
    coinTransactions?: ISerializedCoinTx[];

    // UI-specific fields
    likesCount?: number;
    commentsCount?: number;
    votesCount?: number;
    isLiked?: boolean;
    userVote?: string;
    mainImage?: string;
}

export interface ISerializedUser extends Omit<IUser, 'id'> {
    id: string | null;
}

export interface ISerializedPropertyImage extends IPropertyImage {
    id: string;
    propertyId: string;
}

export interface ISerializedLike extends ILike {
    id: string;
    propertyId: string;
    userId: string;
}

export interface ISerializedComment extends Omit<IComment, 'id' | 'userId' | 'propertyId' | 'user'> {
    id: string;
    userId: string;
    propertyId: string;
    user?: ISerializedUser;
    commentReplies?: ISerializedCommentReply[];
}

export interface ISerializedPropertyVideo extends IPropertyVideo {
    id: string;
    propertyId: string;
}

export interface ISerializedPropertyDocument extends IPropertyDocument {
    id: string;
    propertyId: string;
}

// Placeholders for other types that would need serialization
export interface ISerializedVote extends IVote {
    id: string;
    propertyId: string;
}

export interface ISerializedPropertyVote extends Omit<IPropertyVote, 'id' | 'propertyId' | 'property'> {
    id: string;
    propertyId: string;
    property?: ISerializedProperty;
}

export interface ISerializedCommentReply extends ICommentReply {
    id: string;
    commentId: string;
    propertyId: string;
}

export interface ISerializedLikeComment extends Omit<ILikeComment, 'id'> {
    id: string;
}

export interface ISerializedCoinTx extends Omit<ICoinTx, 'id' | 'propertyId' | 'property'> {
    id: string;
    propertyId: string;
    property?: ISerializedProperty;
}

export default ISerializedProperty;

export interface IGenDocType {
    property: ISerializedProperty;
    buyer: ISerializedUser | null;
    seller: ISerializedUser | undefined;
}