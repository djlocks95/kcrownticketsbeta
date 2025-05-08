import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Employee model
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role").default("agent"),
  commissionPercent: real("commission_percent").default(10),
  active: integer("active").default(1),
});

// Seat model
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  price: real("price").notNull().default(65),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  employeeId: integer("employee_id"),
  agentName: text("agent_name"),
  commissionPercent: real("commission_percent").default(10),
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
});

// Insert schemas
export const insertSeatSchema = createInsertSchema(seats).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });

// Types
export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Booking = {
  id: number;
  date: string;
  seats: Seat[];
};

export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Monthly profit type
export type MonthlyProfit = {
  month: string;
  year: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  commissions: Record<string, number>;
};

// Booking summary type
export type BookingSummary = {
  date: string;
  formattedDate: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  averagePrice: number;
  occupancyRate: number;
  commissionsByAgent: Record<string, number>;
};
