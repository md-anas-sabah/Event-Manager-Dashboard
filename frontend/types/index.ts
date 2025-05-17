export interface Event {
  id: number;
  name: string;
  description?: string;
  date: string;
  location: string;
  user_id?: number;
  created_at?: string;
  status?: "registered" | "cancelled";
  registered_at?: string;
  cancelled_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Participant {
  id: number;
  event_id: number;
  user_id: number;
  status: "registered" | "cancelled";
  registered_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  name: string;
  email: string;
}

// export interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAuthenticated: boolean;
// }

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// export interface EventFormData {
//   name: string;
//   description: string;
//   date: string;
//   location: string;
// }

export interface EventFormData {
  name: string;
  description?: string; // Make description optional in form data
  date: string;
  location: string;
}

export interface CancellationFormData {
  reason: string;
}
