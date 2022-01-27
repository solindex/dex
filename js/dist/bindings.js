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
exports.closeAccount = exports.comsumEvents = exports.settle = exports.initializeAccount = exports.cancelOrder = exports.placeOrder = exports.createMarket = void 0;
const web3_js_1 = require("@solana/web3.js");
const ids_1 = require("./ids");
const raw_instructions_1 = require("./raw_instructions");
const aaob = __importStar(require("@bonfida/aaob"));
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
const spl_token_1 = require("@solana/spl-token");
/**
 * Constants
 */
const MARKET_STATE_SPACE = 408;
const NODE_CAPACITY = 100;
const EVENT_CAPACITY = 100;
const createMarket = async (connection, baseMint, quoteMint, minBaseOrderSize, feePayer, marketAdmin, tickSize, crankerReward, feeTierThresholds, feeTierTakerBpsRates, feeTierMakerBpsRebates) => {
    // Market Account
    const marketAccount = new web3_js_1.Keypair();
    console.log(`Market address ${marketAccount.publicKey.toBase58()}`);
    const balance = await connection.getMinimumBalanceForRentExemption(MARKET_STATE_SPACE);
    const createMarketAccount = web3_js_1.SystemProgram.createAccount({
        fromPubkey: feePayer,
        lamports: balance,
        newAccountPubkey: marketAccount.publicKey,
        programId: ids_1.DEX_ID,
        space: MARKET_STATE_SPACE,
    });
    // Market signer
    const [marketSigner, marketSignerNonce] = await web3_js_1.PublicKey.findProgramAddress([marketAccount.publicKey.toBuffer()], ids_1.DEX_ID);
    // AAOB instructions
    const [aaobSigners, aaobInstructions] = await aaob.createMarket(connection, marketSigner, new bn_js_1.default(33), new bn_js_1.default(32), EVENT_CAPACITY, NODE_CAPACITY, new bn_js_1.default(minBaseOrderSize), feePayer, tickSize, crankerReward, ids_1.DEX_ID);
    // Remove the AOB create_market instruction as it is not needed with lib usage
    aaobInstructions.pop();
    // Base vault
    const createBaseVault = await (0, utils_1.createAssociatedTokenAccount)(feePayer, marketSigner, baseMint);
    // Quote vault
    const createQuoteVault = await (0, utils_1.createAssociatedTokenAccount)(feePayer, marketSigner, quoteMint);
    const createMarket = new raw_instructions_1.createMarketInstruction({
        signerNonce: new bn_js_1.default(marketSignerNonce),
        minBaseOrderSize: new bn_js_1.default(minBaseOrderSize),
        tickSize: tickSize,
        crankerReward: new bn_js_1.default(crankerReward),
        feeTierThresholds,
        feeTierTakerBpsRates,
        feeTierMakerBpsRebates,
    }).getInstruction(ids_1.DEX_ID, marketAccount.publicKey, aaobSigners[3].publicKey, await (0, utils_1.findAssociatedTokenAddress)(marketSigner, baseMint), await (0, utils_1.findAssociatedTokenAddress)(marketSigner, quoteMint), marketAdmin, aaobSigners[0].publicKey, aaobSigners[1].publicKey, aaobSigners[2].publicKey);
    return [
        [[marketAccount], [createMarketAccount]],
        [aaobSigners, aaobInstructions],
        [[], [createBaseVault, createQuoteVault, createMarket]],
    ];
};
exports.createMarket = createMarket;
const placeOrder = async (market, side, limitPrice, size, type, selfTradeBehaviour, ownerTokenAccount, owner, discountTokenAccount) => {
    const [userAccount] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
    // Uncomment for mainnet
    // if (!discountTokenAccount) {
    //   discountTokenAccount = await findAssociatedTokenAddress(owner, SRM_MINT);
    // }
    const instruction = new raw_instructions_1.newOrderInstruction({
        side: side,
        limitPrice: new bn_js_1.default(limitPrice * 2 ** 32),
        maxBaseQty: new bn_js_1.default(size),
        maxQuoteQty: new bn_js_1.default(Math.ceil(size * limitPrice)),
        orderType: type,
        selfTradeBehavior: selfTradeBehaviour,
        matchLimit: new bn_js_1.default(Number.MAX_SAFE_INTEGER), // TODO Change
    }).getInstruction(ids_1.DEX_ID, spl_token_1.TOKEN_PROGRAM_ID, web3_js_1.SystemProgram.programId, market.address, market.orderbookAddress, market.eventQueueAddress, market.bidsAddress, market.asksAddress, market.baseVault, market.quoteVault, userAccount, ownerTokenAccount, owner, discountTokenAccount);
    return instruction;
};
exports.placeOrder = placeOrder;
const cancelOrder = async (market, orderIndex, orderId, owner) => {
    const [marketSigner] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer()], ids_1.DEX_ID);
    const [userAccount] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
    const instruction = new raw_instructions_1.cancelOrderInstruction({
        orderIndex,
        orderId,
    }).getInstruction(ids_1.DEX_ID, market.address, market.orderbookAddress, market.eventQueueAddress, market.bidsAddress, market.asksAddress, userAccount, owner);
    return instruction;
};
exports.cancelOrder = cancelOrder;
const initializeAccount = async (market, owner, maxOrders = 20) => {
    const [userAccount] = await web3_js_1.PublicKey.findProgramAddress([market.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
    const instruction = new raw_instructions_1.initializeAccountInstruction({
        market: market.toBuffer(),
        maxOrders: new bn_js_1.default(maxOrders),
    }).getInstruction(ids_1.DEX_ID, web3_js_1.SystemProgram.programId, userAccount, owner, owner);
    return instruction;
};
exports.initializeAccount = initializeAccount;
const settle = async (market, owner, destinationBaseAccount, destinationQuoteAccount) => {
    const [marketSigner] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer()], ids_1.DEX_ID);
    const [userAccount] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
    const instruction = new raw_instructions_1.settleInstruction().getInstruction(ids_1.DEX_ID, spl_token_1.TOKEN_PROGRAM_ID, market.address, market.baseVault, market.quoteVault, marketSigner, userAccount, owner, destinationBaseAccount, destinationQuoteAccount);
    return instruction;
};
exports.settle = settle;
const comsumEvents = async (market, rewardTarget, userAccounts, maxIterations) => {
    const [marketSigner] = await web3_js_1.PublicKey.findProgramAddress([market.address.toBuffer()], ids_1.DEX_ID);
    const instruction = new raw_instructions_1.consumeEventsInstruction({
        maxIterations,
    }).getInstruction(ids_1.DEX_ID, market.address, market.orderbookAddress, market.eventQueueAddress, rewardTarget, userAccounts);
    return instruction;
};
exports.comsumEvents = comsumEvents;
const closeAccount = async (market, owner) => {
    const [userAccount] = await web3_js_1.PublicKey.findProgramAddress([market.toBuffer(), owner.toBuffer()], ids_1.DEX_ID);
    const instruction = new raw_instructions_1.closeAccountInstruction().getInstruction(ids_1.DEX_ID, userAccount, owner, owner);
    return instruction;
};
exports.closeAccount = closeAccount;
//# sourceMappingURL=bindings.js.map