"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserParticipatingEvents = exports.checkUserRegistration = exports.getEventParticipants = exports.cancelRegistration = exports.registerForEvent = void 0;
const db_1 = __importDefault(require("../utils/db"));
const registerForEvent = async (eventId, userId) => {
    try {
        const query = `
      INSERT INTO event_participants (event_id, user_id, status)
      VALUES ($1, $2, 'registered')
      RETURNING *
    `;
        const values = [eventId, userId];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error registering for event:", error);
        throw error;
    }
};
exports.registerForEvent = registerForEvent;
const cancelRegistration = async (eventId, userId, reason) => {
    try {
        const query = `
      UPDATE event_participants
      SET 
        status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        cancellation_reason = $3
      WHERE event_id = $1 AND user_id = $2
      RETURNING *
    `;
        const values = [eventId, userId, reason];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error cancelling registration:", error);
        throw error;
    }
};
exports.cancelRegistration = cancelRegistration;
const getEventParticipants = async (eventId) => {
    try {
        const query = `
      SELECT 
        ep.id, 
        ep.event_id, 
        ep.user_id, 
        ep.status, 
        ep.registered_at, 
        ep.cancelled_at, 
        ep.cancellation_reason,
        u.name,
        u.email
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = $1
      ORDER BY ep.registered_at DESC
    `;
        const values = [eventId];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching event participants:", error);
        throw error;
    }
};
exports.getEventParticipants = getEventParticipants;
const checkUserRegistration = async (eventId, userId) => {
    try {
        const query = `
      SELECT * FROM event_participants
      WHERE event_id = $1 AND user_id = $2
    `;
        const values = [eventId, userId];
        const result = await db_1.default.query(query, values);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error("Error checking user registration:", error);
        throw error;
    }
};
exports.checkUserRegistration = checkUserRegistration;
const getUserParticipatingEvents = async (userId) => {
    try {
        const query = `
      SELECT 
        e.*,
        ep.status,
        ep.registered_at,
        ep.cancelled_at
      FROM events e
      JOIN event_participants ep ON e.id = ep.event_id
      WHERE ep.user_id = $1
      ORDER BY e.date DESC
    `;
        const values = [userId];
        const result = await db_1.default.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching user participating events:", error);
        throw error;
    }
};
exports.getUserParticipatingEvents = getUserParticipatingEvents;
