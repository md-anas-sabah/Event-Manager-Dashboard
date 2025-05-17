import pool from "../utils/db";
import { EventParticipant } from "../types";

export const registerForEvent = async (eventId: number, userId: number) => {
  try {
    const query = `
      INSERT INTO event_participants (event_id, user_id, status)
      VALUES ($1, $2, 'registered')
      RETURNING *
    `;
    const values = [eventId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
};

export const cancelRegistration = async (
  eventId: number,
  userId: number,
  reason: string
) => {
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
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error;
  }
};

export const getEventParticipants = async (eventId: number) => {
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
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching event participants:", error);
    throw error;
  }
};

export const checkUserRegistration = async (
  eventId: number,
  userId: number
) => {
  try {
    const query = `
      SELECT * FROM event_participants
      WHERE event_id = $1 AND user_id = $2
    `;
    const values = [eventId, userId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error checking user registration:", error);
    throw error;
  }
};

export const getUserParticipatingEvents = async (userId: number) => {
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
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching user participating events:", error);
    throw error;
  }
};
