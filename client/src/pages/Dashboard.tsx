import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Users, DollarSign, Percent } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: upcomingBookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['/api/bookings/upcoming'],
  });

  const currentDate = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/bookings">
          <Button>
            <CalendarClock className="mr-2 h-4 w-4" />
            Manage Bookings
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : stats?.totalBookings || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time bus bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : stats?.totalCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique customer bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoading ? 'Loading...' : stats?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total booking revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : `${stats?.averageOccupancy?.toFixed(1) || '0.0'}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Average seats filled
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Trips</h2>
            
            {isLoadingBookings ? (
              <p>Loading upcoming bookings...</p>
            ) : (upcomingBookings?.length === 0) ? (
              <div className="text-center py-10 text-neutral-500">
                <CalendarClock className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No upcoming bookings</p>
                <Link href="/bookings">
                  <Button variant="outline" className="mt-4">Create a Booking</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings?.map((booking: any) => (
                  <Card key={booking.date}>
                    <CardContent className="p-4">
                      <p className="font-semibold">{format(new Date(booking.date), 'MMMM d, yyyy')}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{booking.bookedSeats}</span> / 35 seats booked
                        </div>
                        <div className="text-sm font-medium">${booking.revenue.toFixed(2)}</div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/bookings?date=${booking.date}`}>
                          <Button variant="outline" size="sm" className="w-full">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Booking Calendar</h2>
              <p className="text-sm text-muted-foreground">
                Click on a date to view or manage bookings
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link href="/bookings">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  className="rounded-md border"
                />
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
