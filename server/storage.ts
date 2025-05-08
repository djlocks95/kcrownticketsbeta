import { bookings, type Booking, type InsertBooking, type Seat } from "@shared/schema";
import { getDefaultSeatPrice } from "@/lib/utils";
import { format } from "date-fns";

// Define interface for storage operations
export interface IStorage {
  getBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingByDate(date: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateSeat(bookingId: number, seatId: number, updates: Partial<Seat>): Promise<Seat>;
  getStats(): Promise<{
    totalBookings: number;
    totalCustomers: number;
    totalRevenue: number;
    averageOccupancy: number;
  }>;
  getUpcomingBookings(): Promise<any[]>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private bookings: Map<number, Booking>;
  private seats: Map<number, Seat>;
  currentBookingId: number;
  currentSeatId: number;

  constructor() {
    this.bookings = new Map();
    this.seats = new Map();
    this.currentBookingId = 1;
    this.currentSeatId = 1;
  }

  // Get all bookings
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  // Get booking by ID
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  // Get booking by date
  async getBookingByDate(date: string): Promise<Booking | undefined> {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    
    return Array.from(this.bookings.values()).find(
      booking => format(new Date(booking.date), 'yyyy-MM-dd') === formattedDate
    );
  }

  // Create a new booking
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    
    // Generate 35 seats for this booking
    const seats: Seat[] = [];
    for (let i = 1; i <= 35; i++) {
      const seatId = this.currentSeatId++;
      const seat: Seat = {
        id: seatId,
        bookingId: id,
        price: getDefaultSeatPrice(i),
        customerName: null,
        customerPhone: null,
        customerEmail: null,
        agentName: null,
        commissionPercent: 10
      };
      
      this.seats.set(seatId, seat);
      seats.push(seat);
    }
    
    const booking: Booking = {
      id,
      date: insertBooking.date.toISOString(),
      seats
    };
    
    this.bookings.set(id, booking);
    return booking;
  }

  // Update a seat in a booking
  async updateSeat(bookingId: number, seatId: number, updates: Partial<Seat>): Promise<Seat> {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    
    // Find the seat in the booking
    const seatIndex = booking.seats.findIndex(s => s.id === seatId);
    if (seatIndex === -1) {
      throw new Error(`Seat with ID ${seatId} not found in booking ${bookingId}`);
    }
    
    // Update the seat
    const updatedSeat = {
      ...booking.seats[seatIndex],
      ...updates
    };
    
    // Update the seat in the booking
    booking.seats[seatIndex] = updatedSeat;
    
    // Update the seat in the map
    this.seats.set(seatId, updatedSeat);
    
    // Update the booking
    this.bookings.set(bookingId, booking);
    
    return updatedSeat;
  }

  // Get booking statistics
  async getStats(): Promise<{ 
    totalBookings: number; 
    totalCustomers: number; 
    totalRevenue: number; 
    averageOccupancy: number; 
  }> {
    const bookings = Array.from(this.bookings.values());
    const totalBookings = bookings.length;
    
    let totalCustomers = 0;
    let totalRevenue = 0;
    let occupancySum = 0;
    
    bookings.forEach(booking => {
      const bookedSeats = booking.seats.filter(seat => seat.customerName !== null);
      totalCustomers += bookedSeats.length;
      
      totalRevenue += bookedSeats.reduce((sum, seat) => sum + seat.price, 0);
      
      // Calculate occupancy for this booking
      const occupancy = (bookedSeats.length / booking.seats.length) * 100;
      occupancySum += occupancy;
    });
    
    const averageOccupancy = totalBookings > 0 ? occupancySum / totalBookings : 0;
    
    return {
      totalBookings,
      totalCustomers,
      totalRevenue,
      averageOccupancy
    };
  }

  // Get upcoming bookings
  async getUpcomingBookings(): Promise<any[]> {
    const now = new Date();
    const bookings = Array.from(this.bookings.values());
    
    return bookings
      .filter(booking => new Date(booking.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6)
      .map(booking => {
        const bookedSeats = booking.seats.filter(seat => seat.customerName !== null);
        const revenue = bookedSeats.reduce((sum, seat) => sum + seat.price, 0);
        
        return {
          date: booking.date,
          bookedSeats: bookedSeats.length,
          revenue
        };
      });
  }
}

export const storage = new MemStorage();
