import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { format } from "date-fns";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const API_PREFIX = "/api";
  
  // Error handler middleware
  const handleErrors = (err: any, res: Response) => {
    console.error(err);
    
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    
    return res.status(500).json({ message: err.message || "Internal server error" });
  };
  
  // GET all bookings
  app.get(`${API_PREFIX}/bookings`, async (_req: Request, res: Response) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // GET upcoming bookings (must be before /:date to avoid conflict)
  app.get(`${API_PREFIX}/bookings/upcoming`, async (_req: Request, res: Response) => {
    try {
      const upcomingBookings = await storage.getUpcomingBookings();
      res.json(upcomingBookings);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // GET booking by date
  app.get(`${API_PREFIX}/bookings/:date`, async (req: Request, res: Response) => {
    try {
      const date = req.params.date;
      
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: "Invalid date format. Expected format: YYYY-MM-DD" });
      }
      
      const booking = await storage.getBookingByDate(date);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found for this date" });
      }
      
      res.json(booking);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // CREATE new booking
  app.post(`${API_PREFIX}/bookings`, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        date: z.string().refine(val => !isNaN(Date.parse(val)), {
          message: "Invalid date format"
        })
      });
      
      const { date } = schema.parse(req.body);
      const parsedDate = new Date(date);
      
      // Check if booking already exists for this date
      const existingBooking = await storage.getBookingByDate(date);
      if (existingBooking) {
        return res.status(409).json({
          message: "A booking for this date already exists",
          booking: existingBooking
        });
      }
      
      const booking = await storage.createBooking({ date: parsedDate });
      res.status(201).json(booking);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // UPDATE seat in a booking
  app.patch(`${API_PREFIX}/bookings/:date/seats/:seatId`, async (req: Request, res: Response) => {
    try {
      const { date, seatId } = req.params;
      const seatIdNumber = parseInt(seatId, 10);
      
      // Validate seat ID
      if (isNaN(seatIdNumber)) {
        return res.status(400).json({ message: "Invalid seat ID" });
      }
      
      // Get booking by date
      const booking = await storage.getBookingByDate(date);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found for this date" });
      }
      
      // Validate request body
      const schema = z.object({
        customerName: z.string().nullable().optional(),
        price: z.number().min(0).optional(),
        customerPhone: z.string().nullable().optional(),
        customerEmail: z.string().email().nullable().optional(),
        agentName: z.string().nullable().optional(),
        commissionPercent: z.number().min(0).max(100).optional()
      });
      
      const updates = schema.parse(req.body);
      
      // Update the seat
      const updatedSeat = await storage.updateSeat(booking.id, seatIdNumber, updates);
      res.json(updatedSeat);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // GET booking statistics
  app.get(`${API_PREFIX}/stats`, async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  

  
  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
