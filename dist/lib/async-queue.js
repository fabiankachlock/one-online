"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = void 0;
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue(buffer) {
        var _this = this;
        if (buffer === void 0) { buffer = 1; }
        this.buffer = buffer;
        this.isClosed = false;
        this.queue = [];
        this.waitingPromise = new Promise(function () { });
        this.resolveNext = function () { };
        this.notifyNext = function () {
            // resolve pending promise (open await blocks)
            _this.resolveNext();
            // and setup next promise
            _this.waitingPromise = new Promise(function (resolve) {
                _this.resolveNext = function () { return resolve({}); };
            });
        };
        this.close = function () {
            if (_this.isClosed) {
                throw new Error('channel already closed');
            }
            _this.isClosed = true;
            _this.notifyNext();
        };
        this.send = function (item) {
            if (_this.isClosed) {
                throw new Error("Can't send on a closed channel");
            }
            if (_this.queue.length < _this.buffer) {
                // store next item and send notify waiting receiver
                _this.queue.unshift(item);
                _this.notifyNext();
            }
            else {
                throw new Error('Channel full');
            }
        };
        this.pauseReceiver = function () {
            var relieve = function () { };
            _this.customWaitingPromise = new Promise(function (resolve) {
                return (relieve = function () {
                    resolve({});
                    _this.customWaitingPromise = undefined;
                });
            });
            return relieve;
        };
        this.receive = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isClosed && this.queue.length === 0) {
                            return [2 /*return*/, {
                                    value: undefined,
                                    ok: false
                                }];
                        }
                        if (this.queue.length > 0) {
                            return [2 /*return*/, {
                                    value: this.queue.pop(),
                                    ok: !(this.isClosed && this.queue.length === 0)
                                }];
                        }
                        // await next change
                        return [4 /*yield*/, this.waitingPromise];
                    case 1:
                        // await next change
                        _a.sent();
                        if (!this.customWaitingPromise) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.customWaitingPromise];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.receive()];
                }
            });
        }); };
        // setup waiting promise
        this.notifyNext();
    }
    return AsyncQueue;
}());
exports.AsyncQueue = AsyncQueue;