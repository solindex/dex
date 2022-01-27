import BN from "bn.js";
import { Schema } from "borsh";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export interface AccountKey {
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
}
export declare class closeAccountInstruction {
    tag: BN;
    static schema: Schema;
    constructor();
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, user: PublicKey, userOwner: PublicKey, targetLamportsAccount: PublicKey): TransactionInstruction;
}
export declare class newOrderInstruction {
    tag: BN;
    limitPrice: BN;
    maxBaseQty: BN;
    maxQuoteQty: BN;
    matchLimit: BN;
    side: number;
    orderType: number;
    selfTradeBehavior: number;
    padding: Uint8Array;
    static schema: Schema;
    constructor(obj: {
        limitPrice: BN;
        maxBaseQty: BN;
        maxQuoteQty: BN;
        matchLimit: BN;
        side: number;
        orderType: number;
        selfTradeBehavior: number;
    });
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, splTokenProgram: PublicKey, systemProgram: PublicKey, market: PublicKey, orderbook: PublicKey, eventQueue: PublicKey, bids: PublicKey, asks: PublicKey, baseVault: PublicKey, quoteVault: PublicKey, user: PublicKey, userTokenAccount: PublicKey, userOwner: PublicKey, discountTokenAccount?: PublicKey): TransactionInstruction;
}
export declare class cancelOrderInstruction {
    tag: BN;
    orderIndex: BN;
    orderId: BN;
    static schema: Schema;
    constructor(obj: {
        orderIndex: BN;
        orderId: BN;
    });
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, market: PublicKey, orderbook: PublicKey, eventQueue: PublicKey, bids: PublicKey, asks: PublicKey, user: PublicKey, userOwner: PublicKey): TransactionInstruction;
}
export declare class settleInstruction {
    tag: BN;
    static schema: Schema;
    constructor();
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, splTokenProgram: PublicKey, market: PublicKey, baseVault: PublicKey, quoteVault: PublicKey, marketSigner: PublicKey, user: PublicKey, userOwner: PublicKey, destinationBaseAccount: PublicKey, destinationQuoteAccount: PublicKey): TransactionInstruction;
}
export declare class initializeAccountInstruction {
    tag: BN;
    market: Uint8Array;
    maxOrders: BN;
    static schema: Schema;
    constructor(obj: {
        market: Uint8Array;
        maxOrders: BN;
    });
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, systemProgram: PublicKey, user: PublicKey, userOwner: PublicKey, feePayer: PublicKey): TransactionInstruction;
}
export declare class closeMarketInstruction {
    tag: BN;
    static schema: Schema;
    constructor();
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, market: PublicKey, baseVault: PublicKey, quoteVault: PublicKey, orderbook: PublicKey, eventQueue: PublicKey, bids: PublicKey, asks: PublicKey, marketAdmin: PublicKey, targetLamportsAccount: PublicKey): TransactionInstruction;
}
export declare class consumeEventsInstruction {
    tag: BN;
    maxIterations: BN;
    static schema: Schema;
    constructor(obj: {
        maxIterations: BN;
    });
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, market: PublicKey, orderbook: PublicKey, eventQueue: PublicKey, rewardTarget: PublicKey, userAccounts: PublicKey[]): TransactionInstruction;
}
export declare class sweepFeesInstruction {
    tag: BN;
    static schema: Schema;
    constructor();
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, market: PublicKey, marketSigner: PublicKey, marketAdmin: PublicKey, quoteVault: PublicKey, destinationTokenAccount: PublicKey, splTokenProgram: PublicKey): TransactionInstruction;
}
export declare class createMarketInstruction {
    tag: BN;
    signerNonce: BN;
    minBaseOrderSize: BN;
    tickSize: BN;
    crankerReward: BN;
    feeTierThresholds: BN[];
    feeTierTakerBpsRates: BN[];
    feeTierMakerBpsRebates: BN[];
    static schema: Schema;
    constructor(obj: {
        signerNonce: BN;
        minBaseOrderSize: BN;
        tickSize: BN;
        crankerReward: BN;
        feeTierThresholds: BN[];
        feeTierTakerBpsRates: BN[];
        feeTierMakerBpsRebates: BN[];
    });
    serialize(): Uint8Array;
    getInstruction(programId: PublicKey, market: PublicKey, orderbook: PublicKey, baseVault: PublicKey, quoteVault: PublicKey, marketAdmin: PublicKey, eventQueue: PublicKey, asks: PublicKey, bids: PublicKey): TransactionInstruction;
}
