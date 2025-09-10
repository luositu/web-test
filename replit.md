# Next.js Application - Account Management Dashboard

## Overview
This is a Next.js application with TypeScript and React that appears to be an account management dashboard. It includes features for managing accounts, attack cases, and tasks. The application uses modern UI components from Radix UI and is styled with Tailwind CSS.

## Recent Changes (September 9, 2025)
- **Attack Case Management Overhaul**: Completely redesigned attack case system with IM and HTTP service types
- **Two-Level Interface Selection**: Implemented service type -> specific API interface selection workflow
- **JSON Parameter Input**: Added JSON format parameter input for attack case configuration
- **Interface Name Truncation**: Added smart truncation for long interface names in list display
- **Data Structure Migration**: Updated type definitions and data storage for new attack case format
- **Backward Compatibility**: Ensured existing data continues to work with new system
- **QPS Time Chart**: Added QPS-Time 2D chart visualization for real-time performance monitoring
- **Task Details Page**: Created comprehensive task execution status page with real-time monitoring
- **Navigation Enhancement**: Added navigation from task list run buttons to detailed task pages
- **Manual Task Control**: Tasks now require manual start instead of auto-execution
- **Data Synchronization**: Implemented centralized data storage system using lib/data-store.ts
- **Architecture Update**: Replaced isolated component states with global data sharing
- **Attack Case Management**: Updated to use shared data store for creating and managing attack cases
- **Task Management**: Enhanced to load attack cases from global data store for consistency
- **Type System**: Unified attack case types across all components for better type safety
- **Bug Fixes**: Resolved critical data sync issues where attack cases weren't appearing across modules
- **Chain Configuration**: Implemented chain-level configuration with account groups, parameter files, and global variables
- **Collapsible UI**: Added expandable/collapsible chain configuration section positioned above service type selection
- **Enhanced Workflow**: Reorganized creation flow with chain configuration as primary configuration point
- **Attack Case Grouped Execution Logs**: Reorganized execution logs by attack case titles with collapsible sections for improved navigation
- **Enhanced Log Statistics**: Added comprehensive statistics for each attack case including execution counts, success rates, and average response times
- **Smart Log Organization**: Implemented expandable/collapsible log groups with visual status indicators and filtering capabilities

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
- Attack Case Management (`/attack-cases`) with tabbed interface for creating and managing attack cases
- Task Management (`/tasks`) with synchronized attack case data and detailed execution monitoring
- Task Details Pages (`/tasks/[id]`) with real-time status monitoring, QPS monitoring charts, and task control
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
  - `tasks/[id]/page.tsx` - Dynamic task details page with real-time monitoring
- `components/` - Reusable UI components including Radix UI primitives
  - `attack-case-management.tsx` - Attack case creation and management with global data integration
  - `task-management.tsx` - Task creation and management with shared attack case data and navigation
- `lib/` - Utility functions, type definitions, and global data storage
  - `data-store.ts` - Centralized data store for cross-component data sharing
  - `types.ts` - Unified type definitions for attack cases and other data structures
- `hooks/` - Custom React hooks
- `public/` - Static assets and images  
- `styles/` - Global CSS styles

The application is fully configured and ready for development in the Replit environment.