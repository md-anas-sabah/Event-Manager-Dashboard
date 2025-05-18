"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.tokenUtils = {
    /**
     * Generate a token using a simple encoding method
     * @param payload Data to encode in the token
     * @param expiresInDays Number of days until token expiration
     * @returns Encoded token string
     */
    generateToken(payload, expiresInDays = 7) {
        // Add expiration timestamp
        const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
        const dataWithExpiry = { ...payload, exp: expiresAt };
        // Convert payload to string
        const dataString = JSON.stringify(dataWithExpiry);
        // Generate a hash
        const secret = process.env.APP_SECRET || "default-secret-key";
        const hash = crypto_1.default
            .createHmac("sha256", secret)
            .update(dataString)
            .digest("hex");
        // Combine data and hash, and encode
        const tokenData = JSON.stringify({ data: dataString, hash });
        return Buffer.from(tokenData).toString("base64");
    },
    /**
     * Verify and decode a token
     * @param token The token to verify and decode
     * @returns Decoded payload or null if invalid
     */
    verifyToken(token) {
        try {
            const tokenData = Buffer.from(token, "base64").toString();
            const { data, hash } = JSON.parse(tokenData);
            const secret = process.env.APP_SECRET || "default-secret-key";
            const computedHash = crypto_1.default
                .createHmac("sha256", secret)
                .update(data)
                .digest("hex");
            if (hash !== computedHash) {
                return null;
            }
            const payload = JSON.parse(data);
            if (payload.exp && payload.exp < Date.now()) {
                return null;
            }
            return payload;
        }
        catch (error) {
            console.error("Token verification error:", error);
            return null;
        }
    },
};
