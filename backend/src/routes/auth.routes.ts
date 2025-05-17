import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
