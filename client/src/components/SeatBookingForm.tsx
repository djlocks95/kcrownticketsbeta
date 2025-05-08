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
  agentName: z.string().optional(),
  commissionPercent: z.coerce.number().min(0, "Commission must be at least 0%").max(100, "Commission must be at most 100%").default(10),
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
      agentName: seat.agentName || "",
      commissionPercent: seat.commissionPercent || 10,
    }
  });
  
  // Update form when selected seat changes
  useEffect(() => {
    form.reset({
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
      agentName: seat.agentName || "",
      commissionPercent: seat.commissionPercent || 10,
    });
  }, [seat.id, form.reset, seat]);
  
  const handleSubmit = (values: FormValues) => {
    onUpdate({
      customerName: values.customerName || null,
      price: values.price,
      customerPhone: values.customerPhone || null,
      customerEmail: values.customerEmail || null,
      agentName: values.agentName || null,
      commissionPercent: values.commissionPercent,
    });
  };
  
  const handleCancelBooking = () => {
    if (seat.customerName) {
      onUpdate({
        customerName: null,
        customerPhone: null,
        customerEmail: null,
        agentName: null,
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
      agentName: seat.agentName || "",
      commissionPercent: seat.commissionPercent || 10,
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
            
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Agent (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Agent name" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commissionPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} max={100} step={1} />
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
