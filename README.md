# ContextPad

A documentation editor with AI assistance built with React, TypeScript, and Vite.

## Features

- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for rapid UI development
- **Zustand** for lightweight state management
- **Vite** for fast development and building
- **Strict TypeScript** configuration for code quality

## Project Structure

```
contextpad/
├── src/
│   ├── components/     # Reusable UI components
│   ├── services/       # API and external service integrations
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   ├── stores/         # Zustand stores for state management
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles and Tailwind imports
├── public/             # Static assets
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd contextpad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run visual-test` - Run visual testing (requires dev server running)

### Visual Testing

ContextPad includes automated visual testing with Playwright:

1. Start dev server: `npm run dev`
2. Run tests: `npm run visual-test`
3. View report: Open `visual-test-report.html`

See [VISUAL_TESTING.md](VISUAL_TESTING.md) for details.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **ESLint** - Code linting

## Development

This project uses strict TypeScript configuration for enhanced code quality and developer experience. The setup includes:

- Strict type checking
- No unused variables/parameters
- Exact optional property types
- No implicit returns

The UI is built with a clean three-panel layout:
- Header with application branding
- Left panel for context information
- Right panel for the main editor

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and ensure no errors
5. Submit a pull request
