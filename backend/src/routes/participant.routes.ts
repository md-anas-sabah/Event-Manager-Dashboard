import { Router } from "express";
import * as participantController from "../controllers/participant.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/events/:id/register",
  authenticateToken,
  participantController.registerForEvent
);

router.get(
  "/events/:id/participants",
  authenticateToken,
  participantController.getEventParticipants
);

router.put(
  "/events/:eventId/participants/:userId/cancel",
  authenticateToken,
  participantController.cancelParticipantRegistration
);

router.get(
  "/user/participating",
  authenticateToken,
  participantController.getUserParticipatingEvents
);

export default router;
