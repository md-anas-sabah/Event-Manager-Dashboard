import crypto from "crypto";

// Define token payload interface
export interface TokenPayload {
  id: number;
  email: string;
  exp?: number;
}

/**
 * Simple token utility without using JWT
 */
export const tokenUtils = {
  /**
   * Generate a token using a simple encoding method
   * @param payload Data to encode in the token
   * @param expiresInDays Number of days until token expiration
   * @returns Encoded token string
   */
  generateToken(payload: TokenPayload, expiresInDays: number = 7): string {
    // Add expiration timestamp
    const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
    const dataWithExpiry = { ...payload, exp: expiresAt };

    // Convert payload to string
    const dataString = JSON.stringify(dataWithExpiry);

    // Generate a hash
    const secret = process.env.APP_SECRET || "default-secret-key";
    const hash = crypto
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
  verifyToken(token: string): TokenPayload | null {
    try {
      // Decode from base64
      const tokenData = Buffer.from(token, "base64").toString();
      const { data, hash } = JSON.parse(tokenData);

      // Verify hash
      const secret = process.env.APP_SECRET || "default-secret-key";
      const computedHash = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");

      // Check if hash is valid
      if (hash !== computedHash) {
        return null;
      }

      // Parse payload
      const payload = JSON.parse(data) as TokenPayload;

      // Check if token is expired
      if (payload.exp && payload.exp < Date.now()) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  },
};
