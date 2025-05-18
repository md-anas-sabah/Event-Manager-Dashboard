import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/event.routes";
import participantRoutes from "./routes/participant.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

const FRONTEND_URL =
  process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";

const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Origin ${origin} not allowed by CORS`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Origin",
      "Accept",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    allowedOrigins: allowedOrigins,
  });
});

app.post("/api/test-cors", (req: Request, res: Response) => {
  console.log("Test CORS route called with body:", req.body);
  res.status(200).json({
    message: "CORS is working correctly!",
    received: req.body,
    origin: req.headers.origin || "No origin",
  });
});

app.use("/api/events", eventRoutes);
app.use("/api", participantRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins:`, allowedOrigins);
});

export default app;
