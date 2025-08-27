# 🎯 Pasapalabra - Game System for Streaming

A complete web system for managing and visualizing Pasapalabra games in real-time, designed for streamers and educators who want to integrate this word game into their broadcasts.

## 🌍 Internationalization

This application supports multiple languages:

- **Spanish (es-ES)** - Primary language
- **English (en-US)** - Secondary language

The language can be changed using the language selector in the top navigation bar. All user interface text is fully localized.

## 🛠️ Technologies Used

- **Frontend Framework**: [Vue.js 3.5.18](https://vuejs.org/) with Composition API
- **State Management**: [Pinia 3.0.3](https://pinia.vuejs.org/)
- **UI Components**: [shadcn/ui v4](https://ui.shadcn.com/) + [Tailwind CSS 4.1.12](https://tailwindcss.com/)
- **Icons**: [@iconoir/vue 7.11.0](https://iconoir.com/)
- **Internationalization**: [Vue I18n 10.0.4](https://vue-i18n.intlify.dev/)
- **Build Tool**: [Vite 7.1.2](https://vitejs.dev/)
- **Testing**: [Vitest 3.2.4](https://vitest.dev/)
- **Language**: [TypeScript 5.8.3](https://www.typescriptlang.org/)

## ✨ Main Features

- 🎮 **Game Management**: Create and manage multiple games simultaneously
- 🔤 **Complete Spanish Alphabet**: Includes all 27 letters of the Spanish alphabet (A-Z, Ñ)
- ⏱️ **Configurable Timer**: Customizable time limit per game (60s - 3600s)
- 📊 **Custom Scoring System**: Configurable points for correct, incorrect, and pasapalabra
- 📺 **Streaming Visualization**: Panel optimized for streaming software (1920x1080 vertical)
- 💾 **Local Persistence**: Data saved in browser localStorage
- 🔄 **Real-time Synchronization**: Automatic changes between browser tabs
- 📱 **Responsive Design**: Works on desktop, tablet and mobile
- 🌍 **Multi-language Support**: Full localization in Spanish and English
- 🎨 **Enhanced UI**: Modern dropdown menus and improved navigation components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:CrazyJMB/pasapalabra.git
   cd pasapalabra
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run test         # Run tests
```

## 🎮 How to Use

### 1. Create a New Game

1. Open the administration panel (`/admin`)
2. Click "New Game"
3. Configure game name and time limit

### 2. Control the Game

1. **Alphabet Ring**: Click on any letter to select it
2. **Letter States**:
   - ✅ **Correct**: Green (configurable points)
   - ❌ **Incorrect**: Red (configurable points)
   - → **Pasapalabra**: Blue (configurable points)
3. **Game Controls**: Pause/Continue and Finish

### 3. Stream the Game

1. Open the visualizer view (`/visualizador`)
2. In your streaming software, add a "Window Capture" source
3. Select the visualizer window
4. Recommended resolution: 1920x1080 (vertical)

## 🏗️ Project Structure

```
src/
├── components/          # Vue components
│   ├── admin/          # Administration components
│   ├── game/           # Game components
│   └── ui/             # Base components (shadcn/ui)
├── composables/         # Vue composition hooks
├── stores/              # Pinia stores
├── types/               # TypeScript types
├── utils/               # Utilities and helpers
├── views/               # Main views
└── test/                # Unit and integration tests
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a branch for your feature
3. **Commit** your changes
4. **Push** to the branch
5. **Create** a Pull Request

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

**What this means:**

- ✅ **Free to use** for personal, educational, and non-profit purposes
- ✅ **Free to modify** and adapt for your own projects
- ✅ **Free to share** with proper attribution
- ❌ **Not for commercial use** (business, selling, profit generation)

See the [LICENSE](LICENSE) file for full details and terms.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of all changes and version history.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/CrazyJMB/pasapalabra/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CrazyJMB/pasapalabra/discussions)

---

**Enjoy playing Pasapalabra! 🎯✨**
