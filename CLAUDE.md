# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a two-page web application designed for teaching and presentations:
1. **Personal Clock** (index.html) - Minimal analog/digital clock for desktop display
2. **Break Timer** (timer.html) - Shareable countdown timer for managing class breaks

## Commands

```bash
# Start development server on port 3000
npm start

# Alternative development command (same as start)
npm dev
```

Access the application at:
- Clock: http://localhost:3000
- Timer: http://localhost:3000/timer.html

## Architecture

The application is built with vanilla JavaScript, HTML, and CSS - no build process required.

### Page Structure
- **Clock page**: `index.html` + `clock-script.js` + `clock-styles.css`
- **Timer page**: `timer.html` + `timer-script.js` + `timer-styles.css`

### Key Implementation Details

**Clock (clock-script.js)**
- Updates every 250ms using `setInterval`
- Canvas-based analog clock drawing
- Digital time display with seconds
- Full date display with day of week

**Timer (timer-script.js)**
- High-precision timing using `requestAnimationFrame` and `Date.now()`
- Prevents timer drift even when browser tab is in background
- Preset times: 5, 8, 9, and 10 minutes
- Keyboard shortcuts: Space (play/pause), R (reset), 1-4 (presets), F11 (fullscreen)
- Motivational quotes array that displays randomly when timer starts
- Visual pulse animation when timer expires (no audio alarm)

### Design Considerations
- Colorblind-friendly palette (avoids red/green combinations)
- High contrast for accessibility
- Minimal, distraction-free interface
- Poppins font from Google Fonts
- Performance optimized with GPU acceleration hints
- Mobile responsive design

### Branding
- TechTrainerTim.com link on timer page
- Blue color scheme (#2196f3, #21cbf3) matching the brand