import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { format, parse, isValid } from "date-fns";
import { CalendarPanel } from "@/components/CalendarPanel";
import { BusSeatingPanel } from "@/components/BusSeatingPanel";
import { useBookings } from "@/hooks/useBookings";

export default function BookingManager() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const dateParam = searchParams.get('date');
  
  // Try to parse the date from URL parameters
  let initialDate = new Date();
  if (dateParam) {
    const parsedDate = new Date(dateParam);
    if (isValid(parsedDate)) {
      initialDate = parsedDate;
    }
  }
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  
  const { 
    bookings, 
    getBookingForDate, 
    createBooking, 
    updateSeat, 
    calculateBookingSummary 
  } = useBookings();
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    
    // If no booking exists for this date, create one
    if (!getBookingForDate(date)) {
      createBooking(date);
    }
  };
  
  useEffect(() => {
    // If no booking exists for initial date, create one
    if (!getBookingForDate(selectedDate)) {
      createBooking(selectedDate);
    }
  }, []);
  
  const booking = getBookingForDate(selectedDate);
  const bookingSummary = calculateBookingSummary(selectedDate);
  
  return (
    <div className="md:flex md:space-x-8">
      {/* Calendar Panel */}
      <div className="md:w-1/3 mb-8 md:mb-0">
        <CalendarPanel 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          bookings={bookings}
        />
      </div>
      
      {/* Bus Seating Panel */}
      <div className="md:w-2/3">
        <BusSeatingPanel 
          date={selectedDate}
          booking={booking}
          summary={bookingSummary}
          onSeatUpdate={updateSeat}
        />
      </div>
    </div>
  );
}
