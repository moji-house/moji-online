import ICoinTx from "./ICoinTx";
import IComment from "./IComment";
import ICommentReply from "./ICommentReply";
import ILike from "./ILike";
import ILikeComment from "./ILikeComment";
import IPropertyDocument from "./IPropertyDocument";
import IPropertyImage from "./IPropertyImage";
import IPropertyVideo from "./IPropertyVideo";
import IPropertyVote from "./IPropertyVote";
import IUser from "./IUser";
import IVote from "./IVote";

interface IProperty {
  id: string | bigint;
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
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;

  // Relations
  user?: IUser;
  images?: IPropertyImage[];
  videos?: IPropertyVideo[];
  documents?: IPropertyDocument[];
  votes?: IVote[];
  propertyVotes?: IPropertyVote[];
  comments?: IComment[];
  likes?: ILike[];
  commentReplies?: ICommentReply[];
  likeComments?: ILikeComment[];
  coinTransactions?: ICoinTx[];

  // UI-specific fields
  likesCount?: number;
  commentsCount?: number;
  votesCount?: number;
  isLiked?: boolean;
  userVote?: string;
  mainImage?: string;
}

export default IProperty;
