/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserEvents } from "@/lib/eventApi";
import { getUserParticipatingEvents } from "@/lib/participantApi";
// import { Event } from "@/types";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [createdEvents, setCreatedEvents] = useState<number>(0);
  const [participatingEvents, setParticipatingEvents] = useState<number>(0);
  const [upcomingEvents, setUpcomingEvents] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        const userEvents = await getUserEvents();
        setCreatedEvents(userEvents.length);

        const upcoming = userEvents.filter(
          (event) => new Date(event.date) >= new Date()
        );
        setUpcomingEvents(upcoming.length);

        const participating = await getUserParticipatingEvents();
        const activeParticipations = participating.filter(
          (event: any) => event.status === "registered"
        );
        setParticipatingEvents(activeParticipations.length);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast.error("Failed to load your profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{user?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your event statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created Events
                  </p>
                  <p className="text-3xl font-bold">{createdEvents}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Participating In
                  </p>
                  <p className="text-3xl font-bold">{participatingEvents}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Upcoming
                  </p>
                  <p className="text-3xl font-bold">{upcomingEvents}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Events</CardTitle>
            <CardDescription>Quick access to your events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/my-events">
              <Button variant="outline" className="w-full justify-start">
                View My Created Events
              </Button>
            </Link>
            <Link href="/participating">
              <Button variant="outline" className="w-full justify-start">
                View Events I&apos;m Attending
              </Button>
            </Link>
            <Link href="/events/create">
              <Button className="w-full justify-start">Create New Event</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" disabled>
              Edit Profile (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              Change Password (Coming Soon)
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
