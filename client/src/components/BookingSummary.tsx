import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookingSummary as BookingSummaryType } from "@shared/schema";

interface BookingSummaryProps {
  summary: BookingSummaryType;
}

export function BookingSummary({ summary }: BookingSummaryProps) {
  // Helper to get status badge color
  const getStatusBadgeClass = (occupancyRate: number) => {
    if (occupancyRate === 0) return "bg-success-100 text-success";
    if (occupancyRate < 1) return "bg-warning-100 text-warning";
    return "bg-danger-100 text-danger";
  };
  
  // Helper to get status text
  const getStatusText = (occupancyRate: number) => {
    if (occupancyRate === 0) return "Available";
    if (occupancyRate < 1) return "Partially Booked";
    return "Fully Booked";
  };

  // Check if there are any agent commissions
  const hasCommissions = Object.keys(summary.commissionsByAgent).length > 0;
  
  return (
    <Card className="border border-neutral-200">
      <CardContent className="p-4">
        <h3 className="font-medium text-neutral-900 mb-4">
          Booking Summary - {summary.formattedDate}
        </h3>
        
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-neutral-500">Total Seats</dt>
          <dd className="text-neutral-900 font-medium">{summary.totalSeats}</dd>
          
          <dt className="text-neutral-500">Booked Seats</dt>
          <dd className="text-neutral-900 font-medium">{summary.bookedSeats} / {summary.totalSeats}</dd>
          
          <dt className="text-neutral-500">Available Seats</dt>
          <dd className="text-neutral-900 font-medium">{summary.availableSeats}</dd>
          
          <dt className="text-neutral-500">Average Price</dt>
          <dd className="text-neutral-900 font-medium">${summary.averagePrice.toFixed(2)}</dd>
          
          <dt className="text-neutral-500">Gross Revenue</dt>
          <dd className="text-neutral-900 font-medium">${summary.totalRevenue.toFixed(2)}</dd>
          
          <dt className="text-neutral-500">Total Commissions</dt>
          <dd className="text-neutral-900 font-medium text-warning">${summary.totalCommission.toFixed(2)}</dd>
          
          <dt className="text-neutral-500">Net Revenue</dt>
          <dd className="text-neutral-900 font-medium text-primary">${summary.netRevenue.toFixed(2)}</dd>
          
          <dt className="text-neutral-500">Occupancy</dt>
          <dd className="text-neutral-900 font-medium">{summary.occupancyRate.toFixed(1)}%</dd>
        </dl>
        
        {hasCommissions && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <h4 className="font-medium text-neutral-900 mb-2">Agent Commissions</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(summary.commissionsByAgent).map(([agent, amount]) => (
                <div key={agent} className="flex justify-between">
                  <span className="text-neutral-700">{agent}</span>
                  <span className="text-neutral-900 font-medium">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-700">Bus Status</span>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              getStatusBadgeClass(summary.occupancyRate / 100)
            )}>
              {getStatusText(summary.occupancyRate / 100)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
