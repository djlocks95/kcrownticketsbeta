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
        employeeId: z.number().nullable().optional(),
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

  // GET monthly profit
  app.get(`${API_PREFIX}/profit/:year/:month`, async (req: Request, res: Response) => {
    try {
      const { year, month } = req.params;
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ message: "Invalid year or month" });
      }
      
      const profit = await storage.getMonthlyProfit(monthNum, yearNum);
      res.json(profit);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // EMPLOYEE ENDPOINTS
  
  // GET all employees
  app.get(`${API_PREFIX}/employees`, async (_req: Request, res: Response) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // GET employee by ID
  app.get(`${API_PREFIX}/employees/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      const employee = await storage.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json(employee);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // CREATE new employee
  app.post(`${API_PREFIX}/employees`, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().nullable().optional(),
        phone: z.string().nullable().optional(),
        role: z.string().default("agent"),
        commissionPercent: z.number().min(0).max(100).default(10),
        active: z.number().default(1)
      });
      
      const employee = schema.parse(req.body);
      const newEmployee = await storage.createEmployee(employee);
      res.status(201).json(newEmployee);
    } catch (err) {
      handleErrors(err, res);
    }
  });
  
  // UPDATE employee
  app.patch(`${API_PREFIX}/employees/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      
      const employee = await storage.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      const schema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().nullable().optional(),
        phone: z.string().nullable().optional(),
        role: z.string().optional(),
        commissionPercent: z.number().min(0).max(100).optional(),
        active: z.number().optional()
      });
      
      const updates = schema.parse(req.body);
      const updatedEmployee = await storage.updateEmployee(id, updates);
      res.json(updatedEmployee);
    } catch (err) {
      handleErrors(err, res);
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}