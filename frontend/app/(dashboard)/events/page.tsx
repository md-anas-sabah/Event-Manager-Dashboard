/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import { getAllEvents } from "@/lib/eventApi";
import EventCard from "@/components/EventCard";
import EventFilter from "@/components/EventFilter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await getAllEvents(filters);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        {isAuthenticated && (
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
        )}
      </div>

      <div className="bg-background border rounded-lg p-4">
        <EventFilter onFilter={handleFilter} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No events found</h2>
          <p className="text-muted-foreground mb-6">
            {Object.keys(filters).length > 0
              ? "Try changing your filters"
              : "There are no events available at the moment"}
          </p>
          {isAuthenticated && (
            <Link href="/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isOwner={user?.id === event.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
