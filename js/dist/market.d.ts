import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction } from "@solana/web3.js";
import { MarketState, SelfTradeBehavior } from "./state";
import { EventQueue, MarketState as AaobMarketState, Slab } from "@bonfida/aaob";
import { OpenOrders } from "./openOrders";
import BN from "bn.js";
import { OrderType, Side, OrderInfo, MarketOptions } from "./types";
import { Orderbook } from "./orderbook";
/**
 * A Serum DEX Market object
 */
export declare class Market {
    /** Market state
     * @private
     */
    private _marketState;
    /** Asset agnostic orderbook state
     * @private
     */
    private _orderbookState;
    /** Address of the Serum DEX market
     * @private
     */
    private _address;
    /** Number of decimals of the base token
     * @private
     */
    private _baseDecimals;
    /** Number of decimals of the quote token
     * @private
     */
    private _quoteDecimals;
    /**
     * Quote token multiplier
     * @private
     */
    private _quoteSplTokenMultiplier;
    /** Base token multiplier
     * @private
     */
    private _baseSplTokenMultiplier;
    /** Serum program ID of the market
     * @private
     */
    private _programId;
    /** Base vault address of the market
     * @private
     */
    private _baseVault;
    /** Quote vault address of the market
     * @private
     */
    private _quoteVault;
    /** Event queue address of the market
     * @private
     */
    private _eventQueueAddress;
    /** Address of the orderbook or AAOB market
     * @private
     */
    private _orderbookAddress;
    /** Preflight option (used in the connection object for sending tx)
     * @private
     */
    private _skipPreflight;
    /** Commitment option (used in the connection object)
     * @private
     */
    private _commitment;
    private _tickSize;
    private _minOrderSize;
    constructor(marketState: MarketState, orderbookState: AaobMarketState, address: PublicKey, baseDecimals: number, quoteDecimals: number, options: MarketOptions, programdId: PublicKey, baseVault: PublicKey, quoteVault: PublicKey, eventQueueAddress: PublicKey, orderbookAddress: PublicKey);
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param address Address of the Serum market to load
     * @param programId Program ID of Serum
     * @param options MarketOptions object (skipPreflight and Commitment)
     * @returns Returns a market object
     */
    static load(connection: Connection, address: PublicKey, programId?: PublicKey, options?: MarketOptions): Promise<Market>;
    /** Returns the Serum program ID of the market */
    get programId(): PublicKey;
    /** Return the market address */
    get address(): PublicKey;
    /** Returns the mint address of the base token */
    get baseMintAddress(): PublicKey;
    /** Returns the mint address of the quote token */
    get quoteMintAddress(): PublicKey;
    /** Returns the bids address (AOB program) of the market */
    get bidsAddress(): PublicKey;
    /** Returns the asks address (AOB program) of the market */
    get asksAddress(): PublicKey;
    /** Returns the market state */
    get marketState(): MarketState;
    /** Returns the orderbook state */
    get orderbookState(): AaobMarketState;
    /** Returns the number of decimals of the quote spl-token */
    get quoteDecimals(): number;
    /** Returns the number of decimals of the quote spl-token */
    get baseDecimals(): number;
    /** Returns the base vault address of the market */
    get baseVault(): PublicKey;
    /** Returns the quote vault address of the market */
    get quoteVault(): PublicKey;
    /** Returns the orderbook address of the market */
    get orderbookAddress(): PublicKey;
    /** Returns the event queue address of the market */
    get eventQueueAddress(): PublicKey;
    /** Returns the tick size of the market */
    get tickSize(): number;
    /** Returns the min order size of the market */
    get minOrderSize(): number;
    /** Returns the inception base volume */
    baseVolume(): number;
    /** Returns the inception quote volume */
    quoteVolume(): number;
    /** Returns the timestamp of the market creation */
    marketCreation(): number;
    /** Returns the base token multiplier */
    baseSplSizeToNumber(size: BN): number;
    /** Returns the quote token multiplier */
    quoteSplSizeToNumber(size: BN): number;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The decoded bids of the market
     */
    loadBids(connection: Connection): Promise<Slab>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The decoded asks of the market
     */
    loadAsks(connection: Connection): Promise<Slab>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param owner The owner of the orders to fetch
     * @returns
     */
    loadOrdersForOwner(connection: Connection, owner: PublicKey): Promise<{
        orderId: BN;
        price: number;
        feeTier: number;
        size: number;
        openOrdersAddress: PublicKey;
        side: Side;
    }[]>;
    /**
     * Fetch the associated token account of the owner for the base token of the market
     * @param owner The public key of the owner
     * @returns The public key of the associated token account of the owner
     */
    findBaseTokenAccountsForOwner(owner: PublicKey): Promise<PublicKey>;
    /**
     * Fetch the associated token account of the owner for the quote token of the market
     * @param owner The public key of the owner
     * @returns The public key of the associated token account of the owner
     */
    findQuoteTokenAccountsForOwner(owner: PublicKey): Promise<PublicKey>;
    /**
     * Fetch the open order account of the owner
     * @param owner The public key of the owner
     * @returns The public key of the open order account
     */
    findOpenOrdersAccountForOwner(connection: Connection, owner: PublicKey): Promise<OpenOrders>;
    /**
     * Sign and send a place order transaction
     * @param connection The solana connection object to the RPC node
     * @param side The side of the order (cf Side enum)
     * @param limitPrice The limit price of the order
     * @param size The size of the order
     * @param orderType The type of the order (cf OrderType enum)
     * @param selfTradeBehavior The behavior of the order in case of self trade (cf SelfTradeBehavior enum)
     * @param ownerTokenAccount The token account of the owner of the wallet placing the trade (owner)
     * @param owner The owner of the order
     * @param discountTokenAccount Optional (M)SRM token account for fee discount
     * @returns The signature of the transaction
     */
    placeOrder(connection: Connection, side: Side, limitPrice: number, size: number, orderType: OrderType, selfTradeBehavior: SelfTradeBehavior, ownerTokenAccount: PublicKey, owner: Keypair, discountTokenAccount?: PublicKey): Promise<string>;
    /**
     * Returns a TransactionInstruction to place an order
     * @param side The side of the order (cf Side enum)
     * @param limitPrice The limit price of the order
     * @param size The size of the order
     * @param orderType The type of the order (cf OrderType enum)
     * @param selfTradeBehavior The behavior of the order in case of self trade (cf SelfTradeBehavior enum)
     * @param ownerTokenAccount The token account of the owner of the wallet placing the trade (owner)
     * @param owner The owner of the order
     * @param discountTokenAccount Optional (M)SRM token account for fee discount
     * @returns Returns a TransactionInstruction object
     */
    makePlaceOrderTransaction(side: Side, limitPrice: number, size: number, orderType: OrderType, selfTradeBehavior: SelfTradeBehavior, ownerTokenAccount: PublicKey, owner: PublicKey, discountTokenAccount?: PublicKey): Promise<TransactionInstruction>;
    /**
     * This method returns the fee discount keys assuming (M)SRM tokens are held in associated token account.
     * @param connection The solana connection object to the RPC node
     * @param owner The public key of the (M)SRM owner
     * @returns An array of `{ pubkey: PublicKey, mint: PublicKey, balance: number, feeTier: number }`
     */
    findFeeDiscountKeys(connection: Connection, owner: PublicKey): Promise<{
        pubkey: PublicKey;
        mint: PublicKey;
        balance: any;
        feeTier: number;
    }[]>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param transaction The transaction to sign and send
     * @param signers The signers of the transaction
     * @returns Returns the signature of the signed and sent transaction
     */
    private _sendTransaction;
    /**
     *
     * @param orderIndex The index of the order in the open order account
     * @param owner The owner of the order
     * @returns
     */
    makeCancelOrderInstruction(orderIndex: BN, orderId: BN, owner: PublicKey): Promise<Transaction>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param orderIndex The index of the order in the open order account
     * @param owner The owner of the order
     * @returns The signature of the cancel transaction
     */
    cancelOrderByOrderIndex(connection: Connection, orderIndex: number, owner: Keypair): Promise<string>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param orderId The id of the order to cancel
     * @param owner The owner of the order
     * @returns The signature of the cancel transaction
     */
    cancelOrderByOrderId(connection: Connection, orderId: BN, owner: Keypair): Promise<string>;
    cancelInBatch(connection: Connection, orders: OrderInfo[], owner: Keypair): Promise<string>;
    /**
     *
     * @param owner Owner of the funds to settle
     * @param destinationBaseAccount The owner base token account
     * @param destinationQuoteAccount The owner quote token account
     * @returns
     */
    makeSettleFundsTransaction(owner: PublicKey, destinationBaseAccount: PublicKey, destinationQuoteAccount: PublicKey): Promise<Transaction>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param owner The owner of the funds to settle
     * @param destinationBaseAccount The owner base token account
     * @param destinationQuoteAccount The owner quote token account
     * @returns The signature of the settle transaction
     */
    settleFunds(connection: Connection, owner: Keypair, destinationBaseAccount: PublicKey, destinationQuoteAccount: PublicKey): Promise<string>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The deserialized event queue of the market
     */
    loadEventQueue(connection: Connection): Promise<EventQueue>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param limit Optional limit parameters to the number of fills fetched
     */
    loadFills(connection: Connection, limit?: number): Promise<(import("@bonfida/aaob").EventFill | import("@bonfida/aaob").EventOut)[]>;
    /**
     *
     * @param slab Slab to extract open orders from
     * @param openOrders Open orders account
     * @returns
     */
    filterForOpenOrdersFromSlab(slab: Slab, openOrders: OpenOrders, side: Side): {
        orderId: BN;
        price: number;
        feeTier: number;
        size: number;
        openOrdersAddress: PublicKey;
        side: Side;
    }[];
    /**
     *
     * @param orderbook The orderbook of the market
     * @param openOrder The openOrder that owns the orders
     * @returns
     */
    filterForOpenOrders(orderbook: Orderbook, openOrder: OpenOrders): {
        orderId: BN;
        price: number;
        feeTier: number;
        size: number;
        openOrdersAddress: PublicKey;
        side: Side;
    }[];
}
