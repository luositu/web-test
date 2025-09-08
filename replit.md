# Next.js Application - Account Management Dashboard

## Overview
This is a Next.js application with TypeScript and React that appears to be an account management dashboard. It includes features for managing accounts, attack cases, and tasks. The application uses modern UI components from Radix UI and is styled with Tailwind CSS.

## Recent Changes (September 8, 2025)
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
- Attack Case Management (`/attack-cases`) 
- Task Management (`/tasks`)
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
- `lib/` - Utility functions and type definitions
- `hooks/` - Custom React hooks
- `public/` - Static assets and images
- `styles/` - Global CSS styles

The application is fully configured and ready for development in the Replit environment.