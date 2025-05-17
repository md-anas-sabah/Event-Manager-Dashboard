import { Request, Response } from "express";
import * as eventModel from "../models/event.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description, date, location } = req.body;

    if (!name || !date) {
      res.status(400).json({ message: "Name and date are required" });
      return;
    }

    const event = await eventModel.createEvent({
      name,
      description,
      date: new Date(date),
      location,
      user_id: userId,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Controller error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Get all events
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Handle query parameters for filtering
    const { search, location, startDate, endDate } = req.query;

    let events;

    if (search && typeof search === "string") {
      events = await eventModel.searchEventsByName(search);
    } else if (location && typeof location === "string") {
      events = await eventModel.filterEventsByLocation(location);
    } else if (
      startDate &&
      endDate &&
      typeof startDate === "string" &&
      typeof endDate === "string"
    ) {
      events = await eventModel.filterEventsByDateRange(startDate, endDate);
    } else {
      events = await eventModel.getAllEvents();
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Controller error getting events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Get user's events
export const getUserEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const events = await eventModel.getEventsByUserId(userId);
    res.status(200).json(events);
  } catch (error) {
    console.error("Controller error getting user events:", error);
    res.status(500).json({ message: "Failed to fetch user events" });
  }
};

// Get single event by id
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await eventModel.getEventById(eventId);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Controller error getting event by id:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

// Update event
export const updateEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);
    const { name, description, date, location } = req.body;

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    // Check if event exists
    const existingEvent = await eventModel.getEventById(eventId);

    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check ownership (can be handled by middleware too)
    if (existingEvent.user_id !== req.user?.id) {
      res.status(403).json({ message: "Not authorized to update this event" });
      return;
    }

    const updatedEvent = await eventModel.updateEvent(eventId, {
      name,
      description,
      date: date ? new Date(date) : undefined,
      location,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Controller error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// Delete event
export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    // Check if event exists
    const existingEvent = await eventModel.getEventById(eventId);

    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check ownership (can be handled by middleware too)
    if (existingEvent.user_id !== req.user?.id) {
      res.status(403).json({ message: "Not authorized to delete this event" });
      return;
    }

    const deletedEvent = await eventModel.deleteEvent(eventId);
    res.status(200).json(deletedEvent);
  } catch (error) {
    console.error("Controller error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
