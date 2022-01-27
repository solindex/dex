import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Schema } from "borsh";
export declare const CALLBACK_INFO_LEN = 33;
export declare enum AccountTag {
    Initialized = 0,
    MarketState = 1,
    UserAccount = 2
}
export declare enum SelfTradeBehavior {
    DecrementTake = 0,
    CancelProvide = 1,
    AbortTransaction = 2
}
export declare class MarketState {
    tag: AccountTag;
    baseMint: PublicKey;
    quoteMint: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    orderbook: PublicKey;
    admin: PublicKey;
    creationTimestamp: BN;
    baseVolume: BN;
    quoteVolume: BN;
    accumulatedFees: BN;
    minBaseOrderSize: BN;
    signerNonce: number;
    feeTierThresholds: BN[];
    feeTierTakerBpsRates: BN[];
    feeTierMakerBpsRates: BN[];
    static schema: Schema;
    constructor(obj: {
        tag: BN;
        signerNonce: BN;
        baseMint: Uint8Array;
        quoteMint: Uint8Array;
        baseVault: Uint8Array;
        quoteVault: Uint8Array;
        orderbook: Uint8Array;
        admin: Uint8Array;
        creationTimestamp: BN;
        baseVolume: BN;
        quoteVolume: BN;
        accumulatedFees: BN;
        minBaseOrderSize: BN;
        feeTierThresholds: BN[];
        feeTierTakerBpsRates: BN[];
        feeTierMakerBpsRates: BN[];
    });
    static retrieve(connection: Connection, market: PublicKey): Promise<MarketState>;
}
export declare class UserAccount {
    tag: AccountTag;
    market: PublicKey;
    owner: PublicKey;
    baseTokenFree: BN;
    baseTokenLocked: BN;
    quoteTokenFree: BN;
    quoteTokenLocked: BN;
    accumulatedRebates: BN;
    accumulatedMakerQuoteVolume: BN;
    accumulatedMakerBaseVolume: BN;
    accumulatedTakerQuoteVolume: BN;
    accumulatedTakerBaseVolume: BN;
    orders: BN[];
    static schema: Schema;
    constructor(obj: {
        tag: BN;
        market: Uint8Array;
        owner: Uint8Array;
        baseTokenFree: BN;
        baseTokenLocked: BN;
        quoteTokenFree: BN;
        quoteTokenLocked: BN;
        orders: BN[];
        accumulatedRebates: BN;
        accumulatedMakerQuoteVolume: BN;
        accumulatedMakerBaseVolume: BN;
        accumulatedTakerQuoteVolume: BN;
        accumulatedTakerBaseVolume: BN;
    });
    static retrieve(connection: Connection, userAccount: PublicKey): Promise<UserAccount>;
}
