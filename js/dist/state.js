"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccount = exports.MarketState = exports.SelfTradeBehavior = exports.AccountTag = exports.CALLBACK_INFO_LEN = void 0;
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
exports.CALLBACK_INFO_LEN = 33;
var AccountTag;
(function (AccountTag) {
    AccountTag[AccountTag["Initialized"] = 0] = "Initialized";
    AccountTag[AccountTag["MarketState"] = 1] = "MarketState";
    AccountTag[AccountTag["UserAccount"] = 2] = "UserAccount";
})(AccountTag = exports.AccountTag || (exports.AccountTag = {}));
var SelfTradeBehavior;
(function (SelfTradeBehavior) {
    SelfTradeBehavior[SelfTradeBehavior["DecrementTake"] = 0] = "DecrementTake";
    SelfTradeBehavior[SelfTradeBehavior["CancelProvide"] = 1] = "CancelProvide";
    SelfTradeBehavior[SelfTradeBehavior["AbortTransaction"] = 2] = "AbortTransaction";
})(SelfTradeBehavior = exports.SelfTradeBehavior || (exports.SelfTradeBehavior = {}));
class MarketState {
    constructor(obj) {
        this.tag = obj.tag.toNumber();
        this.signerNonce = obj.signerNonce.toNumber();
        this.baseMint = new web3_js_1.PublicKey(obj.baseMint);
        this.quoteMint = new web3_js_1.PublicKey(obj.quoteMint);
        this.baseVault = new web3_js_1.PublicKey(obj.baseVault);
        this.quoteVault = new web3_js_1.PublicKey(obj.quoteVault);
        this.orderbook = new web3_js_1.PublicKey(obj.orderbook);
        this.admin = new web3_js_1.PublicKey(obj.admin);
        this.creationTimestamp = obj.creationTimestamp;
        this.baseVolume = obj.baseVolume;
        this.quoteVolume = obj.quoteVolume;
        this.accumulatedFees = obj.accumulatedFees;
        this.minBaseOrderSize = obj.minBaseOrderSize;
        this.feeTierThresholds = obj.feeTierThresholds;
        this.feeTierTakerBpsRates = obj.feeTierTakerBpsRates;
        this.feeTierMakerBpsRates = obj.feeTierMakerBpsRates;
    }
    static async retrieve(connection, market) {
        const accountInfo = await connection.getAccountInfo(market);
        if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data)) {
            throw new Error("Invalid account provided");
        }
        return (0, borsh_1.deserialize)(this.schema, MarketState, accountInfo.data);
    }
}
exports.MarketState = MarketState;
MarketState.schema = new Map([
    [
        MarketState,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["baseMint", [32]],
                ["quoteMint", [32]],
                ["baseVault", [32]],
                ["quoteVault", [32]],
                ["orderbook", [32]],
                ["admin", [32]],
                ["creationTimestamp", "u64"],
                ["baseVolume", "u64"],
                ["quoteVolume", "u64"],
                ["accumulatedFees", "u64"],
                ["minBaseOrderSize", "u64"],
                ["signerNonce", "u64"],
                ["feeTierThresholds", ["u64", 6]],
                ["feeTierTakerBpsRates", ["u64", 7]],
                ["feeTierMakerBpsRates", ["u64", 7]],
            ],
        },
    ],
]);
class UserAccount {
    constructor(obj) {
        this.tag = obj.tag.toNumber();
        this.market = new web3_js_1.PublicKey(obj.market);
        this.owner = new web3_js_1.PublicKey(obj.owner);
        this.baseTokenFree = obj.baseTokenFree;
        this.baseTokenLocked = obj.baseTokenLocked;
        this.quoteTokenFree = obj.quoteTokenFree;
        this.quoteTokenLocked = obj.quoteTokenLocked;
        this.orders = obj.orders;
        this.accumulatedRebates = obj.accumulatedRebates;
        this.accumulatedMakerQuoteVolume = obj.accumulatedMakerQuoteVolume;
        this.accumulatedMakerBaseVolume = obj.accumulatedMakerBaseVolume;
        this.accumulatedTakerQuoteVolume = obj.accumulatedTakerQuoteVolume;
        this.accumulatedTakerBaseVolume = obj.accumulatedTakerBaseVolume;
    }
    static async retrieve(connection, userAccount) {
        const accountInfo = await connection.getAccountInfo(userAccount);
        if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data)) {
            throw new Error("Invalid account provided");
        }
        return (0, borsh_1.deserializeUnchecked)(this.schema, UserAccount, accountInfo.data);
    }
}
exports.UserAccount = UserAccount;
UserAccount.schema = new Map([
    [
        UserAccount,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["market", [32]],
                ["owner", [32]],
                ["baseTokenFree", "u64"],
                ["baseTokenLocked", "u64"],
                ["quoteTokenFree", "u64"],
                ["quoteTokenLocked", "u64"],
                ["accumulatedRebates", "u64"],
                ["accumulatedMakerQuoteVolume", "u64"],
                ["accumulatedMakerBaseeVolume", "u64"],
                ["accumulatedTakerQuoteVolume", "u64"],
                ["accumulatedTakerBaseVolume", "u64"],
                ["_padding", "u32"],
                ["orders", ["u128"]],
            ],
        },
    ],
]);
//# sourceMappingURL=state.js.map