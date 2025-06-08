// This is a utility interface for transaction data
interface ITransaction {
  id: string;
  type: string;
  amount: number | bigint;
  description: string;
  propertyId?: string | bigint | null;
  userId: string | bigint;
  coinBalanceId: string;
  createdAt: Date | string;
  property?: {
    id: string | bigint;
    title: string;
  };
}

export default ITransaction;