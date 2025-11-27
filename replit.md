# Game Coin Wallet

## Overview
Game Coin Wallet is a full-stack cryptocurrency-style wallet application built with React, TypeScript, Vite, and Express.js. It provides a secure platform for managing game coins with features like deposits, withdrawals, transfers, and transaction history.

**Current State**: Successfully imported and configured to run on Replit
- Frontend: React + TypeScript + Vite (Port 5000)
- Backend: Express.js + Node.js (Port 3001)
- Database: PostgreSQL (requires configuration)

## Recent Changes (November 27, 2025)
- Configured frontend to run on port 5000 for Replit deployment
- Configured backend to run on port 3001 (binding to 0.0.0.0 for external access)
- Updated Vite config to allow all hosts for Replit proxy
- Added HMR configuration for proper hot-reload in Replit
- Created database schema file (schema.sql)
- Configured workflow to run both frontend and backend simultaneously
- Set up deployment configuration for Replit autoscale
- Implemented Replit-aware API URL construction that automatically detects Replit domains and constructs proper backend URLs (e.g., 3001--slug.user.repl.co)

## Project Architecture

### Frontend (React + TypeScript + Vite)
- **Port**: 5000 (0.0.0.0)
- **Entry Point**: index.tsx
- **Main Component**: App.tsx
- **Router**: HashRouter (react-router-dom)
- **Styling**: Tailwind CSS (CDN)
- **Key Features**:
  - Multi-language support (Portuguese)
  - Wallet context for state management
  - Real-time balance updates
  - Transaction history

### Backend (Express.js)
- **Port**: 3001 (localhost)
- **Entry Point**: server.js
- **Database**: PostgreSQL
- **API Endpoints**:
  - POST /register - User registration
  - POST /login - User authentication
  - GET /balance/:userId - Get user balance and profile
  - GET /transactions/:userId - Get transaction history
  - GET /check-user/:cpf - Verify user by CPF
  - POST /deposit - Process deposit
  - POST /withdraw - Process withdrawal
  - POST /transfer - Transfer between users
  - POST /update-pix - Update PIX key

### Database Schema
- **users**: User accounts with balance, email, CPF, PIX key
- **transactions**: Transaction history with type, amount, description

## Database Setup

The application requires a PostgreSQL database. To set up:

1. Create a PostgreSQL database (or use an external service like Supabase)
2. Set the following environment variables in `.env`:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=gamecoin
   DB_PORT=5432
   ```
3. Run the schema:
   ```bash
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f schema.sql
   ```

## Running the Application

### Development
The workflow automatically runs both frontend and backend:
```bash
node server.js & npm run dev
```

### Manual Commands
- Frontend only: `npm run dev` (port 5000)
- Backend only: `node server.js` (port 3001)

### Deployment
The app is configured for Replit autoscale deployment:
- Build: `npm run build`
- Production: `node server.js & npm run preview`

## User Preferences
- Language: Portuguese (PT-BR)
- Framework: React 19 with TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL

## Notes
- The frontend uses HashRouter for client-side routing
- Backend CORS is configured to allow all origins
- Passwords are stored as plain text (⚠️ NOT production-ready - should use bcrypt)
- PIX integration is simulated (not real PIX API)
- Frontend polls backend every 5 seconds for balance updates
