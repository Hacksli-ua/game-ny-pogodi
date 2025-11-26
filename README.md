# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Game Specifications

Це гра де ми біжимо за зайцем, і перепригуємо каміння. Гра на 2х.
- 1й гравець: Вовк
- 2й гравець: Заєць

### Game Rules
- Заєць починає гру на 3 секунди раніше
- За ним починає бігти вовк
- Спочатку каміння не так багато, далі каменів стає більше
- Гра запускається в браузері

### Controls
- 1й гравець (Вовк) пригає за допомогою кнопки A
- 2й гравець (Заєць) пригає за допомогою кнопки Space

## Development Setup

### Running the Game
To run the game locally:
```bash
# Open index.html in a browser
open index.html  # macOS
# or use a local server
python3 -m http.server 8000
```

## Architecture Overview

### Expected File Structure
```
/
├── index.html      # Main game HTML file
├── style.css       # Game styling
├── game.js         # Core game logic
└── CLAUDE.md       # This file
```

### Key Implementation Components
1. **Game State Management**: Track player positions, obstacles, scores, and game phase
2. **Collision Detection**: Check for collisions between players and stones
3. **Animation Loop**: Use requestAnimationFrame for smooth gameplay
4. **Difficulty Progression**: Increase stone frequency over time
5. **Player Controls**: Handle keyboard inputs (A for Wolf, Space for Rabbit)
6. **Start Delay**: Implement 3-second head start for Rabbit player

### Game Mechanics to Implement
- Side-scrolling endless runner
- Jump physics with gravity
- Procedural stone generation with increasing difficulty
- Score tracking based on distance/time
- Game over conditions (collision with stones)
- Restart functionality