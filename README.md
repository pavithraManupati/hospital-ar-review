# Healthcare AR Follow-up Tool

A React application designed for managing healthcare accounts receivable workflows, improving the efficiency of AR specialists.

## Features

- **Admin Dashboard:**
  - Upload master Excel work orders
  - Distribute work to AR specialists
  - Track productivity metrics
  - Process completed work orders

- **User Dashboard:**
  - Upload and process assigned work orders
  - AI-powered recommendations for claim processing
  - Document upload and analysis
  - Multiple view modes for efficient workflow
  - Track progress and completion stats

## Project Structure

The application follows a component-based architecture with dedicated sections for admin and user interfaces:

```
src/
  ├── components/
  │   ├── admin/            # Admin-specific components
  │   ├── user/             # User-specific components
  │   └── common/           # Shared components
  ├── services/             # Mock services for data processing
  └── utils/                # Helper functions
```

## Getting Started

To run the project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Technologies Used

- React
- Tailwind CSS
- Lucide React (for icons)
- Vite
