"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getUserEvents } from "@/lib/eventApi";
import { getUserParticipatingEvents } from "@/lib/participantApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log("User From Dashboard", user);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's events
        const userEvents = await getUserEvents();

        // Filter for upcoming events
        const upcoming = userEvents
          .filter((event) => new Date(event.date) >= new Date())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setUpcomingEvents(upcoming.slice(0, 3));

        // Fetch events user is participating in
        const participating = await getUserParticipatingEvents();
        setParticipatingEvents(participating.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/events/create">
          <Button>Create New Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>Events you&apos;ve created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-2 last:border-b-0">
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-medium">{event.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming events</p>
              )}

              {upcomingEvents.length > 0 && (
                <Link href="/my-events">
                  <Button variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participating</CardTitle>
            <CardDescription>Events you&apos;re attending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : participatingEvents.length > 0 ? (
                participatingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-2 last:border-b-0">
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-medium">{event.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Not participating in any events
                </p>
              )}

              {participatingEvents.length > 0 && (
                <Link href="/participating">
                  <Button variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/events/create">
                <Button variant="outline" className="w-full justify-start">
                  Create New Event
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="w-full justify-start">
                  Browse All Events
                </Button>
              </Link>
              <Link href="/my-events">
                <Button variant="outline" className="w-full justify-start">
                  Manage My Events
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
