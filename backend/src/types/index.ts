import { Request } from "express";

// Event type
export interface Event {
  id: number;
  name: string;
  description?: string;
  date: Date;
  location: string;
  user_id?: number;
  created_at?: Date;
}

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
}

// Event Participant type
export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  status: "registered" | "cancelled";
  registered_at: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  name?: string;
  email?: string;
}

// JWT Token payload
export interface TokenPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Extended Request with user property
export interface AuthRequest extends Request {
  user?: TokenPayload;
}
