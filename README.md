# LearningShare Frontend

A modern React application for language learning and sharing, built with TypeScript, Vite, and a beautiful neubrutalism design system.

## ✨ Features

- 🔐 **Authentication System** - Secure login/register with JWT tokens and automatic refresh
- 🌍 **Internationalization** - Full i18n support (English & Vietnamese)
- 🎨 **Theme System** - Light, Dark, and Retro themes with smooth transitions
- ♿ **Accessibility** - WCAG AA compliant with keyboard navigation support
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🚀 **Performance Optimized** - Code splitting, lazy loading, and React.memo optimizations
- 🛡️ **Type Safe** - Fully typed with TypeScript strict mode
- 🎯 **Error Handling** - Global error boundaries and toast notifications
- 📝 **Form Validation** - Comprehensive validation with Zod schemas

## 🛠️ Tech Stack

### Core

- **React 19.2** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Routing & State

- **React Router v7** - Client-side routing
- **Context API** - Global state management (Auth, Theme, Toast)

### Styling

- **CSS Modules** - Scoped component styles
- **CSS Variables** - Dynamic theming
- **Neubrutalism** - Modern design aesthetic

### Forms & Validation

- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation

### HTTP & API

- **Axios** - HTTP client with interceptors
- **Token Refresh** - Automatic token renewal

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── ErrorBoundary.tsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── settings/
│   └── auth/
├── layouts/            # Layout components
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── index.ts
├── services/           # API services
│   ├── api.ts          # Axios instance with interceptors
│   ├── authService.ts
│   └── userService.ts
├── schemas/            # Zod validation schemas
│   └── auth.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── i18nUtils.ts
│   └── image.ts
├── constants/          # App constants
│   ├── settings.ts
│   └── ui.ts
├── locales/            # Translation files
│   ├── en/
│   └── vi/
├── assets/             # Static assets
├── i18n.ts             # i18next configuration
├── index.css           # Global styles & theme variables
├── main.tsx            # App entry point
└── App.tsx             # Root component with routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LearningFe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Update the variables:

   ```env
   VITE_API_URL=http://localhost:5212/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically

# Formatting
npm run format       # Format code with Prettier
```

## 🔐 Environment Variables

| Variable          | Description               | Required | Default                     |
| ----------------- | ------------------------- | -------- | --------------------------- |
| `VITE_API_URL`    | Backend API base URL      | Yes      | `http://localhost:5212/api` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | No       | -                           |

## 🎨 Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for comprehensive documentation on:

- Color palette & themes
- Typography scale
- Spacing system
- Component variants
- Usage examples

## 🏗️ Architecture

### Authentication Flow

1. User logs in with email/password
2. Backend returns `accessToken` and `refreshToken`
3. Tokens are stored in `localStorage`
4. `accessToken` is included in all API requests via interceptor
5. When `accessToken` expires (401 response):
   - Request is queued
   - `refreshToken` is used to get new `accessToken`
   - Queued requests are retried with new token
6. If refresh fails, user is logged out

### State Management

- **AuthContext**: User authentication state, login/logout functions
- **ThemeContext**: Current theme selection (light/dark/retro)
- **ToastContext**: Global toast notifications

### Form Handling

All forms use `react-hook-form` with Zod validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(loginSchema),
});
```

## 🧩 Key Components

### UI Components

- **Button** - Variants: primary, secondary, outline, ghost, danger
- **Input** - With label and error support
- **Switch** - Toggle component
- **Loading** - Loading spinner with fullscreen/inline modes
- **Toast** - Notification system with auto-dismiss

### Layout Components

- **MainLayout** - Header with navigation and auth status
- **AuthLayout** - Centered layout for login/register pages

### Error Handling

- **ErrorBoundary** - Catches React errors, shows fallback UI
- **Toast Notifications** - User-friendly error messages
- **API Interceptors** - Handles network errors gracefully

## 🌍 Internationalization

i18next is configured for multi-language support:

```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Use translations
<h1>{t('home.title')}</h1>;

// Change language
i18n.changeLanguage('vi');
```

Translation files are in `src/locales/{lang}/translation.json`.

## 🚦 Routing

Routes are defined in `App.tsx`:

- `/` - Home page (public)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset with token
- `/settings` - User settings (protected)

Protected routes require authentication and redirect to `/login` if not authenticated.

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Reduced motion support

## 🎯 Performance

- Code splitting with React.lazy()
- Route-based lazy loading
- React.memo on frequently rendered components
- Optimized bundle size with tree shaking
- CSS Modules for minimal style overhead

## 🐛 Error Tracking (Optional)

Sentry integration is prepared but commented out. To enable:

1. Install Sentry:

   ```bash
   npm install @sentry/react @sentry/vite-plugin
   ```

2. Add your DSN to `.env`:

   ```env
   VITE_SENTRY_DSN=your_sentry_dsn_here
   ```

3. Uncomment Sentry initialization in:
   - `src/components/ErrorBoundary.tsx`
   - `src/main.tsx` (if you add initialization there)

## 📝 Code Style

- **ESLint** - Enforces code quality rules
- **Prettier** - Auto-formats code
- **TypeScript Strict Mode** - Maximum type safety
- **Naming Conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Hooks: camelCase with 'use' prefix (`useAuth.ts`)
  - Utils: camelCase (`formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (`API_URL`)
  - Types: PascalCase (`UserDTO`)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all linting passes: `npm run lint`
4. Format your code: `npm run format`
5. Build successfully: `npm run build`
6. Submit a pull request

## 📄 License

[Add your license here]

## 👥 Authors

[Add authors here]

---

**Built with ❤️ using React + TypeScript + Vite**
