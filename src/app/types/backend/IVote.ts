import IProperty from "./IProperty";
import IUser from "./IUser";

interface IVote {
    id: string | bigint;
    propertyId: string | bigint;
    userId: string;
    voteType: string;
    createdAt: Date | string;

    // Relations
    property?: IProperty;
    user?: IUser;
}

export default IVote;