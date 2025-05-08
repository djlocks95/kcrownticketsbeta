import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { SeatBookingForm } from "@/components/SeatBookingForm";
import { BookingSummary } from "@/components/BookingSummary";
import { Booking, Seat, BookingSummary as BookingSummaryType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface BusSeatingPanelProps {
  date: Date;
  booking: Booking | null;
  summary: BookingSummaryType;
  onSeatUpdate: (date: Date, seatId: number, updates: Partial<Seat>) => void;
}

export function BusSeatingPanel({ date, booking, summary, onSeatUpdate }: BusSeatingPanelProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  
  if (!booking) return <div>Loading...</div>;
  
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };
  
  const handleSeatUpdate = (updates: Partial<Seat>) => {
    if (!selectedSeat) return;
    
    onSeatUpdate(date, selectedSeat.id, updates);
    
    // Update the local selected seat with the changes
    setSelectedSeat({ ...selectedSeat, ...updates });
  };
  
  const handleCancelSelection = () => {
    setSelectedSeat(null);
  };
  
  // Helper function to determine seat status color
  const getSeatStatusColor = (seat: Seat) => {
    if (seat.customerName) return "bg-primary"; // Booked
    return "bg-success"; // Available
  };
  
  // Create rows of seats for display (5 seats per row)
  const seatRows = [];
  const SEATS_PER_ROW = 5;
  
  for (let i = 0; i < booking.seats.length; i += SEATS_PER_ROW) {
    seatRows.push(booking.seats.slice(i, i + SEATS_PER_ROW));
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Bus Seating & Booking</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-700">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Bus Layout */}
        <div className="overflow-x-auto">
          <div className="bus-container w-full min-w-[700px] bg-neutral-50 rounded-lg p-4 mb-6">
            {/* Driver Section */}
            <div className="flex items-center justify-between mb-10">
              <div className="w-24 h-10 bg-neutral-200 rounded-md flex items-center justify-center">
                <span className="text-xs font-medium">DRIVER</span>
              </div>
              <div className="w-10 h-10 bg-neutral-200 rounded-md flex items-center justify-center">
                <span className="text-xs font-medium">DOOR</span>
              </div>
            </div>

            {/* Bus Seats */}
            <div className="grid grid-cols-5 gap-4">
              {booking.seats.map((seat) => (
                <div 
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  className={cn(
                    "seat text-white rounded-md p-2 text-center cursor-pointer flex flex-col justify-between h-24",
                    getSeatStatusColor(seat),
                    selectedSeat?.id === seat.id ? "seat-selected border-2 border-primary" : "",
                  )}
                >
                  <div className="text-xs font-medium">Seat {seat.id}</div>
                  <div className="text-xs mb-1">
                    {seat.customerName || "Available"}
                  </div>
                  <div className="text-sm font-bold">${seat.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seat Booking Form */}
        {selectedSeat && (
          <SeatBookingForm 
            seat={selectedSeat} 
            onUpdate={handleSeatUpdate}
            onCancel={handleCancelSelection}
          />
        )}

        {/* Booking Summary */}
        <BookingSummary summary={summary} />
      </CardContent>
    </Card>
  );
}
