/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Event, Participant } from "@/types";
import { getEventById, deleteEvent } from "@/lib/eventApi";
import {
  getEventParticipants,
  registerForEvent,
  cancelParticipantRegistration,
} from "@/lib/participantApi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import ParticipantsTable from "@/components/ParticipantsTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch event details and check if user is owner
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const eventId = Number(id);
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        // Check if current user is the event owner
        if (user && eventData.user_id === user.id) {
          setIsOwner(true);
          // Fetch participants if user is owner
          fetchParticipants();
        }

        // Check if user is registered for this event
        if (user && participants.length > 0) {
          const userRegistration = participants.find(
            (p) => p.user_id === user.id && p.status === "registered"
          );
          setIsRegistered(!!userRegistration);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  // Fetch participants for the event
  const fetchParticipants = async () => {
    if (!id) return;

    setIsParticipantsLoading(true);
    try {
      const eventId = Number(id);
      const participantsData = await getEventParticipants(eventId);
      setParticipants(participantsData);

      // Check if current user is registered
      if (user) {
        const userRegistration = participantsData.find(
          (p) => p.user_id === user.id && p.status === "registered"
        );
        setIsRegistered(!!userRegistration);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      if (isOwner) {
        toast.error("Failed to load participants");
      }
    } finally {
      setIsParticipantsLoading(false);
    }
  };

  // Handle event registration
  const handleRegister = async () => {
    if (!event || !isAuthenticated) return;

    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      toast.success("Successfully registered for the event");
      setIsRegistered(true);
      fetchParticipants();
    } catch (error: any) {
      console.error("Error registering for event:", error);
      toast.error(
        error.response?.data?.message || "Failed to register for event"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle cancelling participant registration (as event owner)
  const handleCancelRegistration = async (
    eventId: number,
    userId: number,
    data: { reason: string }
  ): Promise<void> => {
    try {
      await cancelParticipantRegistration(eventId, userId, data);
      fetchParticipants();
      // Removed the return true statement to make it compatible with Promise<void>
    } catch (error) {
      console.error("Error cancelling registration:", error);
      throw error;
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    if (!event) return;

    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Event not found</h2>
        <p className="text-muted-foreground mb-6">
          The event you&apos;re looking for doesn&apos;t exist or has been
          removed
        </p>
        <Link href="/events">
          <Button>Browse Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>

        {isOwner && (
          <div className="flex gap-2">
            <Link href={`/events/${event.id}/edit`}>
              <Button variant="outline">Edit Event</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Event
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.name}</CardTitle>
          <CardDescription>
            {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Location</h3>
            <p>{event.location}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Description</h3>
            <p className="whitespace-pre-line">
              {event.description || "No description provided"}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          {!isOwner && isAuthenticated && (
            <Button
              onClick={handleRegister}
              disabled={isRegistered || isRegistering}
              className="w-full"
            >
              {isRegistering ? (
                <>
                  <span className="mr-2">Registering...</span>
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : isRegistered ? (
                "Already Registered"
              ) : (
                "Register for Event"
              )}
            </Button>
          )}

          {!isAuthenticated && (
            <div className="w-full">
              <p className="text-center text-muted-foreground mb-2">
                You need to log in to register for this event
              </p>
              <Link href="/login">
                <Button className="w-full">Log In to Register</Button>
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>

      {isOwner && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Event Participants</h2>

          {isParticipantsLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <ParticipantsTable
              participants={participants}
              eventId={event.id}
              onCancelRegistration={handleCancelRegistration}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone and will remove all participant registrations.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
