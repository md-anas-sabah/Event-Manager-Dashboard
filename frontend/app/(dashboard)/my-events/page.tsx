"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import { getUserEvents, deleteEvent } from "@/lib/eventApi";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await getUserEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching user events:", error);
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openDeleteDialog = (id: number) => {
    setSelectedEventId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedEventId) return;

    setIsDeleting(true);
    try {
      await deleteEvent(selectedEventId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEventId)
      );
      toast.success("Event deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
      setSelectedEventId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No events found</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t created any events yet
          </p>
          <Link href="/events/create">
            <Button>Create Your First Event</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isOwner={true}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

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
