# Penguin E-Commerce Client

This is the front-end client application for the Penguin E-Commerce platform, built with Next.js, React, and Tailwind CSS.

## Features

- Modern UI built with Tailwind CSS and Radix UI components
- State management with Redux Toolkit
- API integration with Axios and React Query
- Socket.io integration for real-time features
- Responsive design for mobile and desktop
- Authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order management
- User profile management
- Admin dashboard

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **API Integration**: Axios, React Query
- **Real-time Communication**: Socket.io
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **UI Components**: Radix UI
- **Charts**: Chart.js, React-Chartjs-2
- **Icons**: Lucide React, React Icons

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

## Environment Variables

Create a `.env.local` file in the client directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FILE_SERVER_URL=http://localhost:8000
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build

To build the application for production:

```bash
npm run build
# or
yarn build
```

## Docker

The client application can be built and run using Docker:

```bash
docker build -t penguin-client .
docker run -p 3000:3000 penguin-client
```

Or using Docker Compose:

```bash
docker-compose up client
```

## Folder Structure

- `/app`: Next.js app directory containing pages and routes
- `/components`: Reusable React components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and libraries
- `/providers`: React context providers
- `/public`: Static assets
- `/redux`: Redux store, slices, and actions
- `/services`: API service functions
- `/types`: TypeScript type definitions
- `/utils`: Utility functions

## Contributing

1. Create a branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE)