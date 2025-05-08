# Party Bus Booking Manager

A seat booking management system for party buses with an interactive calendar and 35-seat layout for price assignment, commission tracking, and profit calculation.

## Features

- Interactive calendar with booking status indicators
- 35-seat bus layout visualization
- Seat pricing and customer booking form
- Agent commission tracking and calculation
- Booking summary with revenue calculations
- Dashboard with booking statistics

## Tech Stack

- Frontend: React with TypeScript, Vite for bundling
- UI: TailwindCSS and ShadCn UI components
- State Management: React Query for data fetching
- Backend: Express.js server
- Storage: In-memory database (easily swappable for persistent database)

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd party-bus-booking-manager
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Project Structure

```
.
├── client/                 # Frontend application
│   ├── src/                
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite server configuration
└── shared/                 # Shared code between client and server
    └── schema.ts           # Data schema
```

## Using the Application

1. **Dashboard**: View overview statistics of all bookings
2. **Booking Manager**: 
   - Use the interactive calendar to select dates
   - Click on seats to view/edit details
   - Enter customer information, seat pricing, and agent details
   - Set commission percentages for sales tracking
   - View booking summary with revenue and commission calculations

## Production Deployment

To build for production:

```bash
npm run build
```

Then run the production server:

```bash
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.