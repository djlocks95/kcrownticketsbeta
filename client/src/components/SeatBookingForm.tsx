import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Seat, Employee } from "@shared/schema";

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
  employeeId: z.string().optional(),
  agentName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SeatBookingForm({ seat, onUpdate, onCancel }: SeatBookingFormProps) {
  // Get employees for dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
    queryFn: async () => {
      const response = await apiRequest("/api/employees", {
        method: "GET"
      });
      return response as Employee[];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
      employeeId: seat.employeeId ? String(seat.employeeId) : undefined,
      agentName: seat.agentName || "",
    }
  });
  
  // Update form when selected seat changes
  useEffect(() => {
    form.reset({
      customerName: seat.customerName || "",
      price: seat.price,
      customerPhone: seat.customerPhone || "",
      customerEmail: seat.customerEmail || "",
      employeeId: seat.employeeId ? String(seat.employeeId) : undefined,
      agentName: seat.agentName || "",
    });
  }, [seat.id, form.reset, seat]);
  
  const handleSubmit = (values: FormValues) => {
    // If employeeId is selected, find the employee to set commission rate and name
    let updates: Partial<Seat> = {
      customerName: values.customerName || null,
      price: values.price,
      customerPhone: values.customerPhone || null,
      customerEmail: values.customerEmail || null,
      employeeId: values.employeeId ? parseInt(values.employeeId) : null,
      agentName: values.agentName || null,
    };
    
    // If employee is selected, use their information for agent name and commission
    if (values.employeeId && values.employeeId !== "none" && Array.isArray(employees)) {
      const selectedEmployee = employees.find(
        (emp: any) => emp.id === parseInt(values.employeeId || "0")
      );
      
      if (selectedEmployee) {
        updates.agentName = selectedEmployee.name;
        // Still set the commission from the employee, but it's not part of the form
        if (selectedEmployee.commissionPercent) {
          updates.commissionPercent = selectedEmployee.commissionPercent;
        }
      }
    }
    
    onUpdate(updates);
  };
  
  const handleCancelBooking = () => {
    if (seat.customerName) {
      onUpdate({
        customerName: null,
        customerPhone: null,
        customerEmail: null,
        employeeId: null,
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
      employeeId: seat.employeeId ? String(seat.employeeId) : undefined,
      agentName: seat.agentName || "",
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
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Employee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No employee selected</SelectItem>
                      {Array.isArray(employees) && employees.map((employee: any) => (
                        <SelectItem key={employee.id} value={String(employee.id)}>
                          {employee.name} ({employee.commissionPercent}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Agent (manual entry)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Or enter agent name manually" />
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
