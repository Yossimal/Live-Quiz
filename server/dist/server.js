"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routh_1 = __importDefault(require("./routes/auth/routh"));
const routh_2 = __importDefault(require("./routes/quizzes/routh"));
const tokens_1 = require("./routes/auth/tokens");
const routh_3 = __importDefault(require("./routes/media/routh"));
const authenticate_1 = __importDefault(require("./middlewares/authenticate"));
const socket_io_1 = require("socket.io");
const routh_4 = __importDefault(require("./routes/privateAuth/routh"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const routh_5 = __importDefault(require("./routes/mediaGet/routh"));
const gameOnlineHandler_1 = __importDefault(require("./gameOnline/gameOnlineHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send({ uptime: process.uptime() });
});
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});
app.use("/auth", routh_1.default);
app.use("/api/quiz", authenticate_1.default, routh_2.default);
app.use("/api/media", authenticate_1.default, routh_3.default);
app.use("/media", routh_5.default);
app.use("/api/auth", authenticate_1.default, routh_4.default);
exports.io.on("connection", gameOnlineHandler_1.default);
const port = process.env.PORT || 3000;
(0, tokens_1.connectRedis)().then((_) => {
    server.listen(port, async () => {
        console.log(`Server running on port ${port}`);
    });
});
//# sourceMappingURL=server.js.map