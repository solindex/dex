"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfTradeBehavior = exports.OrderType = exports.Side = void 0;
var Side;
(function (Side) {
    Side[Side["Bid"] = 0] = "Bid";
    Side[Side["Ask"] = 1] = "Ask";
})(Side = exports.Side || (exports.Side = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Limit"] = 0] = "Limit";
    OrderType[OrderType["ImmediateOrCancel"] = 1] = "ImmediateOrCancel";
    OrderType[OrderType["FillOrKill"] = 2] = "FillOrKill";
    OrderType[OrderType["PostOnly"] = 3] = "PostOnly";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var SelfTradeBehavior;
(function (SelfTradeBehavior) {
    SelfTradeBehavior[SelfTradeBehavior["DecrementTake"] = 0] = "DecrementTake";
    SelfTradeBehavior[SelfTradeBehavior["CancelProvide"] = 1] = "CancelProvide";
    SelfTradeBehavior[SelfTradeBehavior["AbortTransaction"] = 2] = "AbortTransaction";
})(SelfTradeBehavior = exports.SelfTradeBehavior || (exports.SelfTradeBehavior = {}));
//# sourceMappingURL=types.js.map