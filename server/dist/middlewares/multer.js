"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
function getMulter(dir) {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${dir}`);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
        },
    });
    return (0, multer_1.default)({ storage });
}
exports.getMulter = getMulter;
//# sourceMappingURL=multer.js.map