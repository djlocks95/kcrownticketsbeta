import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency as USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Calculate default seat price based on seat position
export function getDefaultSeatPrice(seatId: number): number {
  // Premium seats (front rows)
  if (seatId <= 10) {
    return 85;
  }
  // Mid-tier seats
  if (seatId <= 25) {
    return 75;
  }
  // Standard seats
  return 65;
}

// Generate array of numbers in range [start, end]
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
