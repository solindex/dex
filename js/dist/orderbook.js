"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orderbook = void 0;
const market_1 = require("./market");
const utils_1 = require("./utils");
const aaob = __importStar(require("@bonfida/aaob"));
const state_1 = require("./state");
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Orderbook class
 */
class Orderbook {
    constructor(market, slabBids, slabAsks) {
        this._market = market;
        this._slabBids = slabBids;
        this._slabAsks = slabAsks;
    }
    /**
     * Returns the market object associated to the orderbook
     */
    get market() {
        return this._market;
    }
    /**
     * Returns the asks slab of the orderbook
     */
    get slabAsks() {
        return this._slabAsks;
    }
    /**
     * Returns the bids slab of the orderbook
     */
    get slabBids() {
        return this._slabBids;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param slabAddress The address of the Slab
     * @returns A deserialized Slab object
     */
    static async loadSlab(connection, slabAddress) {
        const { data } = (0, utils_1.throwIfNull)(await connection.getAccountInfo(slabAddress));
        const slab = aaob.Slab.deserialize(data, new bn_js_1.default(state_1.CALLBACK_INFO_LEN));
        return slab;
    }
    /**
     *
     * @param connection The solana connection object to the RPC node
     * @param marketAddress The address of the market
     * @returns Returns an orderbook object
     */
    static async load(connection, marketAddress) {
        const market = await market_1.Market.load(connection, marketAddress);
        const slabBids = await Orderbook.loadSlab(connection, market.bidsAddress);
        const slabAsks = await Orderbook.loadSlab(connection, market.asksAddress);
        return new Orderbook(market, slabBids, slabAsks);
    }
    // Comment to use Webassembly
    /**
     *
     * @param depth Depth of orders to deserialize
     * @param asks Asks or bids boolean
     * @param uiAmount Optional, whether to return the amounts in uiAmount
     * @returns Returns an L2 orderbook
     */
    getL2(depth, asks, uiAmount) {
        const convert = (p) => {
            return {
                price: p.price,
                size: p.size / Math.pow(10, this.market.baseDecimals),
            };
        };
        if (uiAmount) {
            return asks
                ? this._slabAsks.getL2DepthJS(depth, asks).map(convert)
                : this._slabBids.getL2DepthJS(depth, asks).map(convert);
        }
        return asks
            ? this._slabAsks.getL2DepthJS(depth, asks)
            : this._slabBids.getL2DepthJS(depth, asks);
    }
}
exports.Orderbook = Orderbook;
//# sourceMappingURL=orderbook.js.map