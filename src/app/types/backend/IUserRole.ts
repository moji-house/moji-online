import IUser from "./IUser";

interface IUserRole {
  id: string | bigint;
  userId: string;
  role: string;
  createdAt: Date | string;
  
  // Relations
  user?: IUser;
}

export default IUserRole;