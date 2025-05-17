/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/components/EventForm";
import { Event, EventFormData } from "@/types";
import { getEventById, updateEvent } from "@/lib/eventApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const eventId = Number(id);
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        // Check if current user is the event owner
        if (user && eventData.user_id !== user.id) {
          toast.error("You are not authorized to edit this event");
          router.push(`/events/${eventId}`);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
        router.push("/my-events");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, router, user]);

  // Handle form submission
  const handleSubmit = async (data: EventFormData) => {
    if (!event) return;

    try {
      await updateEvent(event.id, data);
      toast.success("Event updated successfully");
      router.push(`/events/${event.id}`);
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.response?.data?.message || "Failed to update event");
      throw error;
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
          The event you&apos;re trying to edit doesn&apos;t exist or has been
          removed
        </p>
        <Link href="/my-events">
          <Button>My Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <Link href={`/events/${event.id}`}>
          <Button variant="outline">Back to Event</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit: {event.name}</CardTitle>
          <CardDescription>Make changes to your event details</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            onSubmit={handleSubmit}
            initialData={event}
            submitLabel="Update Event"
          />
        </CardContent>
      </Card>
    </div>
  );
}
