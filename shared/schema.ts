import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Seat model
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  price: real("price").notNull().default(65),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
});

// Insert schemas
export const insertSeatSchema = createInsertSchema(seats).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });

// Types
export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;

export type Booking = {
  id: number;
  date: string;
  seats: Seat[];
};

export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Booking summary type
export type BookingSummary = {
  date: string;
  formattedDate: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  totalRevenue: number;
  averagePrice: number;
  occupancyRate: number;
};
