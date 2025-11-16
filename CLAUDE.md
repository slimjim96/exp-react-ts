# CLAUDE.md - AI Assistant Guide for exp-react-ts

This document provides comprehensive guidance for AI assistants working with the exp-react-ts codebase. It outlines the project structure, conventions, and workflows to ensure effective collaboration.

## Project Overview

**exp-react-ts** is a full-stack TypeScript application combining Express.js backend with a React frontend. The project demonstrates a modern web application architecture with:

- **Backend**: Express.js server (TypeScript)
- **Frontend**: React 18 with TypeScript
- **Build System**: Webpack 5 with Babel
- **Development Tools**: Nodemon, ESLint, TypeScript compiler
- **Containerization**: Docker for deployment

**Status**: Work in progress (as noted in readme.md)

## Architecture

### Monorepo Structure

The project uses a monorepo approach with separate build configurations for frontend and backend:

```
exp-react-ts/
├── src/
│   ├── exp-react-app-ts/       # React frontend application
│   └── exp-react-svc-ts/        # Express backend service
├── public/                      # Static assets (HTML template, favicon, etc.)
├── dist/                        # Webpack build output (gitignored)
├── exp-react-svc/              # Compiled backend code (gitignored)
└── [config files]
```

### Directory Details

#### Frontend (`src/exp-react-app-ts/`)
- **App.tsx**: Main React component
- **index.tsx**: Application entry point with React 18 root API
- **App.css / index.css**: Component styles
- **reportWebVitals.ts**: Performance monitoring
- **setupTests.ts**: Jest/Testing Library configuration
- **App.test.tsx**: Component tests
- **react-app-env.d.ts**: TypeScript definitions for React

#### Backend (`src/exp-react-svc-ts/`)
- **index.ts**: Application entry point, Express setup, and route configuration
- **server.ts**: Server class for starting the Express application

**Key Backend Features**:
- Serves static files from `dist/` directory
- API endpoint at `/api` (health check returns `{health: 'OK'}`)
- Serves React app on root path `/`
- Port: 3002

#### Public Assets (`public/`)
- **index.html**: HTML template for React app
- **favicon.ico**: Site favicon
- **logo192.png / logo512.png**: PWA icons
- **manifest.json**: Web app manifest
- **robots.txt**: Search engine directives

## Technology Stack

### Core Dependencies

**Frontend**:
- React 18.2.0 with React DOM
- TypeScript 4.9.3
- Babel (core, preset-env, preset-react)
- Testing Library (React, Jest DOM, User Event)

**Backend**:
- Express 4.18.2
- TypeScript 4.9.3
- dotenv 16.0.3 (environment variables)

### Build Tools

**Webpack Configuration**:
- Entry: `src/exp-react-app-ts/index.tsx` with babel-polyfill
- Output: `dist/js/[name].bundle.js`
- Dev Server: Hot reload enabled, proxy `/api/**` to `localhost:3002`
- Source Maps: Enabled

**Loaders**:
- `ts-loader`: TypeScript compilation
- `babel-loader`: JavaScript transpilation
- `style-loader` + `css-loader`: CSS processing
- `less-loader`: LESS preprocessing with MiniCssExtractPlugin
- `url-loader`: Asset handling (images, fonts)

**Plugins**:
- CleanWebpackPlugin: Cleans dist directory before build
- HtmlWebpackPlugin: Generates HTML from template
- MiniCssExtractPlugin: Extracts CSS into separate files

### Development Tools

- **ESLint**: TypeScript + React linting
- **Nodemon**: Backend auto-reload on file changes
- **Concurrently**: Run multiple dev processes
- **TypeScript**: Strict mode enabled

## TypeScript Configuration

### Frontend Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": false
  },
  "include": ["./src/exp-react-app-ts/*", "./src/exp-react-svc-ts/*"]
}
```

**Key Settings**:
- Strict mode enabled
- React JSX transform (no need to import React)
- ES5 target for broad browser compatibility
- ESNext modules with Node resolution

### Backend Config (`tsconfig.server.json`)

```json
{
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2019",
    "outDir": "./exp-react-svc",
    "strict": true
  },
  "include": ["./src/exp-react-svc-ts"],
  "exclude": ["./src/exp-react-app-ts"]
}
```

**Key Settings**:
- CommonJS modules for Node.js
- ES2019 target
- Outputs to `exp-react-svc/` directory
- Excludes frontend code

## Development Workflows

### Available NPM Scripts

```bash
# Production build and start
npm run build          # Webpack production build
npm run start          # Build + start server

