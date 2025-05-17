"use client";

import { Event } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

type EventCardProps = {
  event: Event;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  isOwner?: boolean;
};

export default function EventCard({
  event,
  onDelete,
  showActions = true,
  isOwner = false,
}: EventCardProps) {
  const { isAuthenticated } = useAuth();

  const formattedDate = format(new Date(event.date), "MMMM d, yyyy");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-2">
          <span className="font-medium">Location:</span> {event.location}
        </p>
        <p className="text-sm line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline" className="cursor-pointer">
            View Details
          </Button>
        </Link>

        {showActions && isAuthenticated && (
          <div className="flex gap-2">
            {isOwner && (
              <>
                <Link href={`/events/${event.id}/edit`}>
                  <Button variant="outline" className="cursor-pointer">
                    Edit
                  </Button>
                </Link>
                {onDelete && (
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() => onDelete(event.id)}
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
            {!isOwner && (
              <Link href={`/events/${event.id}`}>
                <Button className="cursor-pointer">Register</Button>
              </Link>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
