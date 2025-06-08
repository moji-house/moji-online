import ICoinBalance from "./ICoinBalance";
import IProperty from "./IProperty";
import IUser from "./IUser";

interface ICoinTx {
    id: string;
    type: string;
    amount: number;
    description: string;
    propertyId?: string | bigint;
    userId: string;
    coinBalanceId: string;
    createdAt: Date | string;

    // Relations
    property?: IProperty;
    user?: IUser;
    coinBalance?: ICoinBalance;
}

export default ICoinTx;