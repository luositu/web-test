# Next.js Application - Account Management Dashboard

## Overview
This is a Next.js application with TypeScript and React that appears to be an account management dashboard. It includes features for managing accounts, attack cases, and tasks. The application uses modern UI components from Radix UI and is styled with Tailwind CSS.

## Recent Changes (September 9, 2025)
- **Data Synchronization**: Implemented centralized data storage system using lib/data-store.ts
- **Architecture Update**: Replaced isolated component states with global data sharing
- **Attack Case Management**: Updated to use shared data store for creating and managing attack cases
- **Task Management**: Enhanced to load attack cases from global data store for consistency
- **Type System**: Unified attack case types across all components for better type safety
- **Bug Fixes**: Resolved critical data sync issues where attack cases weren't appearing across modules

## Previous Changes (September 8, 2025)
- **Project Setup**: Configured the application to run in the Replit environment  
- **Dependencies**: Installed all npm packages successfully
- **Configuration**: Modified Next.js config to work with Replit's proxy system
- **Workflow**: Set up development server to run on 0.0.0.0:5000
- **Deployment**: Configured for autoscale deployment with proper build and start commands

## Project Architecture
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Theme**: Dark theme by default with next-themes
- **Analytics**: Vercel Analytics integration
- **Fonts**: Geist Sans and Mono fonts

### Key Features
- Account Management (`/accounts`)
- Attack Case Management (`/attack-cases`) with centralized data storage
- Task Management (`/tasks`) with synchronized attack case data
- Unified data sharing between components via lib/data-store.ts
- API routes for data management
- Modern UI with dark theme
- Responsive design

### Development Configuration
- **Host**: 0.0.0.0 (configured for Replit proxy)
- **Port**: 5000
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build` 
- **Start Command**: `npm start`

### File Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components including Radix UI primitives
  - `attack-case-management.tsx` - Attack case creation and management with global data integration
  - `task-management.tsx` - Task creation and management with shared attack case data
- `lib/` - Utility functions, type definitions, and global data storage
  - `data-store.ts` - Centralized data store for cross-component data sharing
  - `types.ts` - Unified type definitions for attack cases and other data structures
- `hooks/` - Custom React hooks
- `public/` - Static assets and images  
- `styles/` - Global CSS styles

The application is fully configured and ready for development in the Replit environment.