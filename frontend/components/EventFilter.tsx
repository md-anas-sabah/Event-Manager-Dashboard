"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventFilterSchema } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FilterValues = z.infer<typeof eventFilterSchema>;

type EventFilterProps = {
  onFilter: (values: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
};

export default function EventFilter({
  onFilter,
  initialValues = {},
}: EventFilterProps) {
  // Initialize form
  const form = useForm<FilterValues>({
    resolver: zodResolver(eventFilterSchema),
    defaultValues: {
      search: initialValues.search || "",
      location: initialValues.location || "",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: FilterValues) => {
    onFilter(data);
  };

  // Handle reset
  const handleReset = () => {
    form.reset({
      search: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    onFilter({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input placeholder="Search events..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Filter by location" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </Form>
  );
}
