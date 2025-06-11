# Tim's Clock & Break Timer 🕒⏱️

A sleek, minimalist clock and break timer designed for educators, trainers, and presenters. Features a beautiful analog/digital clock for your desktop and a fullscreen countdown timer perfect for managing class breaks.

🌐 **[TechTrainerTim.com](https://techtrainertim.com)**

![GitHub release (latest by date)](https://img.shields.io/github/v/release/timothywarner-org/tims-clock-break-timer)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/timothywarner-org/tims-clock-break-timer/build-electron.yml)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

## ✨ Features

### 🕐 **Personal Clock**
- Clean analog clock with smooth second hand
- Digital time display with seconds
- Full date with day of week
- Minimal, distraction-free design
- Link to timer for quick access

### ⏲️ **Break Timer**
- Preset timers: 5, 8, 9, and 10 minutes
- Custom timer input (1-999 minutes)
- High-precision timing that works in background tabs
- Motivational quotes during breaks
- Visual pulse animation when time's up
- Keyboard shortcuts (Space: play/pause, R: reset, 1-4: presets, F11: fullscreen)
- Perfect for Pomodoro Technique, classroom breaks, or meeting timeouts

### 💻 **Desktop App** (Electron)
- Dual-window design: Clock + Timer
- Resizable windows with always-on-top option
- Cross-platform: Windows, macOS, Linux
- Professional menu system
- Fullscreen support for presentations

## 🚀 Quick Start

### Web Version
```bash
npm install
npm start
```
- Clock: http://localhost:3000
- Timer: http://localhost:3000/timer.html

### Desktop App
Download the latest release from the [Releases](https://github.com/timothywarner-org/tims-clock-break-timer/releases) page or build from source:

```bash
npm install
npm run electron
```

## 🛠️ Build Desktop App

```bash
# Windows
npm run build-win

# macOS  
npm run build-mac

# Linux
npm run build-linux

# All platforms
npm run build-all
```

## 🎨 Design Philosophy

- **Minimalist**: Clean interface without distractions
- **Accessible**: High contrast, colorblind-friendly palette
- **Performant**: GPU-accelerated animations, efficient updates
- **Reliable**: Accurate timing even in background tabs

## 🔧 Technologies

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for analog clock
- CSS3 animations with GPU hints
- Electron for desktop packaging
- GitHub Actions for automated builds

## 📝 License

ISC License - feel free to use in your classrooms and presentations!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 👨‍🏫 About

Created by [Tim Warner](https://techtrainertim.com) for educators and presenters worldwide. Perfect for:
- Classroom break management
- Workshop timing
- Presentation pacing
- Pomodoro Technique
- Meeting timeouts

---

Made with ❤️ for the teaching community