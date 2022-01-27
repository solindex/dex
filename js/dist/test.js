"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const web3_js_1 = require("@solana/web3.js");
const bindings_1 = require("./bindings");
const utils_1 = require("./utils");
const market_1 = require("./market");
const types_1 = require("./types");
const state_1 = require("./state");
require("source-map-support").install();
const URL = "https://api.devnet.solana.com";
const connection = new web3_js_1.Connection(URL);
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("No secret key");
}
const wallet = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(SECRET_KEY)));
console.log(`Wallet ${wallet.publicKey.toBase58()}`);
const mint1 = new web3_js_1.PublicKey("72m4rktxyKqWQxTnXz1rpjJ6v9RPaa6mW5Qb2aizQ8Zq");
const mint2 = new web3_js_1.PublicKey("Cetq9LiKkhvQuyHRjbk1FSbbsWSCCEVvPVQ4BHCHDF3t");
const marketAddress = new web3_js_1.PublicKey("Gdaxn4WkV2ZyNcMYsUWiAnmjy4YqSka4woy8ggazh4ba");
const test = async () => {
    // Load market
    const market = await market_1.Market.load(connection, marketAddress);
    // Create market
    //
    // const instructions = await createMarket(
    //   connection,
    //   mint1,
    //   mint2,
    //   1,
    //   wallet.publicKey,
    //   wallet.publicKey
    // );
    // for (let primedTx of instructions) {
    //   const tx = await signAndSendTransactionInstructions(
    //     connection,
    //     primedTx[0],
    //     wallet,
    //     primedTx[1]
    //   );
    //   await sleep(1_000);
    //   console.log(`Tx ${tx}`);
    // }
    // Create user account
    // const instUA = await initializeAccount(market.address, wallet.publicKey, 10);
    // await signAndSendTransactionInstructions(connection, [wallet], wallet, [
    //   instUA,
    // ]);
    // return;
    // Place order
    // const init_inst = await initializeAccount(marketAddress, wallet.publicKey);
    // const init_tx = await signAndSendTransactionInstructions(
    //   connection,
    //   [wallet],
    //   wallet,
    //   [init_inst]
    // );
    // console.log(`Init acc ${init_tx}`);
    // await sleep(30_000);
    console.log((await (0, utils_1.findAssociatedTokenAddress)(wallet.publicKey, market.baseMintAddress)).toBase58());
    console.log(market.baseMintAddress.toBase58());
    const inst = await (0, bindings_1.placeOrder)(market, types_1.Side.Ask, 1500, 5 * Math.pow(10, market.baseDecimals), types_1.OrderType.Limit, state_1.SelfTradeBehavior.CancelProvide, await (0, utils_1.findAssociatedTokenAddress)(wallet.publicKey, market.baseMintAddress), wallet.publicKey);
    const tx = await (0, utils_1.signAndSendTransactionInstructions)(connection, [wallet], wallet, [inst]);
    console.log(`Tx place order ${tx}`);
    // const slotSize = Math.max(CALLBACK_INFO_LEN + 8 + 16 + 1, 32);
    // const info = await connection.getAccountInfo(market.orderbookState.asks);
    // if (!info?.data) {
    //   throw new Error("Invalid data");
    // }
    // const { data } = info;
    // const slabHeader = aaob.SlabHeader.deserialize(
    //   data.slice(0, aaob.SlabHeader.LEN)
    // ) as aaob.SlabHeader;
    // const slab = new aaob.Slab({
    //   header: slabHeader,
    //   callBackInfoLen: 33,
    //   data: data,
    // });
    // console.log(slab.getMinMax(false));
    // User account
    // let user_wallet = new PublicKey(
    //   "3uf6wzMet5ZvzcfSeodTSdnNDD6xSauP3GpiBTvkLbvz"
    // );
    // const ua = await OpenOrders.load(connection, market.address, user_wallet);
    // console.log(ua.quoteTokenFree.toNumber());
    // let marketVaultBalance = await connection.getTokenAccountBalance(
    //   market.quoteVault
    // );
    // console.log(marketVaultBalance);
    // const o = ua.orders[0];
    // const inst = await cancelOrder(market, new BN(0), wallet.publicKey);
    // const tx = await signAndSendTransactionInstructions(
    //   connection,
    //   [wallet],
    //   wallet,
    //   [inst]
    // );
    // console.log(`Cancel ${tx}`);
};
test();
//# sourceMappingURL=test.js.map