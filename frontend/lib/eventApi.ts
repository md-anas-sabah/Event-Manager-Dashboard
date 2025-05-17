import apiClient from "@/lib/apiClient";
import { Event, EventFormData } from "@/types";

export const getAllEvents = async (searchParams?: {
  search?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const response = await apiClient.get<Event[]>("/events", {
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: EventFormData) => {
  try {
    const response = await apiClient.post<Event>("/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (
  id: number,
  eventData: Partial<EventFormData>
) => {
  try {
    const response = await apiClient.put<Event>(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    const response = await apiClient.delete<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
};

export const getUserEvents = async () => {
  try {
    const response = await apiClient.get<Event[]>("/events/user/events");
    return response.data;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};
