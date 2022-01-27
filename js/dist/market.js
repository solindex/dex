"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
const state_1 = require("./state");
const ids_1 = require("./ids");
const aaob_1 = require("@bonfida/aaob");
const fees_1 = require("./fees");
const openOrders_1 = require("./openOrders");
const bindings_1 = require("./bindings");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("./types");
const orderbook_1 = require("./orderbook");
/**
 * A Serum DEX Market object
 */
class Market {
    constructor(marketState, orderbookState, address, baseDecimals, quoteDecimals, options, programdId, baseVault, quoteVault, eventQueueAddress, orderbookAddress) {
        this._marketState = marketState;
        this._orderbookState = orderbookState;
        this._address = address;
        this._baseDecimals = baseDecimals;
        this._quoteDecimals = quoteDecimals;
        this._skipPreflight = !!options.skipPreflight;
        this._commitment = options.commitment || "recent";
        this._programId = programdId;
        this._baseVault = baseVault;
        this._quoteVault = quoteVault;
        this._eventQueueAddress = eventQueueAddress;
        this._orderbookAddress = orderbookAddress;
        this._baseSplTokenMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(baseDecimals));
        this._quoteSplTokenMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(quoteDecimals));
        this._tickSize = Math.pow(10, -quoteDecimals);
        this._minOrderSize = marketState.minBaseOrderSize.toNumber();
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param address Address of the Serum market to load
     * @param programId Program ID of Serum
     * @param options MarketOptions object (skipPreflight and Commitment)
     * @returns Returns a market object
     */
    static async load(connection, address, programId = ids_1.DEX_ID, options = {}) {
        const marketState = await state_1.MarketState.retrieve(connection, address);
        const orderbookState = await aaob_1.MarketState.retrieve(connection, marketState.orderbook);
        const [baseDecimals, quoteDecimals] = await Promise.all([
            (0, utils_1.getMintDecimals)(connection, marketState.baseMint),
            (0, utils_1.getMintDecimals)(connection, marketState.quoteMint),
        ]);
        return new Market(marketState, orderbookState, address, baseDecimals, quoteDecimals, options, programId, marketState.baseVault, marketState.quoteVault, orderbookState.eventQueue, marketState.orderbook);
    }
    /** Returns the Serum program ID of the market */
    get programId() {
        return this._programId;
    }
    /** Return the market address */
    get address() {
        return this._address;
    }
    /** Returns the mint address of the base token */
    get baseMintAddress() {
        return this._marketState.baseMint;
    }
    /** Returns the mint address of the quote token */
    get quoteMintAddress() {
        return this._marketState.quoteMint;
    }
    /** Returns the bids address (AOB program) of the market */
    get bidsAddress() {
        return this._orderbookState.bids;
    }
    /** Returns the asks address (AOB program) of the market */
    get asksAddress() {
        return this._orderbookState.asks;
    }
    /** Returns the market state */
    get marketState() {
        return this._marketState;
    }
    /** Returns the orderbook state */
    get orderbookState() {
        return this._orderbookState;
    }
    /** Returns the number of decimals of the quote spl-token */
    get quoteDecimals() {
        return this._quoteDecimals;
    }
    /** Returns the number of decimals of the quote spl-token */
    get baseDecimals() {
        return this._baseDecimals;
    }
    /** Returns the base vault address of the market */
    get baseVault() {
        return this._baseVault;
    }
    /** Returns the quote vault address of the market */
    get quoteVault() {
        return this._quoteVault;
    }
    /** Returns the orderbook address of the market */
    get orderbookAddress() {
        return this._orderbookAddress;
    }
    /** Returns the event queue address of the market */
    get eventQueueAddress() {
        return this._eventQueueAddress;
    }
    /** Returns the tick size of the market */
    get tickSize() {
        return this._tickSize;
    }
    /** Returns the min order size of the market */
    get minOrderSize() {
        return this._minOrderSize;
    }
    /** Returns the inception base volume */
    baseVolume() {
        return this._marketState.baseVolume.toNumber();
    }
    /** Returns the inception quote volume */
    quoteVolume() {
        return this._marketState.quoteVolume.toNumber();
    }
    /** Returns the timestamp of the market creation */
    marketCreation() {
        return this._marketState.creationTimestamp.toNumber();
    }
    /** Returns the base token multiplier */
    baseSplSizeToNumber(size) {
        return (0, utils_1.divideBnToNumber)(size, this._baseSplTokenMultiplier);
    }
    /** Returns the quote token multiplier */
    quoteSplSizeToNumber(size) {
        return (0, utils_1.divideBnToNumber)(size, this._quoteSplTokenMultiplier);
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The decoded bids of the market
     */
    async loadBids(connection) {
        const bids = await this._orderbookState.loadBidsSlab(connection);
        return bids;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The decoded asks of the market
     */
    async loadAsks(connection) {
        const asks = await this._orderbookState.loadAsksSlab(connection);
        return asks;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param owner The owner of the orders to fetch
     * @returns
     */
    async loadOrdersForOwner(connection, owner) {
        const openOrders = await this.findOpenOrdersAccountForOwner(connection, owner);
        const orderbook = await orderbook_1.Orderbook.load(connection, this.address);
        return this.filterForOpenOrders(orderbook, openOrders);
    }
    /**
     * Fetch the associated token account of the owner for the base token of the market
     * @param owner The public key of the owner
     * @returns The public key of the associated token account of the owner
     */
    async findBaseTokenAccountsForOwner(owner) {
        const pubkey = await (0, utils_1.findAssociatedTokenAddress)(owner, this._marketState.baseMint);
        return pubkey;
    }
    /**
     * Fetch the associated token account of the owner for the quote token of the market
     * @param owner The public key of the owner
     * @returns The public key of the associated token account of the owner
     */
    async findQuoteTokenAccountsForOwner(owner) {
        const pubkey = await (0, utils_1.findAssociatedTokenAddress)(owner, this._marketState.quoteMint);
        return pubkey;
    }
    /**
     * Fetch the open order account of the owner
     * @param owner The public key of the owner
     * @returns The public key of the open order account
     */
    async findOpenOrdersAccountForOwner(connection, owner) {
        const openOrders = openOrders_1.OpenOrders.load(connection, this.address, owner);
        return openOrders;
    }
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
    async placeOrder(connection, side, limitPrice, size, orderType, selfTradeBehavior, ownerTokenAccount, owner, discountTokenAccount) {
        const inst = await this.makePlaceOrderTransaction(side, limitPrice, size, orderType, selfTradeBehavior, ownerTokenAccount, owner.publicKey, discountTokenAccount);
        const tx = new web3_js_1.Transaction().add(inst);
        return await this._sendTransaction(connection, tx, [owner]);
    }
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
    async makePlaceOrderTransaction(side, limitPrice, size, orderType, selfTradeBehavior, ownerTokenAccount, owner, discountTokenAccount) {
        return await (0, bindings_1.placeOrder)(this, side, limitPrice, size * Math.pow(10, this.baseDecimals), orderType, selfTradeBehavior, ownerTokenAccount, owner, discountTokenAccount);
    }
    /**
     * This method returns the fee discount keys assuming (M)SRM tokens are held in associated token account.
     * @param connection The solana connection object to the RPC node
     * @param owner The public key of the (M)SRM owner
     * @returns An array of `{ pubkey: PublicKey, mint: PublicKey, balance: number, feeTier: number }`
     */
    async findFeeDiscountKeys(connection, owner) {
        const [srmAddress, msrmAddress] = await Promise.all([ids_1.SRM_MINT, ids_1.MSRM_MINT].map((e) => (0, utils_1.findAssociatedTokenAddress)(owner, e)));
        const [srmBalance, msrmBalance] = await Promise.all([srmAddress, msrmAddress].map((e) => (0, utils_1.getTokenBalance)(connection, e)));
        return [
            {
                pubkey: srmAddress,
                mint: ids_1.SRM_MINT,
                balance: srmBalance,
                feeTier: (0, fees_1.getFeeTier)(0, srmBalance),
            },
            {
                pubkey: msrmAddress,
                mint: ids_1.MSRM_MINT,
                balance: msrmBalance,
                feeTier: (0, fees_1.getFeeTier)(msrmBalance, 0),
            },
        ];
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param transaction The transaction to sign and send
     * @param signers The signers of the transaction
     * @returns Returns the signature of the signed and sent transaction
     */
    async _sendTransaction(connection, transaction, signers) {
        const signature = await connection.sendTransaction(transaction, signers, {
            skipPreflight: this._skipPreflight,
        });
        const { value } = await connection.confirmTransaction(signature, this._commitment);
        if (value === null || value === void 0 ? void 0 : value.err) {
            throw new Error(JSON.stringify(value.err));
        }
        return signature;
    }
    /**
     *
     * @param orderIndex The index of the order in the open order account
     * @param owner The owner of the order
     * @returns
     */
    async makeCancelOrderInstruction(orderIndex, orderId, owner) {
        const instruction = await (0, bindings_1.cancelOrder)(this, orderIndex, orderId, owner);
        const tx = new web3_js_1.Transaction().add(instruction);
        return tx;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param orderIndex The index of the order in the open order account
     * @param owner The owner of the order
     * @returns The signature of the cancel transaction
     */
    async cancelOrderByOrderIndex(connection, orderIndex, owner) {
        const openOrders = await openOrders_1.OpenOrders.load(connection, this.address, owner.publicKey);
        const orderId = openOrders.orders[orderIndex];
        if (!orderId) {
            throw new Error(`Invalid order index ${orderIndex}`);
        }
        const tx = await this.makeCancelOrderInstruction(new bn_js_1.default(orderIndex), orderId, owner.publicKey);
        const signature = await this._sendTransaction(connection, tx, [owner]);
        return signature;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param orderId The id of the order to cancel
     * @param owner The owner of the order
     * @returns The signature of the cancel transaction
     */
    async cancelOrderByOrderId(connection, orderId, owner) {
        const openOrders = await openOrders_1.OpenOrders.load(connection, this.address, owner.publicKey);
        const orderIndex = openOrders.orders
            .map((o) => o.eq(orderId))
            .indexOf(true);
        if (orderIndex === -1) {
            throw new Error("Invalid order id");
        }
        const tx = await this.makeCancelOrderInstruction(new bn_js_1.default(orderIndex), orderId, owner.publicKey);
        const signature = await this._sendTransaction(connection, tx, [owner]);
        return signature;
    }
    async cancelInBatch(connection, orders, owner) {
        orders.sort((a, b) => b.orderIndex - a.orderIndex);
        let instr = [];
        for (let o of orders) {
            instr.push(await (0, bindings_1.cancelOrder)(this, new bn_js_1.default(o.orderIndex), o.orderId, owner.publicKey));
        }
        const tx = new web3_js_1.Transaction().add(...instr);
        const signature = await this._sendTransaction(connection, tx, [owner]);
        return signature;
    }
    /**
     *
     * @param owner Owner of the funds to settle
     * @param destinationBaseAccount The owner base token account
     * @param destinationQuoteAccount The owner quote token account
     * @returns
     */
    async makeSettleFundsTransaction(owner, destinationBaseAccount, destinationQuoteAccount) {
        const instructions = await (0, bindings_1.settle)(this, owner, destinationBaseAccount, destinationQuoteAccount);
        const tx = new web3_js_1.Transaction().add(instructions);
        return tx;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param owner The owner of the funds to settle
     * @param destinationBaseAccount The owner base token account
     * @param destinationQuoteAccount The owner quote token account
     * @returns The signature of the settle transaction
     */
    async settleFunds(connection, owner, destinationBaseAccount, destinationQuoteAccount) {
        const tx = await this.makeSettleFundsTransaction(owner.publicKey, destinationBaseAccount, destinationQuoteAccount);
        const signature = await this._sendTransaction(connection, tx, [owner]);
        return signature;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @returns The deserialized event queue of the market
     */
    async loadEventQueue(connection) {
        const eventQueue = await aaob_1.EventQueue.load(connection, this._orderbookState.eventQueue, state_1.CALLBACK_INFO_LEN);
        return eventQueue;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param limit Optional limit parameters to the number of fills fetched
     */
    async loadFills(connection, limit = 100) {
        const eventQueue = await this.loadEventQueue(connection);
        return eventQueue.parseFill(limit);
    }
    /**
     *
     * @param slab Slab to extract open orders from
     * @param openOrders Open orders account
     * @returns
     */
    filterForOpenOrdersFromSlab(slab, openOrders, side) {
        return [...slab]
            .filter((o) => openOrders === null || openOrders === void 0 ? void 0 : openOrders.address.equals(new web3_js_1.PublicKey(slab.getCallBackInfo(o.callBackInfoPt).slice(0, 32))))
            .map((o) => {
            return {
                orderId: o.key,
                price: (0, aaob_1.getPriceFromKey)(o.key).toNumber(),
                feeTier: slab.getCallBackInfo(o.callBackInfoPt).slice(32)[0],
                size: o.baseQuantity.toNumber(),
                openOrdersAddress: new web3_js_1.PublicKey(slab.getCallBackInfo(o.callBackInfoPt).slice(0, 32)),
                side: side,
            };
        });
    }
    /**
     *
     * @param orderbook The orderbook of the market
     * @param openOrder The openOrder that owns the orders
     * @returns
     */
    filterForOpenOrders(orderbook, openOrder) {
        const bids = this.filterForOpenOrdersFromSlab(orderbook.slabBids, openOrder, types_1.Side.Bid);
        const asks = this.filterForOpenOrdersFromSlab(orderbook.slabAsks, openOrder, types_1.Side.Ask);
        return [...bids, ...asks];
    }
}
exports.Market = Market;
//# sourceMappingURL=market.js.map