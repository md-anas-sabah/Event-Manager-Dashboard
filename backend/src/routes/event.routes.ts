import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { authenticateToken, isEventOwner } from "../middleware/auth.middleware";

const router = Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

router.post("/", authenticateToken, eventController.createEvent);
router.put(
  "/:id",
  authenticateToken,
  isEventOwner,
  eventController.updateEvent
);
router.delete(
  "/:id",
  authenticateToken,
  isEventOwner,
  eventController.deleteEvent
);
router.get("/user/events", authenticateToken, eventController.getUserEvents);

export default router;
