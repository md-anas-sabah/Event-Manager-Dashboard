"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createUser = async (user) => {
    const { name, email, password } = user;
    try {
        const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
        const values = [name, email, password];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    try {
        const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
        const values = [email];
        const result = await db_1.default.query(query, values);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    try {
        const query = `
      SELECT id, name, email, created_at FROM users
      WHERE id = $1
    `;
        const values = [id];
        const result = await db_1.default.query(query, values);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error("Error fetching user by id:", error);
        throw error;
    }
};
exports.getUserById = getUserById;
