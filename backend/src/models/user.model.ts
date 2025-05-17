import pool from "../utils/db";
import { User } from "../types";

export const createUser = async (user: Omit<User, "id" | "created_at">) => {
  const { name, email, password } = user;

  try {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    const values = [name, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const query = `
      SELECT id, name, email, created_at FROM users
      WHERE id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};
