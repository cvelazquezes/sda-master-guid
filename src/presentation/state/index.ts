/**
 * Contexts
 *
 * All React Context providers and hooks for the application.
 * Consolidated from src/context/ and src/presentation/state/
 */

// Auth
export { AuthProvider, useAuth } from './AuthContext';

// Theme
export {
  ThemeProvider,
  useTheme,
  useActiveTheme,
  type ThemeMode,
  type ActiveTheme,
  type ThemeContextType,
} from './ThemeContext';

