import crypto from "crypto";

export interface TokenPayload {
  id: number;
  email: string;
  exp?: number;
}

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
      const tokenData = Buffer.from(token, "base64").toString();
      const { data, hash } = JSON.parse(tokenData);

      const secret = process.env.APP_SECRET || "default-secret-key";
      const computedHash = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");

      if (hash !== computedHash) {
        return null;
      }

      const payload = JSON.parse(data) as TokenPayload;

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
