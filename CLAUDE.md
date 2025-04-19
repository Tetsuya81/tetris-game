# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands
- Start server: `node server.js` (default port 9999)
- Background run: `node server.js &`
- With PM2: `pm2 start ecosystem.config.js --env development` or `--env production`
- Stop PM2 process: `pm2 stop smarttetris`

## Code Style Guidelines
- Indentation: 4 spaces
- Naming: camelCase for variables and functions
- Comments: Use clear comments in Japanese with proper formatting
- ES6+ features: Prefer const/let over var, use arrow functions and destructuring
- Error handling: Check for edge cases with clear error messages
- HTML/CSS structure: Use semantic HTML elements and CSS classes with consistent naming
- Function organization: Group related functions together in logical sections

## File Structure
- HTML: index.html (game structure)
- CSS: styles.css (styling and responsive design)
- JS: script.js (game logic), server.js (static file server)
- Config: ecosystem.config.js (PM2 configuration)

## Testing
Manual testing only - validate gameplay in mobile browsers (Chrome, Safari, Firefox)