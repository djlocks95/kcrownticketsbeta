import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking } from "@shared/schema";

interface CalendarPanelProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  bookings: Booking[];
}

export function CalendarPanel({ selectedDate, onDateChange, bookings }: CalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const previousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Get all days in current month for rendering
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Prepare calendar grid with complete weeks (including days from adjacent months)
  const dayOfWeek = monthStart.getDay(); // 0-6, 0 is Sunday
  
  // Get booking status for a specific date
  const getBookingStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const booking = bookings.find(b => format(new Date(b.date), 'yyyy-MM-dd') === dateString);
    
    if (!booking) return "available";
    
    const occupancyRate = booking.seats.filter(s => s.customerName).length / booking.seats.length;
    
    if (occupancyRate === 0) return "available";
    if (occupancyRate < 1) return "partial";
    return "booked";
  };
  
  // Get status color class for calendar indicators
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "available": return "bg-success";
      case "partial": return "bg-warning";
      case "booked": return "bg-danger";
      default: return "bg-neutral-300";
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Select Date</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-center text-lg font-medium text-neutral-900 mb-4">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-neutral-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: dayOfWeek }).map((_, index) => (
              <div key={`empty-start-${index}`} className="text-center text-sm py-1 text-neutral-300" />
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const status = getBookingStatus(day);
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-full rounded-md",
                    isSelected ? "bg-primary text-primary-foreground" : "",
                    !isSelected && isToday(day) ? "border border-primary text-primary" : ""
                  )}
                  onClick={() => onDateChange(day)}
                >
                  <div className="relative w-full">
                    <span>{format(day, 'd')}</span>
                    <span 
                      className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
                        getStatusColorClass(status)
                      )}
                    />
                  </div>
                </Button>
              );
            })}
            
            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: (7 - ((daysInMonth.length + dayOfWeek) % 7)) % 7 }).map((_, index) => (
              <div key={`empty-end-${index}`} className="text-center text-sm py-1 text-neutral-300" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h3 className="font-medium text-neutral-900">{format(selectedDate, 'MMMM d, yyyy')}</h3>
          <div className="flex items-center space-x-2">
            <span className={cn("inline-block w-3 h-3 rounded-full", getStatusColorClass(getBookingStatus(selectedDate)))}></span>
            <span className="text-sm text-neutral-500">
              {getBookingStatus(selectedDate) === "available" ? "Available" : 
               getBookingStatus(selectedDate) === "partial" ? "Partially Booked" : "Fully Booked"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-neutral-50 rounded-md p-3 mt-4">
          <h4 className="font-medium text-sm mb-2">Status Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
              <span className="text-neutral-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-danger"></span>
              <span className="text-neutral-700">Fully Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-warning"></span>
              <span className="text-neutral-700">Partially Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-neutral-700">Selected Date</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
