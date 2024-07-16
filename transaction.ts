type PriorityFeeBips = number;

interface TxDetails {
    maxPriorityFeeBips: PriorityFeeBips;
    maxFee: number;
    gasLimit: number | null;
    chainId: number;
}

interface Transaction {
    runtimeMsg: Uint8Array;
    nonce: number;
    details: TxDetails;
}

class TransactionBuilder {
    static new(
        runtimeMsg: Uint8Array,
        chainId: number,
        maxPriorityFeeBips: PriorityFeeBips,
        maxFee: number,
        nonce: number,
        gasLimit: number | null
    ): Transaction {
        return {
            runtimeMsg,
            nonce,
            details: {
                maxPriorityFeeBips,
                maxFee,
                gasLimit,
                chainId,
            },
        };
    }
}

export {
    Transaction
}
