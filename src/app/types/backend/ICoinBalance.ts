import ICoinTx from "./ICoinTx";
import IUser from "./IUser";

interface ICoinBalance {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Relations
  user?: IUser;
  transactions?: ICoinTx[];
}

export default ICoinBalance;