"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.isEventOwner = exports.authenticateToken = void 0;
const db_1 = __importDefault(require("../utils/db"));
const token_utils_1 = require("../utils/token.utils");
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    try {
        const payload = token_utils_1.tokenUtils.verifyToken(token);
        if (!payload) {
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }
        req.user = payload;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
const isEventOwner = async (req, res, next) => {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    try {
        const query = "SELECT * FROM events WHERE id = $1 AND user_id = $2";
        const values = [eventId, userId];
        const result = await db_1.default.query(query, values);
        if (result.rows.length === 0) {
            res
                .status(403)
                .json({ message: "Access denied: You are not the event owner" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error checking event ownership:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.isEventOwner = isEventOwner;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
