"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarketInstruction = exports.sweepFeesInstruction = exports.consumeEventsInstruction = exports.closeMarketInstruction = exports.initializeAccountInstruction = exports.settleInstruction = exports.cancelOrderInstruction = exports.newOrderInstruction = exports.closeAccountInstruction = void 0;
// This file is auto-generated. DO NOT EDIT
const bn_js_1 = __importDefault(require("bn.js"));
const borsh_1 = require("borsh");
const web3_js_1 = require("@solana/web3.js");
class closeAccountInstruction {
    constructor() {
        this.tag = new bn_js_1.default(7);
    }
    serialize() {
        return (0, borsh_1.serialize)(closeAccountInstruction.schema, this);
    }
    getInstruction(programId, user, userOwner, targetLamportsAccount) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: user,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userOwner,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: targetLamportsAccount,
            isSigner: false,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.closeAccountInstruction = closeAccountInstruction;
closeAccountInstruction.schema = new Map([
    [
        closeAccountInstruction,
        {
            kind: "struct",
            fields: [["tag", "u64"]],
        },
    ],
]);
class newOrderInstruction {
    constructor(obj) {
        this.tag = new bn_js_1.default(1);
        this.limitPrice = obj.limitPrice;
        this.maxBaseQty = obj.maxBaseQty;
        this.maxQuoteQty = obj.maxQuoteQty;
        this.matchLimit = obj.matchLimit;
        this.side = obj.side;
        this.orderType = obj.orderType;
        this.selfTradeBehavior = obj.selfTradeBehavior;
        this.padding = new Uint8Array(5).fill(0);
    }
    serialize() {
        return (0, borsh_1.serialize)(newOrderInstruction.schema, this);
    }
    getInstruction(programId, splTokenProgram, systemProgram, market, orderbook, eventQueue, bids, asks, baseVault, quoteVault, user, userTokenAccount, userOwner, discountTokenAccount) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: splTokenProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: orderbook,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: eventQueue,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: bids,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: asks,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: baseVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: quoteVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: user,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userTokenAccount,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userOwner,
            isSigner: true,
            isWritable: true,
        });
        if (!!discountTokenAccount) {
            keys.push({
                pubkey: discountTokenAccount,
                isSigner: false,
                isWritable: false,
            });
        }
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.newOrderInstruction = newOrderInstruction;
newOrderInstruction.schema = new Map([
    [
        newOrderInstruction,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["limitPrice", "u64"],
                ["maxBaseQty", "u64"],
                ["maxQuoteQty", "u64"],
                ["matchLimit", "u64"],
                ["side", "u8"],
                ["orderType", "u8"],
                ["selfTradeBehavior", "u8"],
                ["padding", [5]],
            ],
        },
    ],
]);
class cancelOrderInstruction {
    constructor(obj) {
        this.tag = new bn_js_1.default(2);
        this.orderIndex = obj.orderIndex;
        this.orderId = obj.orderId;
    }
    serialize() {
        return (0, borsh_1.serialize)(cancelOrderInstruction.schema, this);
    }
    getInstruction(programId, market, orderbook, eventQueue, bids, asks, user, userOwner) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: orderbook,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: eventQueue,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: bids,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: asks,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: user,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userOwner,
            isSigner: true,
            isWritable: false,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.cancelOrderInstruction = cancelOrderInstruction;
cancelOrderInstruction.schema = new Map([
    [
        cancelOrderInstruction,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["orderIndex", "u64"],
                ["orderId", "u128"],
            ],
        },
    ],
]);
class settleInstruction {
    constructor() {
        this.tag = new bn_js_1.default(4);
    }
    serialize() {
        return (0, borsh_1.serialize)(settleInstruction.schema, this);
    }
    getInstruction(programId, splTokenProgram, market, baseVault, quoteVault, marketSigner, user, userOwner, destinationBaseAccount, destinationQuoteAccount) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: splTokenProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: baseVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: quoteVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: marketSigner,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: user,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userOwner,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: destinationBaseAccount,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: destinationQuoteAccount,
            isSigner: false,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.settleInstruction = settleInstruction;
settleInstruction.schema = new Map([
    [
        settleInstruction,
        {
            kind: "struct",
            fields: [["tag", "u64"]],
        },
    ],
]);
class initializeAccountInstruction {
    constructor(obj) {
        this.tag = new bn_js_1.default(5);
        this.market = obj.market;
        this.maxOrders = obj.maxOrders;
    }
    serialize() {
        return (0, borsh_1.serialize)(initializeAccountInstruction.schema, this);
    }
    getInstruction(programId, systemProgram, user, userOwner, feePayer) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: user,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: userOwner,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: feePayer,
            isSigner: true,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.initializeAccountInstruction = initializeAccountInstruction;
initializeAccountInstruction.schema = new Map([
    [
        initializeAccountInstruction,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["market", [32]],
                ["maxOrders", "u64"],
            ],
        },
    ],
]);
class closeMarketInstruction {
    constructor() {
        this.tag = new bn_js_1.default(8);
    }
    serialize() {
        return (0, borsh_1.serialize)(closeMarketInstruction.schema, this);
    }
    getInstruction(programId, market, baseVault, quoteVault, orderbook, eventQueue, bids, asks, marketAdmin, targetLamportsAccount) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: baseVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: quoteVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: orderbook,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: eventQueue,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: bids,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: asks,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: marketAdmin,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: targetLamportsAccount,
            isSigner: false,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.closeMarketInstruction = closeMarketInstruction;
closeMarketInstruction.schema = new Map([
    [
        closeMarketInstruction,
        {
            kind: "struct",
            fields: [["tag", "u64"]],
        },
    ],
]);
class consumeEventsInstruction {
    constructor(obj) {
        this.tag = new bn_js_1.default(3);
        this.maxIterations = obj.maxIterations;
    }
    serialize() {
        return (0, borsh_1.serialize)(consumeEventsInstruction.schema, this);
    }
    getInstruction(programId, market, orderbook, eventQueue, rewardTarget, userAccounts) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: orderbook,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: eventQueue,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: rewardTarget,
            isSigner: false,
            isWritable: true,
        });
        for (let k of userAccounts) {
            keys.push({
                pubkey: k,
                isSigner: false,
                isWritable: true,
            });
        }
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.consumeEventsInstruction = consumeEventsInstruction;
consumeEventsInstruction.schema = new Map([
    [
        consumeEventsInstruction,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["maxIterations", "u64"],
            ],
        },
    ],
]);
class sweepFeesInstruction {
    constructor() {
        this.tag = new bn_js_1.default(6);
    }
    serialize() {
        return (0, borsh_1.serialize)(sweepFeesInstruction.schema, this);
    }
    getInstruction(programId, market, marketSigner, marketAdmin, quoteVault, destinationTokenAccount, splTokenProgram) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: marketSigner,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: marketAdmin,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: quoteVault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: destinationTokenAccount,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: splTokenProgram,
            isSigner: false,
            isWritable: false,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.sweepFeesInstruction = sweepFeesInstruction;
sweepFeesInstruction.schema = new Map([
    [
        sweepFeesInstruction,
        {
            kind: "struct",
            fields: [["tag", "u64"]],
        },
    ],
]);
class createMarketInstruction {
    constructor(obj) {
        this.tag = new bn_js_1.default(0);
        this.signerNonce = obj.signerNonce;
        this.minBaseOrderSize = obj.minBaseOrderSize;
        this.tickSize = obj.tickSize;
        this.crankerReward = obj.crankerReward;
        this.feeTierThresholds = obj.feeTierThresholds;
        this.feeTierTakerBpsRates = obj.feeTierTakerBpsRates;
        this.feeTierMakerBpsRebates = obj.feeTierMakerBpsRebates;
    }
    serialize() {
        return (0, borsh_1.serialize)(createMarketInstruction.schema, this);
    }
    getInstruction(programId, market, orderbook, baseVault, quoteVault, marketAdmin, eventQueue, asks, bids) {
        const data = Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: market,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: orderbook,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: baseVault,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: quoteVault,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: marketAdmin,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: eventQueue,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: asks,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: bids,
            isSigner: false,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.createMarketInstruction = createMarketInstruction;
createMarketInstruction.schema = new Map([
    [
        createMarketInstruction,
        {
            kind: "struct",
            fields: [
                ["tag", "u64"],
                ["signerNonce", "u64"],
                ["minBaseOrderSize", "u64"],
                ["tickSize", "u64"],
                ["crankerReward", "u64"],
                ["feeTierThresholds", ["u64", 6]],
                ["feeTierTakerBpsRates", ["u64", 7]],
                ["feeTierMakerBpsRebates", ["u64", 7]],
            ],
        },
    ],
]);
//# sourceMappingURL=raw_instructions.js.map