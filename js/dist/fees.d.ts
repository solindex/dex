/** Serum fee tiers */
export declare const FEES: {
    6: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    5: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    4: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    3: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    2: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    1: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
    0: {
        fees: {
            taker: number;
            maker: number;
        };
        srm: number;
        msrm: number;
    };
};
/**
 * Returns the taker and maker fees given a fee schedule
 * @param feeTier Fee tier (number from 0 to 6)
 * @returns Returns the taker and maker fees in %
 */
export declare const getFeeRates: (feeTier: number) => any;
/**
 * Returns the fee tier corresponding to given (M)SRM balances
 * @param msrmBalance SRM balances
 * @param srmBalance MSRM balances
 * @returns Returns the fee tier corresponding to the SRM and MSRM balances
 */
export declare const getFeeTier: (msrmBalance: number, srmBalance: number) => number;
