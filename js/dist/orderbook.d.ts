import { Slab } from "@bonfida/aaob";
import { PublicKey, Connection } from "@solana/web3.js";
import { Market } from "./market";
import * as aaob from "@bonfida/aaob";
/**
 * Orderbook class
 */
export declare class Orderbook {
    /** Market of the orderbook
     * @private
     */
    private _market;
    /** Slab that contains asks
     * @private
     */
    private _slabAsks;
    /** Slab that contains bids
     * @private
     */
    private _slabBids;
    constructor(market: Market, slabBids: Slab, slabAsks: Slab);
    /**
     * Returns the market object associated to the orderbook
     */
    get market(): Market;
    /**
     * Returns the asks slab of the orderbook
     */
    get slabAsks(): Slab;
    /**
     * Returns the bids slab of the orderbook
     */
    get slabBids(): Slab;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param slabAddress The address of the Slab
     * @returns A deserialized Slab object
     */
    static loadSlab(connection: any, slabAddress: PublicKey): Promise<Slab>;
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param marketAddress The address of the market
     * @returns Returns an orderbook object
     */
    static load(connection: Connection, marketAddress: PublicKey): Promise<Orderbook>;
    /**
     *
     * @param depth Depth of orders to deserialize
     * @param asks Asks or bids boolean
     * @param uiAmount Optional, whether to return the amounts in uiAmount
     * @returns Returns an L2 orderbook
     */
    getL2(depth: number, asks: boolean, uiAmount?: boolean): aaob.Price[];
}
