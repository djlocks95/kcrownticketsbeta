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

- Node.js 18.x or later
- npm 9.x or later

### Installation

#### Option 1: Download and Run Locally

1. Download the ZIP file from the provided link

2. Extract the ZIP file to a folder on your computer

3. Open a terminal/command prompt and navigate to the extracted folder:

```bash
cd path/to/extracted/folder
```

4. Install dependencies:

```bash
npm install
```

5. Start the application:

**For Windows Users:**
```bash
# First time setup (only needed once)
setup-windows.bat

# Then run the application with
start-windows.bat
```

**For Mac/Linux Users:**
```bash
# Either use the included shell script
bash start-unix.sh

# Or run directly with this command
npm run dev
```

6. Open your browser to `http://localhost:5000`

#### Option 2: Clone the Repository

1. Clone the repository:

```bash
git clone <repository-url>
cd party-bus-booking-manager
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

**For Windows Users:**
```bash
# First time setup (only needed once)
setup-windows.bat

# Then run the application with
start-windows.bat
```

**For Mac/Linux Users:**
```bash
# Either use the included shell script
bash start-unix.sh

# Or run directly with this command
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
   - Enter customer information, seat pricing, and assign employees to bookings
   - View booking summary with revenue calculations

3. **Employee Manager**:
   - Add and manage employees who receive commissions
   - Set commission percentages for each employee
   - View monthly profit reports
   - Commission is calculated based on the total monthly profit, not individual sales
   
For example, if a month generates $5,000 in profit and an employee has a 10% commission rate, they would receive $500 as commission from the total profit.

## Production Deployment

To build for production:

```bash
npm run build
```

Then run the production server:

**For Windows Users:**
```bash
set NODE_ENV=production && node dist/index.js
```

**For Mac/Linux Users:**
```bash
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.