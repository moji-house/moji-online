import IUser from "./IUser";

interface ISession {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date | string;

    // Relations
    user?: IUser;
}

export default ISession;