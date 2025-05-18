"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEventsByLocation = exports.filterEventsByDateRange = exports.searchEventsByName = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEventsByUserId = exports.getAllEvents = exports.createEvent = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createEvent = async (event) => {
    const { name, description, date, location, user_id } = event;
    try {
        const query = `
      INSERT INTO events (name, description, date, location, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [name, description || "", date, location, user_id];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};
exports.createEvent = createEvent;
const getAllEvents = async () => {
    try {
        const query = `
      SELECT * FROM events
      ORDER BY date DESC
    `;
        const result = await db_1.default.query(query);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};
exports.getAllEvents = getAllEvents;
const getEventsByUserId = async (userId) => {
    try {
        const query = `
      SELECT * FROM events
      WHERE user_id = $1
      ORDER BY date DESC
    `;
        const values = [userId];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching user events:", error);
        throw error;
    }
};
exports.getEventsByUserId = getEventsByUserId;
const getEventById = async (id) => {
    try {
        const query = `
      SELECT * FROM events
      WHERE id = $1
    `;
        const values = [id];
        const result = await db_1.default.query(query, values);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error("Error fetching event by id:", error);
        throw error;
    }
};
exports.getEventById = getEventById;
const updateEvent = async (id, event) => {
    try {
        const { name, description, date, location } = event;
        const query = `
      UPDATE events
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        date = COALESCE($3, date),
        location = COALESCE($4, location)
      WHERE id = $5
      RETURNING *
    `;
        const values = [name, description || "", date, location, id];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (id) => {
    try {
        const query = `
      DELETE FROM events
      WHERE id = $1
      RETURNING *
    `;
        const values = [id];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};
exports.deleteEvent = deleteEvent;
const searchEventsByName = async (searchTerm) => {
    try {
        const query = `
      SELECT * FROM events
      WHERE name ILIKE $1
      ORDER BY date DESC
    `;
        const values = [`%${searchTerm}%`];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error searching events:", error);
        throw error;
    }
};
exports.searchEventsByName = searchEventsByName;
const filterEventsByDateRange = async (startDate, endDate) => {
    try {
        const query = `
      SELECT * FROM events
      WHERE date BETWEEN $1 AND $2
      ORDER BY date
    `;
        const values = [startDate, endDate];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error filtering events by date:", error);
        throw error;
    }
};
exports.filterEventsByDateRange = filterEventsByDateRange;
const filterEventsByLocation = async (location) => {
    try {
        const query = `
      SELECT * FROM events
      WHERE location ILIKE $1
      ORDER BY date DESC
    `;
        const values = [`%${location}%`];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error filtering events by location:", error);
        throw error;
    }
};
exports.filterEventsByLocation = filterEventsByLocation;
