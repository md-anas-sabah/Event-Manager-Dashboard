import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as userModel from "../models/user.model";
import { tokenUtils } from "../utils/token.utils";

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       res.status(400).json({ message: "All fields are required" });
//       return;
//     }

//     const existingUser = await userModel.getUserByEmail(email);

//     if (existingUser) {
//       res.status(409).json({ message: "User with this email already exists" });
//       return;
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const user = await userModel.createUser({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const token = tokenUtils.generateToken(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       7
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     console.error("Controller error registering user:", error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const secret = process.env.APP_SECRET || "default-secret-key";
    const token = tokenUtils.generateToken({
      id: user.id,
      email: user.email,
    });

    // Set cookie with appropriate settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user info (excluding password)
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Controller error registering user:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = tokenUtils.generateToken(
      {
        id: user.id,
        email: user.email,
      },
      7
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Controller error logging in user:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await userModel.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Controller error getting user profile:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};
