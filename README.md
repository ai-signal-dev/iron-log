# IRON LOG - Workout Tracking PWA

A minimal, futuristic workout tracker built as a PWA with React + TypeScript.

Live: https://ai-signal-dev.github.io/iron-log/

## Kiro Birthday Challenge - Day 3: Bug Fix

### What was broken

The WorkoutPage had two critical data persistence bugs:

1. **Bug #1: Today's workout data not loaded on page mount** — The page used `useState([])` as its only data source. When a user refreshed the browser or navigated away and back, all recorded sets disappeared because the component never queried IndexedDB for existing today's data. The dashboard always started empty.

2. **Bug #2: Completing a set did not persist to IndexedDB** — The `completeSet` function only updated React state (`setActiveExercises`). It never called `db.workouts.add()` or `db.workouts.update()`. If the user closed the app mid-workout, all progress was lost permanently.

### How Kiro diagnosed and fixed it

Kiro first performed a full code review of all source files, identifying 9 distinct bugs. After selecting bugs #1 and #2 for their user-facing severity, Kiro:

1. Set up Vitest with fake-indexeddb to create a test environment
2. Wrote 4 tests that verified both the DB layer behavior and the source code patterns (checking for `useLiveQuery`, `initialLoadDone`, `db.workouts.update`, `db.workouts.add`)
3. Confirmed RED state: 2 tests failed because the WorkoutPage lacked DB loading and immediate persistence
4. Applied the fix: added `useLiveQuery` to load today's workouts on mount, added `useEffect` with `initialLoadDone` guard to populate state from DB, and rewrote `completeSet` as async with immediate `db.workouts.add`/`db.workouts.update` calls
5. Confirmed GREEN state: all 4 tests pass

### Running tests

```bash
cd iron-log
npm install
npm test
```

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (dark theme, gradient accents)
- IndexedDB via Dexie.js
- Web Speech API for voice input
- Recharts for progress graphs
- PWA with offline support (Workbox)
- Vitest for testing