# Development
npm run dev            # Run both frontend dev server and backend concurrently
npm run app            # Frontend dev server only (webpack-dev-server)
npm run server-dev     # Backend dev server only (nodemon)

# Backend only
npm run server         # Compile and run backend in production mode
```

### Development Mode

**Start full development environment**:
```bash
npm run dev
```

This runs:
1. **Nodemon**: Watches `src/exp-react-svc-ts/`, compiles TypeScript, restarts server
2. **Webpack Dev Server**: Frontend with hot reload at default port (usually 8080)

**Nodemon Configuration** (`nodemon.json`):
- Watches: `src/exp-react-svc-ts`
- Ignores: Test files, node_modules, frontend code
- Executes: `tsc -p tsconfig.server.json && node exp-react-svc/`
- Extensions: `.ts`

### Production Build

```bash
npm run build          # Creates optimized frontend bundle in dist/
npm run start          # Compiles backend + starts server
```

Server serves static files from `dist/` and listens on port 3002.

### API Development

**Current API Endpoints**:
- `GET /api`: Health check, returns `{health: 'OK'}`

**Adding New Endpoints**:
1. Add routes in `src/exp-react-svc-ts/index.ts` before the root handler
2. Follow Express middleware pattern
3. Frontend can call via `/api/*` (proxied in dev mode)

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:alpine
WORKDIR /app
COPY . /app
RUN npm install -g typescript@4.6.3; \
    npm install; \
    npm run build; \
    tsc -p tsconfig.server.json;
EXPOSE 3000
CMD [ "node" , "exp-react-svc/" ]
```

**Build and Run**:
```bash
docker build -t expreactapp .
docker run -p 3002:3002 expreactapp
```

**Note**: Dockerfile exposes port 3000 but app uses 3002 - this should be corrected to:
```dockerfile
EXPOSE 3002
```

## Code Conventions

### File Naming

- **TypeScript/TSX**: PascalCase for components (`App.tsx`), camelCase for utilities
- **CSS**: Match component name (`App.css`)
- **Tests**: `*.test.tsx` or `*.spec.ts` (ignored by nodemon)
- **Type Definitions**: `*.d.ts` for ambient types

### Code Style

**ESLint Configuration** (`.eslintrc.json`):
- Extends: `eslint:recommended`, `plugin:react/recommended`, `plugin:@typescript-eslint/recommended`
- Parser: `@typescript-eslint/parser`
- Environment: Browser, ES2021, Node
- React app and Jest configurations included

**TypeScript Best Practices**:
- Strict mode enabled - all strict checks active
- Explicit types preferred for function parameters and returns
- Interface for object shapes, type for unions/intersections
- Use TypeScript's built-in types from lib (React.FC, Express types)

### React Patterns

- **Functional Components**: Use function declarations (`function App() {}`)
- **React 18**: Uses new `createRoot` API
- **Strict Mode**: Enabled in development
- **Testing**: Jest + React Testing Library setup

### Backend Patterns

- **Class-Based**: Server logic in ES6 classes (`Server` class)
- **Environment Variables**: Load via dotenv at entry point
- **Middleware Order**: JSON/URL parsing → static files → API routes → frontend catchall

## Testing

### Setup

- **Framework**: Jest (via react-scripts)
- **Testing Library**: React Testing Library, Jest DOM, User Event
- **Test Files**: `*.test.tsx`, `*.test.ts`
- **Setup**: `src/exp-react-app-ts/setupTests.ts`

### Running Tests

```bash
# Tests would be run via react-scripts (not explicitly defined in package.json)
# Typically: npm test
```

**Note**: Test script not defined in package.json - should be added:
```json
"test": "react-scripts test"
```

## Git Workflow

### Branching

- **Feature Branches**: Use `claude/` prefix for AI-generated work
- **Current Branch**: `claude/claude-md-mi18bpwfwa5c6pib-018DnzCWhWLxeCrdcKZ57viN`
- **Main Branch**: (not specified - likely `main` or `master`)

### Ignored Files (`.gitignore`)

Key ignored paths:
- `dist/` - Webpack build output
- `.env` - Environment variables
- `exp-react-svc/` - Compiled backend
- `node_modules/` - Dependencies
- `build/`, `coverage/` - Build/test artifacts
- IDE files: `.vscode`, `.idea`, `.DS_STORE`

## Common Tasks for AI Assistants

### Adding a New React Component

1. Create `src/exp-react-app-ts/ComponentName.tsx`
2. Create `src/exp-react-app-ts/ComponentName.css` if needed
3. Create `src/exp-react-app-ts/ComponentName.test.tsx` for tests
4. Import and use in `App.tsx` or relevant parent

### Adding a New API Endpoint

1. Open `src/exp-react-svc-ts/index.ts`
2. Add route before root handler (line 30):
   ```typescript
   app.use('/api/new-endpoint', (req: Request, res: Response) => {
       res.status(200).json({data: 'value'});
   });
   ```
3. Test with `npm run server-dev`

### Modifying Build Configuration

**Webpack** (`webpack.config.js`):
- Add loaders in `module.rules`
- Add plugins in `plugins` array
- Modify dev server proxy for new API routes

**TypeScript**:
- Frontend: Edit `tsconfig.json`
- Backend: Edit `tsconfig.server.json`

### Updating Dependencies

```bash
npm install <package>              # Add to dependencies
npm install --save-dev <package>   # Add to devDependencies
npm update                         # Update all packages
```

**Important**: After updating, test both dev and production builds.

## Performance Monitoring

The app includes `reportWebVitals.ts` for Core Web Vitals tracking:
- Currently logs to console (commented out)
- Can send to analytics endpoint
- Metrics: CLS, FID, FCP, LCP, TTFB

## Environment Variables

- **Backend**: Uses dotenv, loads `.env` file
- **Config**: `.env` file in root (gitignored)
- **Access**: `process.env.VARIABLE_NAME`

**Example** `.env`:
```
PORT=3002
NODE_ENV=development
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change port in `src/exp-react-svc-ts/index.ts`
   - Update Dockerfile EXPOSE directive
   - Update webpack proxy in `webpack.config.js`

2. **TypeScript Errors**:
   - Check correct tsconfig for file location
   - Frontend uses `tsconfig.json`
   - Backend uses `tsconfig.server.json`

3. **Module Not Found**:
   - Verify webpack resolve extensions include file type
   - Check import paths (no file extensions needed for .ts/.tsx)

4. **Hot Reload Not Working**:
   - Ensure webpack-dev-server is running (`npm run app`)
   - Check proxy configuration for API calls

## Key Files Reference

| File | Purpose | When to Modify |
|------|---------|---------------|
| `package.json` | Dependencies and scripts | Adding packages, scripts |
| `webpack.config.js` | Frontend build | Adding loaders, plugins |
| `tsconfig.json` | Frontend TS config | TypeScript settings |
| `tsconfig.server.json` | Backend TS config | Backend TS settings |
| `.eslintrc.json` | Linting rules | Code style changes |
| `nodemon.json` | Backend watch config | Watch paths, commands |
| `Dockerfile` | Container config | Deployment changes |
| `src/exp-react-svc-ts/index.ts` | Backend entry | API routes, middleware |
| `src/exp-react-app-ts/App.tsx` | React root component | UI structure |

## Future Improvements

Based on analysis, consider:

1. **Add test script** to package.json
2. **Fix Dockerfile port** mismatch (3000 vs 3002)
3. **Add environment variable** for port configuration
4. **Create API router** module as endpoints grow
5. **Add production/development** environment handling
6. **Set up CI/CD** pipeline
7. **Add React Router** for multi-page navigation
8. **Implement state management** (Redux, Context API, Zustand)
9. **Add API error handling** middleware
10. **Configure path aliases** in tsconfig for cleaner imports

## Questions to Ask Users

When working on this codebase, consider asking:

- What port should the application use?
- Are there API endpoints that need authentication?
- Should we add React Router for navigation?
- What state management solution is preferred?
- Are there specific styling frameworks to use?
- What testing coverage is expected?
- Is there a preferred code formatter (Prettier)?
- Should we add pre-commit hooks?

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Webpack Documentation](https://webpack.js.org/concepts/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Last Updated**: 2025-11-16
**Document Version**: 1.0.0
**Project Status**: Work in Progress
