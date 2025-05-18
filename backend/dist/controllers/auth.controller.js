"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel = __importStar(require("../models/user.model"));
const token_utils_1 = require("../utils/token.utils");
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
const register = async (req, res) => {
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
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // Create user
        const user = await userModel.createUser({
            name,
            email,
            password: hashedPassword,
        });
        // Generate token
        const secret = process.env.APP_SECRET || "default-secret-key";
        const token = token_utils_1.tokenUtils.generateToken({
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
    }
    catch (error) {
        console.error("Controller error registering user:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
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
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = token_utils_1.tokenUtils.generateToken({
            id: user.id,
            email: user.email,
        }, 7);
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
    }
    catch (error) {
        console.error("Controller error logging in user:", error);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const getProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error("Controller error getting user profile:", error);
        res.status(500).json({ message: "Failed to get profile" });
    }
};
exports.getProfile = getProfile;
