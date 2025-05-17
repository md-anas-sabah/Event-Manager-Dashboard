import pool from "../utils/db";
import { Event } from "../types";

export const createEvent = async (event: Omit<Event, "id">) => {
  const { name, description, date, location, user_id } = event;

  try {
    const query = `
      INSERT INTO events (name, description, date, location, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, description || "", date, location, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const query = `
      SELECT * FROM events
      ORDER BY date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventsByUserId = async (userId: number) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE user_id = $1
      ORDER BY date DESC
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching event by id:", error);
    throw error;
  }
};

export const updateEvent = async (
  id: number,
  event: Partial<Omit<Event, "id">>
) => {
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
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    const query = `
      DELETE FROM events
      WHERE id = $1
      RETURNING *
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const searchEventsByName = async (searchTerm: string) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE name ILIKE $1
      ORDER BY date DESC
    `;
    const values = [`%${searchTerm}%`];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

export const filterEventsByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE date BETWEEN $1 AND $2
      ORDER BY date
    `;
    const values = [startDate, endDate];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error filtering events by date:", error);
    throw error;
  }
};

export const filterEventsByLocation = async (location: string) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE location ILIKE $1
      ORDER BY date DESC
    `;
    const values = [`%${location}%`];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error filtering events by location:", error);
    throw error;
  }
};
