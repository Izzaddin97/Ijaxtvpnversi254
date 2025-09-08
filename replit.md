# Overview

Ijaxt VPN is a comprehensive VPN service application built as a Replit extension. The project is a React-based web application that provides a sophisticated VPN management interface with advanced features including IMSI management, network optimization, IoT device monitoring, and security controls. The application includes AI assistant functionality, payment processing, data transfer capabilities, and extensive API integrations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Library**: Radix UI components for consistent, accessible interface elements
- **Styling**: TailwindCSS with custom CSS for "Green Fire" theme
- **State Management**: React hooks (useState, useEffect) for local component state
- **Build System**: Vite with SWC for fast compilation and hot module replacement

**Component Structure**: 
- Modular component architecture with specialized components for different VPN features
- Reusable UI components in `/components/ui/` following shadcn/ui patterns
- Feature-specific components for IMSI management, network optimization, IoT monitoring, and security controls
- Payment system with dedicated form components and success screens

## API Integration Layer

**Demo Mode Architecture**: Application runs in demo mode by default with simulated API responses
- **Image Processing API**: Mock implementations for background removal and file processing
- **LCI Data API**: Simulated network intelligence and performance metrics
- **Data Transfer API**: Mock Supabase integration for data import/export operations

**API Client Design**:
- Centralized API client with automatic fallback to demo mode
- Environment variable configuration for production API endpoints
- Error handling and retry logic built into all API calls
- File validation and progress tracking for uploads

## Extension Architecture

**Replit Extension**: Built as a Replit extension with proper extension.json configuration
- **Permissions**: Read/write file access, ReplDB access, and experimental API usage
- **Tool Integration**: Single tool handler at `/tool` endpoint
- **Build Configuration**: Vite configured for extension-specific build requirements with tool root directory

## Data Management

**Mock Data Systems**:
- Demo data seeders for testing data transfer functionality
- Simulated real-time updates for network statistics and device monitoring
- Payment account information stored as constants for demonstration
- VPN configuration templates for multiple platforms (iOS, Android, Windows, Router)

**State Management Pattern**:
- Local component state for UI interactions and real-time data simulation
- Utility functions for data formatting and validation
- Constants files for configuration data and mock responses

## Security and Privacy

**Security-First Design**:
- Environment variable configuration for sensitive data
- Mock implementations prevent real credential exposure
- Security audit documentation for deployment guidelines
- Input validation and sanitization for all user inputs

**Privacy Features**:
- No actual data storage or transmission in demo mode
- Simulated encryption and privacy features for demonstration
- Security notifications and privacy policy compliance

## Styling and Theming

**Design System**:
- Dark theme with green accent colors ("Green Fire" theme)
- Custom CSS properties and Tailwind configuration
- Responsive design with mobile-first approach
- Custom animations and transitions for enhanced user experience

**Typography**: Alfa Slab One font for headings with system fonts for body text

# External Dependencies

## Core React Ecosystem
- **React 18** - Main frontend framework
- **React DOM** - DOM rendering
- **TypeScript** - Type safety and development experience
- **Vite** - Build tool and development server

## UI and Styling
- **Radix UI** - Comprehensive component library (accordion, dialog, dropdown, tabs, etc.)
- **TailwindCSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **clsx** - Conditional className utility

## Form and Data Handling
- **React Hook Form** - Form state management and validation
- **React Day Picker** - Date selection components
- **input-otp** - OTP input components
- **sonner** - Toast notification system

## Charts and Visualization
- **Recharts** - Chart library for data visualization
- **embla-carousel-react** - Carousel component

## Development Tools
- **@replit/extensions-react** - Replit extension development framework
- **next-themes** - Theme switching capability
- **cmdk** - Command palette functionality
- **react-resizable-panels** - Resizable panel components

## API and Backend Services
- **Supabase** - Database and API backend (configured but in demo mode)
- **Mock API endpoints** - Simulated for image processing and network data

## Build and Development
- **Vite plugins** - React SWC for fast compilation
- **Path aliases** - Configured for clean imports
- **TypeScript configuration** - Strict mode with modern ES features

The application is designed to work primarily in demo mode, making it self-contained and easy to deploy without external service dependencies while maintaining the full feature set for demonstration purposes.