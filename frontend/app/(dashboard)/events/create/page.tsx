/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/components/EventForm";
import { EventFormData } from "@/types";
import { createEvent } from "@/lib/eventApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (data: EventFormData) => {
    try {
      await createEvent(data);
      toast.success("Event created successfully");
      router.push("/my-events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <Link href="/events">
          <Button variant="outline">Back to Events</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Event</CardTitle>
          <CardDescription>
            Fill out the form below to create a new event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
