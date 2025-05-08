import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Booking, Seat, BookingSummary } from "@shared/schema";

export function useBookings() {
  // Fetch all bookings
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });
  
  // Create a new booking for a date
  const createBookingMutation = useMutation({
    mutationFn: async (date: Date) => {
      const response = await apiRequest('POST', '/api/bookings', { date: date.toISOString() });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/upcoming'] });
    },
  });
  
  // Update a seat in a booking
  const updateSeatMutation = useMutation({
    mutationFn: async ({ date, seatId, updates }: { date: Date, seatId: number, updates: Partial<Seat> }) => {
      const response = await apiRequest('PATCH', `/api/bookings/${format(date, 'yyyy-MM-dd')}/seats/${seatId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/upcoming'] });
    },
  });
  
  // Find booking for a specific date
  const getBookingForDate = (date: Date): Booking | null => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.find(booking => 
      format(new Date(booking.date), 'yyyy-MM-dd') === dateString
    ) || null;
  };
  
  // Create a new booking
  const createBooking = (date: Date) => {
    createBookingMutation.mutate(date);
  };
  
  // Update a seat
  const updateSeat = (date: Date, seatId: number, updates: Partial<Seat>) => {
    updateSeatMutation.mutate({ date, seatId, updates });
  };
  
  // Calculate booking summary for a date
  const calculateBookingSummary = (date: Date): BookingSummary => {
    const booking = getBookingForDate(date);
    
    if (!booking) {
      return {
        date: date.toISOString(),
        formattedDate: format(date, 'MMMM d, yyyy'),
        totalSeats: 35,
        bookedSeats: 0,
        availableSeats: 35,
        totalRevenue: 0,
        averagePrice: 0,
        occupancyRate: 0
      };
    }
    
    const totalSeats = booking.seats.length;
    const bookedSeats = booking.seats.filter(seat => seat.customerName).length;
    const availableSeats = totalSeats - bookedSeats;
    
    // Calculate total revenue from booked seats
    const totalRevenue = booking.seats
      .filter(seat => seat.customerName)
      .reduce((sum, seat) => sum + seat.price, 0);
    
    // Calculate average price of booked seats
    const averagePrice = bookedSeats > 0 ? totalRevenue / bookedSeats : 0;
    
    // Calculate occupancy rate
    const occupancyRate = (bookedSeats / totalSeats) * 100;
    
    return {
      date: booking.date,
      formattedDate: format(new Date(booking.date), 'MMMM d, yyyy'),
      totalSeats,
      bookedSeats,
      availableSeats,
      totalRevenue,
      averagePrice,
      occupancyRate
    };
  };
  
  return {
    bookings,
    isLoading,
    getBookingForDate,
    createBooking,
    updateSeat,
    calculateBookingSummary
  };
}
