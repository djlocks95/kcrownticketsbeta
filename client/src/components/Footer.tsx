import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Party Bus Booking Manager. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/help" className="text-sm text-neutral-500 hover:text-neutral-700">Help</Link>
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-700">Privacy</Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
