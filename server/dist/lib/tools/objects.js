"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
function removeUndefined(obj) {
    Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
    return obj;
}
exports.removeUndefined = removeUndefined;
//# sourceMappingURL=objects.js.map