"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrioritisedEvent = void 0;
var getPrioritisedEvent = function (evts) {
    var e_1, _a;
    var top = undefined;
    try {
        for (var evts_1 = __values(evts), evts_1_1 = evts_1.next(); !evts_1_1.done; evts_1_1 = evts_1.next()) {
            var evt = evts_1_1.value;
            if (!top || top.priority < evt.priority) {
                top = evt;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (evts_1_1 && !evts_1_1.done && (_a = evts_1.return)) _a.call(evts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return top;
};
exports.getPrioritisedEvent = getPrioritisedEvent;
