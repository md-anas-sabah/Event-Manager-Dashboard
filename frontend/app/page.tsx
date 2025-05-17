"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/lib/eventApi";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { toast } from "sonner";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await getAllEvents();
        const upcomingEvents = data
          .filter((event) => new Date(event.date) >= new Date())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 3);

        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Manage Your Events with Ease
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
              Create, manage, and track your events all in one place. Perfect
              for organizers and attendees alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="cursor-pointer">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/events/create">
                    <Button
                      size="lg"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Create Event
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login" className="cursor-pointer">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground">
              Check out these featured events happening soon
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No upcoming events at the moment
              </p>
              {isAuthenticated && (
                <Link href="/events/create">
                  <Button className="cursor-pointer">
                    Create Your Own Event
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} showActions={false} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/events">
              <Button variant="outline" size="lg" className="cursor-pointer">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to successfully manage your events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Easy Event Creation</h3>
              <p className="text-muted-foreground">
                Create new events in minutes with our simple and intuitive
                interface.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Participant Management</h3>
              <p className="text-muted-foreground">
                Keep track of who&apos;s attending and manage registrations with
                ease.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Fast & Responsive</h3>
              <p className="text-muted-foreground">
                Our platform is built using the latest technology for a seamless
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our platform today and start managing your events more
            efficiently.
          </p>
          {isAuthenticated ? (
            <Link href="/events/create">
              <Button size="lg" className="cursor-pointer">
                Create Your First Event
              </Button>
            </Link>
          ) : (
            <Link href="/register" className="cursor-pointer">
              <Button size="lg" className="cursor-pointer">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>

      <footer className="py-10 px-4 border-t mt-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h3 className="font-bold text-lg">Event Manager</h3>
              <p className="text-sm text-muted-foreground">
                © 2025. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/events"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Events
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
