/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cancellationSchema } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { Input } from '@/components/ui/input';
import { Participant } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

type CancellationFormData = z.infer<typeof cancellationSchema>;

type ParticipantsTableProps = {
  participants: Participant[];
  eventId: number;
  onCancelRegistration: (
    eventId: number,
    userId: number,
    data: { reason: string }
  ) => Promise<void>;
};

export default function ParticipantsTable({
  participants,
  eventId,
  onCancelRegistration,
}: ParticipantsTableProps) {
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CancellationFormData>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: "",
    },
  });

  const openCancellationDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDialogOpen(true);
    form.reset({ reason: "" });
  };

  const handleSubmit = async (data: CancellationFormData) => {
    if (!selectedParticipant) return;

    setIsSubmitting(true);

    try {
      await onCancelRegistration(eventId, selectedParticipant.user_id, data);
      toast.success("Registration cancelled successfully");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Registered On</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-3 text-center text-muted-foreground"
                >
                  No participants yet
                </td>
              </tr>
            ) : (
              participants.map((participant) => (
                <tr key={participant.id} className="border-b">
                  <td className="px-4 py-3">{participant.name}</td>
                  <td className="px-4 py-3">{participant.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        participant.status === "registered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {participant.status.charAt(0).toUpperCase() +
                        participant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(participant.registered_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {participant.status === "registered" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openCancellationDialog(participant)}
                      >
                        Cancel
                      </Button>
                    )}
                    {participant.status === "cancelled" && (
                      <span className="text-sm text-muted-foreground">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancellation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling the registration for{" "}
              <span className="font-medium">{selectedParticipant?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter reason for cancellation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Cancellation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
