import { Request, Response, NextFunction } from "express";
import pool from "../utils/db";
import { tokenUtils, TokenPayload } from "../utils/token.utils";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const payload = tokenUtils.verifyToken(token);

    if (!payload) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const isEventOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const eventId = parseInt(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const query = "SELECT * FROM events WHERE id = $1 AND user_id = $2";
    const values = [eventId, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res
        .status(403)
        .json({ message: "Access denied: You are not the event owner" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking event ownership:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
