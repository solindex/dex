import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
/**
 * Open Orders class
 */
export declare class OpenOrders {
    /** Address of the open orders account
     * @private
     */
    private _address;
    /**
     * Address of the market of the open order account
     * @private
     */
    private _market;
    /**
     * Address of the owner of the open order account
     * @private
     */
    private _owner;
    /**
     * Amount of free base tokens
     * @private
     */
    private _baseTokenFree;
    /**
     * Total amount of base tokens
     * @private
     */
    private _baseTokenTotal;
    /**
     * Amount of free quote tokens
     * @private
     */
    private _quoteTokenFree;
    /**
     * Total amount of quote tokens
     * @private
     */
    private _quoteTokenTotal;
    /**
     * List of orders of the open order account
     * @private
     */
    private _orders;
    /**
     * Amount of accumulated rebates
     * @private
     */
    private _accumulatedRebates;
    constructor(address: PublicKey, market: PublicKey, owner: PublicKey, baseTokenFree: BN, baseTokenTotal: BN, quoteTokenFree: BN, quoteTokenTotal: BN, orders: BN[], accumulatedRebates: BN);
    /**
     * Returns the address of the open order account
     */
    get address(): PublicKey;
    /**
     * Returns the market address of the open order account
     */
    get market(): PublicKey;
    /**
     * Returns the owner of the open order account
     */
    get owner(): PublicKey;
    /**
     * Returns the amount of free base tokens
     */
    get baseTokenFree(): BN;
    /**
     * Returns the total amount of base tokens
     */
    get baseTokenTotal(): BN;
    /**
     * Returns the amount of free quote tokens
     */
    get quoteTokenFree(): BN;
    /**
     * Returns the total amount of quote tokens
     */
    get quoteTokenTotal(): BN;
    /**
     * Returns the list of orders of the open orders account
     */
    get orders(): BN[];
    /**
     * Returns the amount of accumulated fee rebates
     */
    get accumulatedRebates(): BN;
    /**
     * Loads the open orders account
     * @param connection The solana connection object to the RPC node
     * @param market The market address of the open orders account
     * @param owner The owner of the open orders account
     * @returns An OpenOrders object
     */
    static load(connection: Connection, market: PublicKey, owner: PublicKey): Promise<OpenOrders>;
    /**
     * Static method to make the transaction instruction that initializes an open order account
     * @param market The market address of the open orders account to initialize
     * @param owner The owner of the open orders account to initialize
     * @param maxOrders The max number of open orders the account will be able to hold
     * @returns A TransactionInstruction object
     */
    static makeCreateAccountTransaction(market: PublicKey, owner: PublicKey, maxOrders?: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    /**
     *
     * @returns Returns a TransactionInstruction object to close the OpenOrder account
     */
    makeCloseAccountTransaction(): Promise<import("@solana/web3.js").TransactionInstruction>;
    /**
     * Checks if an open order account exists for the owner on the given market
     * @param connection The solana connection object to the RPC node
     * @param market The market address of the open orders account
     * @param owner The owner of the open orders account
     * @returns A boolean
     */
    static exists(connection: Connection, market: PublicKey, owner: PublicKey): Promise<boolean>;
    static addressForOwner(market: PublicKey, owner: PublicKey): Promise<PublicKey>;
}
