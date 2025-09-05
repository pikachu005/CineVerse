# Overview

CineVerse is a modern movie discovery web application that provides an IMDb-like experience with a unique design. The application allows users to browse popular movies by region (Hollywood, Bollywood, Tollywood), view trending movies, search for movies with debounced autocomplete, and view detailed movie information including cast, trailers, and ratings. The app is powered by The Movie Database (TMDb) API for comprehensive movie data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Routing**: Wouter for lightweight client-side routing with support for movie detail pages
- **State Management**: TanStack Query (React Query) for server state management, caching, and data synchronization
- **Styling**: Tailwind CSS with Shadcn/ui component library for consistent, accessible UI components
- **Build Tool**: Vite for fast development and optimized production builds
- **Theme System**: Custom theme provider with dark/light mode support using CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express.js for the web server
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Database**: PostgreSQL with Neon serverless database provider
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: Hot module replacement and middleware integration with Vite

## Component Structure
- **UI Components**: Modular Radix UI primitives wrapped with custom styling
- **Movie Components**: Specialized components for movie cards, sections, trailers, and search
- **Layout**: Header with logo, search functionality, and theme toggle
- **Pages**: Home page with categorized movie sections and dedicated movie detail pages

## Data Management
- **API Integration**: Custom TMDb client with methods for different movie categories and search
- **Caching Strategy**: React Query handles automatic caching, background updates, and stale data management
- **Search**: Debounced search implementation (800ms delay, minimum 3 characters) with autocomplete dropdown
- **Image Optimization**: TMDb image URL helpers for different poster and backdrop sizes

## Database Schema
- **Users Table**: Basic user management with ID, username, and password fields
- **Schema Validation**: Zod integration with Drizzle for runtime type checking and validation
- **Migrations**: Drizzle Kit for database schema migrations and management

# External Dependencies

## Core Services
- **The Movie Database (TMDb) API**: Primary data source for movie information, search, trending lists, and regional content
- **Neon Database**: Serverless PostgreSQL hosting for user data and session management

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for consistent styling and responsive design
- **Lucide React**: Icon library for consistent iconography throughout the application

## Development Tools
- **TypeScript**: Static type checking for enhanced developer experience and code reliability
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **ESBuild**: JavaScript bundler for server-side code compilation

## Fonts and Assets
- **Google Fonts**: Inter font family for clean, modern typography
- **Custom Logo**: CineVerse branding with fallback Film icon from Lucide

## Runtime Environment
- **Replit Integration**: Development environment optimizations and error handling for Replit platform
- **Environment Variables**: TMDb API key and database connection string management