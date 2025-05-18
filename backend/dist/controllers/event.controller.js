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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getUserEvents = exports.getAllEvents = exports.createEvent = void 0;
const eventModel = __importStar(require("../models/event.model"));
const createEvent = async (req, res) => {
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
    }
    catch (error) {
        console.error("Controller error creating event:", error);
        res.status(500).json({ message: "Failed to create event" });
    }
};
exports.createEvent = createEvent;
// Get all events
const getAllEvents = async (req, res) => {
    try {
        // Handle query parameters for filtering
        const { search, location, startDate, endDate } = req.query;
        let events;
        if (search && typeof search === "string") {
            events = await eventModel.searchEventsByName(search);
        }
        else if (location && typeof location === "string") {
            events = await eventModel.filterEventsByLocation(location);
        }
        else if (startDate &&
            endDate &&
            typeof startDate === "string" &&
            typeof endDate === "string") {
            events = await eventModel.filterEventsByDateRange(startDate, endDate);
        }
        else {
            events = await eventModel.getAllEvents();
        }
        res.status(200).json(events);
    }
    catch (error) {
        console.error("Controller error getting events:", error);
        res.status(500).json({ message: "Failed to fetch events" });
    }
};
exports.getAllEvents = getAllEvents;
// Get user's events
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const events = await eventModel.getEventsByUserId(userId);
        res.status(200).json(events);
    }
    catch (error) {
        console.error("Controller error getting user events:", error);
        res.status(500).json({ message: "Failed to fetch user events" });
    }
};
exports.getUserEvents = getUserEvents;
// Get single event by id
const getEventById = async (req, res) => {
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
    }
    catch (error) {
        console.error("Controller error getting event by id:", error);
        res.status(500).json({ message: "Failed to fetch event" });
    }
};
exports.getEventById = getEventById;
// Update event
const updateEvent = async (req, res) => {
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
    }
    catch (error) {
        console.error("Controller error updating event:", error);
        res.status(500).json({ message: "Failed to update event" });
    }
};
exports.updateEvent = updateEvent;
// Delete event
const deleteEvent = async (req, res) => {
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
    }
    catch (error) {
        console.error("Controller error deleting event:", error);
        res.status(500).json({ message: "Failed to delete event" });
    }
};
exports.deleteEvent = deleteEvent;
