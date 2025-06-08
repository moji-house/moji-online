interface ICoinTransaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    propertyId: bigint | null;
    property?: {
        id: bigint;
        title: string;
    } | null;
    userId: string;
    coinBalanceId: string;
    createdAt: Date;
}

export default ICoinTransaction;