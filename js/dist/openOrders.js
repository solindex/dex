"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenOrders = void 0;
const web3_js_1 = require("@solana/web3.js");
const ids_1 = require("./ids");
const state_1 = require("./state");
const bindings_1 = require("./bindings");
/**
 * Open Orders class
 */
class OpenOrders {
    constructor(address, market, owner, baseTokenFree, baseTokenTotal, quoteTokenFree, quoteTokenTotal, orders, accumulatedRebates) {
        this._address = address;
        this._market = market;
        this._owner = owner;
        this._baseTokenFree = baseTokenFree;
        this._baseTokenTotal = baseTokenTotal;
        this._quoteTokenFree = quoteTokenFree;
        this._quoteTokenTotal = quoteTokenTotal;
        this._orders = orders;
        this._accumulatedRebates = accumulatedRebates;
    }
    /**
     * Returns the address of the open order account
     */
    get address() {
        return this._address;
    }
    /**
     * Returns the market address of the open order account
     */
    get market() {
        return this._market;
    }
    /**
     * Returns the owner of the open order account
     */
    get owner() {
        return this._owner;
    }
    /**
     * Returns the amount of free base tokens
     */
    get baseTokenFree() {
        return this._baseTokenFree;
    }
    /**
     * Returns the total amount of base tokens
     */
    get baseTokenTotal() {
        return this._baseTokenTotal;
    }
    /**
     * Returns the amount of free quote tokens
     */
    get quoteTokenFree() {
        return this._quoteTokenFree;
    }
    /**
     * Returns the total amount of quote tokens
     */
    get quoteTokenTotal() {
        return this._quoteTokenTotal;
    }
    /**
     * Returns the list of orders of the open orders account
     */
    get orders() {
        return this._orders;
    }
    /**
     * Returns the amount of accumulated fee rebates
     */
    get accumulatedRebates() {
        return this._accumulatedRebates;
    }
    /**
     * Loads the open orders account
     * @param connection The solana connection object to the RPC node
     * @param market The market address of the open orders account
     * @param owner The owner of the open orders account
     * @returns An OpenOrders object
     */
    static async load(connection, market, owner) {
        const [address] = await web3_js_1.PublicKey.findProgramAddress([market.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
        const userAccount = await state_1.UserAccount.retrieve(connection, address);
        return new OpenOrders(address, market, owner, userAccount.baseTokenFree, userAccount.baseTokenLocked.add(userAccount.baseTokenFree), userAccount.quoteTokenFree, userAccount.quoteTokenFree.add(userAccount.quoteTokenLocked), userAccount.orders, userAccount.accumulatedRebates);
    }
    /**
     * Static method to make the transaction instruction that initializes an open order account
     * @param market The market address of the open orders account to initialize
     * @param owner The owner of the open orders account to initialize
     * @param maxOrders The max number of open orders the account will be able to hold
     * @returns A TransactionInstruction object
     */
    static async makeCreateAccountTransaction(market, owner, maxOrders = 20) {
        return await (0, bindings_1.initializeAccount)(market, owner, maxOrders);
    }
    /**
     *
     * @returns Returns a TransactionInstruction object to close the OpenOrder account
     */
    async makeCloseAccountTransaction() {
        return await (0, bindings_1.closeAccount)(this.market, this.owner);
    }
    /**
     * Checks if an open order account exists for the owner on the given market
     * @param connection The solana connection object to the RPC node
     * @param market The market address of the open orders account
     * @param owner The owner of the open orders account
     * @returns A boolean
     */
    static async exists(connection, market, owner) {
        const [address] = await web3_js_1.PublicKey.findProgramAddress([market.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
        const info = await connection.getAccountInfo(address);
        return !!(info === null || info === void 0 ? void 0 : info.data);
    }
    static async addressForOwner(market, owner) {
        const [address] = await web3_js_1.PublicKey.findProgramAddress([market.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
        return address;
    }
}
exports.OpenOrders = OpenOrders;
//# sourceMappingURL=openOrders.js.map