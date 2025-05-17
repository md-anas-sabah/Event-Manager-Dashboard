"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import { getUserParticipatingEvents } from "@/lib/participantApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ParticipatingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await getUserParticipatingEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching participating events:", error);
        toast.error("Failed to load events you are participating in");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const registeredEvents = events.filter(
    (event) => event.status === "registered"
  );
  const cancelledEvents = events.filter(
    (event) => event.status === "cancelled"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participating Events</h1>
        <Link href="/events">
          <Button>Browse Events</Button>
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
            You aren&apos;t registered for any events yet
          </p>
          <Link href="/events">
            <Button>Browse Available Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {registeredEvents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Registered Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col h-full">
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3">
                        <span className="font-medium">Location:</span>{" "}
                        {event.location}
                      </p>
                      {event.description && (
                        <p className="text-sm mt-2 line-clamp-3">
                          {event.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link href={`/events/${event.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {cancelledEvents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Cancelled Registrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="flex flex-col h-full border-muted bg-muted/20"
                  >
                    <CardHeader>
                      <CardTitle className="text-muted-foreground">
                        {event.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        <span className="font-medium">Location:</span>{" "}
                        {event.location}
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">
                        <span className="font-medium">Status:</span>{" "}
                        Registration cancelled
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link href={`/events/${event.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Event
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
