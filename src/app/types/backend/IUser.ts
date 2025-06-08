import IAccount from "./IAccount";
import ICoinBalance from "./ICoinBalance";
import ICoinTx from "./ICoinTx";
import IComment from "./IComment";
import ICommentReply from "./ICommentReply";
import ILike from "./ILike";
import ILikeComment from "./ILikeComment";
import IProperty from "./IProperty";
import IPropertyVote from "./IPropertyVote";
import ISession from "./ISession";
import IUserRole from "./IUserRole";
import IVote from "./IVote";

interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    googleId?: string;
    phone?: string;
    birthDate?: Date | string;
    showBirthDate: boolean;
    bio?: string;
    education?: string;
    currentCompany?: string;
    previousCompanies?: string;
    realEstateExperience?: string;
    lineContact?: string;
    avatar?: string;
    backgroundImage?: string;
    voteCount: number;
    followers: number;
    propertiesCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Relations
    roles?: IUserRole[];
    properties?: IProperty[];
    comments?: IComment[];
    likes?: ILike[];
    votes?: IVote[];
    propertyVotes?: IPropertyVote[];
    commentReplies?: ICommentReply[];
    likeComments?: ILikeComment[];
    coinBalance?: ICoinBalance;
    coinTransactions?: ICoinTx[];
    accounts?: IAccount[];
    sessions?: ISession[];
}

export default IUser;