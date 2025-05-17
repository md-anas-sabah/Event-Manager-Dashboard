// import express, { Request, Response } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import eventRoutes from "./routes/event.routes";
// import participantRoutes from "./routes/participant.routes";
// import authRoutes from "./routes/auth.routes";
// import { errorHandler } from "./middleware/auth.middleware";

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

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/event.routes";
import participantRoutes from "./routes/participant.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/auth.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Use the cors package correctly
app.use(
  cors({
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
  })
);

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Test CORS route
app.post("/api/test-cors", (req: Request, res: Response) => {
  console.log("Test CORS route called with body:", req.body);
  res.status(200).json({
    message: "CORS is working correctly!",
    received: req.body,
  });
});

// API routes
app.use("/api/events", eventRoutes);
app.use("/api", participantRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${FRONTEND_URL}`);
});

export default app;
