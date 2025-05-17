import { Response } from "express";
import * as participantModel from "../models/participant.model";
import * as eventModel from "../models/event.model";
import { AuthRequest } from "../middleware/auth.middleware";

// Register for an event
export const registerForEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    // Check if event exists
    const event = await eventModel.getEventById(eventId);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check if user is already registered
    const existingRegistration = await participantModel.checkUserRegistration(
      eventId,
      userId
    );

    if (existingRegistration) {
      if (existingRegistration.status === "registered") {
        res
          .status(400)
          .json({ message: "You are already registered for this event" });
        return;
      } else if (existingRegistration.status === "cancelled") {
        res
          .status(400)
          .json({ message: "Your registration was previously cancelled" });
        return;
      }
    }

    // Register user for the event
    const registration = await participantModel.registerForEvent(
      eventId,
      userId
    );
    res.status(201).json(registration);
  } catch (error) {
    console.error("Controller error registering for event:", error);
    res.status(500).json({ message: "Failed to register for event" });
  }
};

// Cancel user registration (by event owner)
export const cancelParticipantRegistration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.eventId);
    const participantId = parseInt(req.params.userId);
    const { reason } = req.body;

    if (!req.user?.id) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (isNaN(eventId) || isNaN(participantId)) {
      res.status(400).json({ message: "Invalid IDs provided" });
      return;
    }

    if (!reason) {
      res.status(400).json({ message: "Cancellation reason is required" });
      return;
    }

    // Check if event exists and user is the owner
    const event = await eventModel.getEventById(eventId);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.user_id !== req.user.id) {
      res
        .status(403)
        .json({ message: "Only event owner can cancel registrations" });
      return;
    }

    // Check if participant is registered
    const registration = await participantModel.checkUserRegistration(
      eventId,
      participantId
    );

    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    if (registration.status === "cancelled") {
      res.status(400).json({ message: "Registration is already cancelled" });
      return;
    }

    // Cancel the registration
    const cancelledRegistration = await participantModel.cancelRegistration(
      eventId,
      participantId,
      reason
    );
    res.status(200).json(cancelledRegistration);
  } catch (error) {
    console.error("Controller error cancelling registration:", error);
    res.status(500).json({ message: "Failed to cancel registration" });
  }
};

// Get event participants (for event owner)
export const getEventParticipants = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);

    if (!req.user?.id) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    // Check if event exists and user is the owner
    const event = await eventModel.getEventById(eventId);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.user_id !== req.user.id) {
      res
        .status(403)
        .json({ message: "Only event owner can view participants" });
      return;
    }

    // Get all participants
    const participants = await participantModel.getEventParticipants(eventId);
    res.status(200).json(participants);
  } catch (error) {
    console.error("Controller error getting event participants:", error);
    res.status(500).json({ message: "Failed to get event participants" });
  }
};

// Get events user is participating in
export const getUserParticipatingEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const events = await participantModel.getUserParticipatingEvents(userId);
    res.status(200).json(events);
  } catch (error) {
    console.error("Controller error getting user participating events:", error);
    res.status(500).json({ message: "Failed to get participating events" });
  }
};
