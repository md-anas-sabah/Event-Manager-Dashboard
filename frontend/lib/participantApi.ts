import apiClient from "@/lib/apiClient";
import { Participant, CancellationFormData } from "@/types";

export const registerForEvent = async (eventId: number) => {
  try {
    const response = await apiClient.post<Participant>(
      `/events/${eventId}/register`
    );
    return response.data;
  } catch (error) {
    console.error(`Error registering for event ${eventId}:`, error);
    throw error;
  }
};

export const getEventParticipants = async (eventId: number) => {
  try {
    const response = await apiClient.get<Participant[]>(
      `/events/${eventId}/participants`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching participants for event ${eventId}:`, error);
    throw error;
  }
};

export const cancelParticipantRegistration = async (
  eventId: number,
  userId: number,
  data: CancellationFormData
) => {
  try {
    const response = await apiClient.put<Participant>(
      `/events/${eventId}/participants/${userId}/cancel`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error cancelling registration for participant ${userId} in event ${eventId}:`,
      error
    );
    throw error;
  }
};

export const getUserParticipatingEvents = async () => {
  try {
    const response = await apiClient.get("/user/participating");
    return response.data;
  } catch (error) {
    console.error("Error fetching user participating events:", error);
    throw error;
  }
};
