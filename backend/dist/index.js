"use strict";
// import express, { Request, Response } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import eventRoutes from "./routes/event.routes";
// import participantRoutes from "./routes/participant.routes";
// import authRoutes from "./routes/auth.routes";
// import { errorHandler } from "./middleware/auth.middleware";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.FRONTEND_URL || "http://localhost:3000"
//         : "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.options(
//   /.*/,
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );
// app.get("/api/health", (req: Request, res: Response) => {
//   res.status(200).json({ status: "ok", message: "API is running" });
// });
// app.use("/api/events", eventRoutes);
// app.use("/api", participantRoutes);
// app.use("/api/auth", authRoutes);
// app.use(errorHandler);
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const participant_routes_1 = __importDefault(require("./routes/participant.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "API is running" });
});
app.post("/api/test-cors", (req, res) => {
    console.log("Test CORS route called with body:", req.body);
    res.status(200).json({
        message: "CORS is working correctly!",
        received: req.body,
    });
});
app.use("/api/events", event_routes_1.default);
app.use("/api", participant_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use(auth_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for origin: ${FRONTEND_URL}`);
});
exports.default = app;
