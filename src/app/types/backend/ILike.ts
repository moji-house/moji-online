import IProperty from "./IProperty";
import IUser from "./IUser";

interface ILike {
  id: string | bigint;
  propertyId: string | bigint;
  userId: string;
  createdAt: Date | string;
  
  // Relations
  property?: IProperty;
  user?: IUser;
}

export default ILike;