# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 27/08/2025

### Added

- Complete Pasapalabra game management system
- Administration panel with CRUD for games
- View optimized for streaming software
- Configurable scoring system
- Local persistence with localStorage
- Real-time synchronization between browser tabs
- Responsive design for all devices
- WCAG 2.1 AA accessibility
- Unit and integration tests with Vitest
- Info modal explaining how to use the application
- Internationalization (i18n) support with Vue I18n
  - Spanish (es-ES) as primary language
  - English (en-US) as fallback language
  - Language selector component in the UI
  - Complete localization of all user-facing text
- Enhanced UI Components
  - Dropdown menu components for better navigation
  - Language selector with flag indicators
  - Improved accessibility and user experience
- Development Workflow Improvements
  - GitHub Actions for CI/CD
  - Enhanced testing infrastructure
  - Better TypeScript configuration

### Technical Features

- Vue.js 3.5.18 with Composition API
- Pinia 3.0.3 for state management
- shadcn/ui v4 + Tailwind CSS 4.1.12
- TypeScript with strict typing
- Vite for optimized build
- Vue I18n 10.0.4 for internationalization
- @intlify/unplugin-vue-i18n for build optimization

### Known Limitations

- Multiple players per game not implemented
- Export/import functionality not implemented
- localStorage synchronization only works between tabs of the same browser
- For streaming software integration, use "Window Capture" instead of "Browser Source"

---
