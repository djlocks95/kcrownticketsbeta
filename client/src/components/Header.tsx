import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Bookings", href: "/bookings" },
    { name: "Settings", href: "/settings" }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5a1 1 0 00-.84-.98l-5-1A1 1 0 0013 7V5a1 1 0 00-1-1H3z" />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-neutral-900">Party Bus Booking Manager</h1>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-neutral-700 hover:text-primary font-medium ${
                  location === item.href ? 'text-primary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/bookings">
              <Button>New Booking</Button>
            </Link>
          </nav>
          
          {/* Mobile navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-neutral-700 hover:text-primary font-medium ${
                      location === item.href ? 'text-primary' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/bookings" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">New Booking</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
