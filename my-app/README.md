# Digital Linguistics Resources — React App

This directory contains the React and Vite application for the Digital Linguistics Resources project. For the complete feature overview, repository structure, and deployment notes, see the [project README](../README.md).

## Development

Requires Node.js 22 (the version used by the deployment workflow).

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build
npm run test      # Run Vitest in watch mode
npm run test:run  # Run the test suite once
npm run lint      # Run ESLint
```

The application source is in `src/`. Audio recordings and image assets are imported from the repository-level `Recordings/` and `Pictures/` directories.
