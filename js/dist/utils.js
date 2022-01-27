"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divideBnToNumber = exports.sleep = exports.signAndSendTransactionInstructions = exports.createAssociatedTokenAccount = exports.findAssociatedTokenAddress = exports.getTokenBalance = exports.getMintDecimals = exports.throwIfNull = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
function throwIfNull(value, message = "account not found") {
    if (value === null) {
        throw new Error(message);
    }
    return value;
}
exports.throwIfNull = throwIfNull;
const getMintDecimals = async (connection, mint) => {
    var _a;
    const { value } = throwIfNull(await connection.getParsedAccountInfo(mint), "Mint not found");
    // @ts-ignore
    return (_a = value === null || value === void 0 ? void 0 : value.data) === null || _a === void 0 ? void 0 : _a.parsed.info.decimals;
};
exports.getMintDecimals = getMintDecimals;
const getTokenBalance = async (connection, address) => {
    const { value } = throwIfNull(await connection.getParsedAccountInfo(address), "Token account does not exist");
    // @ts-ignore
    return value === null || value === void 0 ? void 0 : value.data.parsed.uiAmount;
};
exports.getTokenBalance = getTokenBalance;
async function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return (await web3_js_1.PublicKey.findProgramAddress([
        walletAddress.toBuffer(),
        spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
    ], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID))[0];
}
exports.findAssociatedTokenAddress = findAssociatedTokenAddress;
const createAssociatedTokenAccount = async (fundingAddress, walletAddress, splTokenMintAddress) => {
    const associatedTokenAddress = await findAssociatedTokenAddress(walletAddress, splTokenMintAddress);
    const keys = [
        {
            pubkey: fundingAddress,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: spl_token_1.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
};
exports.createAssociatedTokenAccount = createAssociatedTokenAccount;
const signAndSendTransactionInstructions = async (
// sign and send transaction
connection, signers, feePayer, txInstructions) => {
    const tx = new web3_js_1.Transaction();
    tx.feePayer = feePayer.publicKey;
    signers.push(feePayer);
    tx.add(...txInstructions);
    return await connection.sendTransaction(tx, signers, {
        skipPreflight: false,
    });
};
exports.signAndSendTransactionInstructions = signAndSendTransactionInstructions;
async function sleep(ms) {
    console.log("Sleeping for ", ms, " ms");
    return await new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
const divideBnToNumber = (numerator, denominator) => {
    const quotient = numerator.div(denominator).toNumber();
    const rem = numerator.umod(denominator);
    const gcd = rem.gcd(denominator);
    return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber();
};
exports.divideBnToNumber = divideBnToNumber;
//# sourceMappingURL=utils.js.map