import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Seat } from "@shared/schema";

interface SeatBookingFormProps {
  seat: Seat;
  onUpdate: (updates: Partial<Seat>) => void;
  onCancel: () => void;
}

// Form validation schema
const formSchema = z.object({
  customerName: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least $0"),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function SeatBookingForm({ seat, onUpdate, onCancel }: SeatBookingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
    }
  });
  
  // Update form when selected seat changes
  useEffect(() => {
    form.reset({
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
    });
  }, [seat.id, form.reset, seat]);
  
  const handleSubmit = (values: FormValues) => {
    onUpdate({
      customerName: values.customerName || null,
      price: values.price,
      customerPhone: values.customerPhone || null,
      customerEmail: values.customerEmail || null,
    });
  };
  
  const handleCancelBooking = () => {
    if (seat.customerName) {
      onUpdate({
        customerName: null,
        customerPhone: null,
        customerEmail: null,
      });
    }
    onCancel();
  };
  
  const handleResetForm = () => {
    form.reset({
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
    });
  };
  
  return (
    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
      <h3 className="font-medium text-neutral-900 mb-4">Seat #{seat.id} Details</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter customer name" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seat Price ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step={5} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(555) 123-4567" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="customer@example.com" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCancelBooking}
            >
              {seat.customerName ? "Cancel Booking" : "Close"}
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleResetForm}
              >
                Reset
              </Button>
              
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
