# Flight Tracking Configuration UI - Todo List

## Setup & Dependencies

- [x] Install shadcn/ui with Vite/React setup
- [x] Install @dnd-kit/sortable for drag and drop functionality
- [x] Configure Tailwind CSS (required by shadcn)
- [x] Set up Vitest for browser testing
- [x] Configure GitHub Pages workflow

## Core Features Based on Documentation

- [x] Create main layout with shadcn components
- [x] Build event configuration form with:
  - Condition builder (variable, comparison, reference)
  - Support for joiners (and/or) - partial, single conditions only
  - Message template editor with variable insertion
  - InitialValue toggle
  - Timeout input (milliseconds)
- [x] Implement drag-and-drop ordering using @dnd-kit
- [x] Add JSON preview/editor component with syntax highlighting
- [x] Create import/export functionality for configurations
- [x] Add validation for:
  - Valid JSON structure
  - Valid variable names in conditions and messages
  - Valid comparison operators
  - String vs number comparisons

## UI Components

- [x] Header with title and export/import buttons
- [x] Event list with draggable items showing:
  - Condition summary
  - Message preview
  - Edit/Delete actions
- [x] Add/Edit event modal with:
  - Condition builder UI
  - Message template editor
  - Variable picker/autocomplete
  - InitialValue checkbox
  - Timeout input
- [x] JSON preview panel with:
  - Syntax highlighting
  - Copy to clipboard (via export button)
  - Download as file
- [ ] Delete confirmation dialog
- [ ] Variable reference panel/sidebar

## Condition Builder Features

- [x] Variable dropdown with all available variables
- [x] Comparison operator dropdown (greater_than, less_than, equals, not_equals, etc.)
- [x] Reference value input (with quotes for strings)
- [ ] Add condition segment button for and/or joiners (complex conditions)
- [x] Support for special comparisons (changed, increased, decreased)
- [x] Visual condition preview

## Testing

- [x] Set up Vitest browser test environment
- [x] Test drag and drop functionality (manual)
- [x] Test condition builder logic (validation tests)
- [x] Test form validation
- [x] Test JSON import/export (basic tests)
- [x] Test event creation and deletion (manual)
- [ ] Test variable replacement in messages

## Deployment

- [x] Configure vite.config.js for GitHub Pages base path
- [x] Create GitHub Actions workflow for automatic deployment
- [ ] Test deployment process

## Future Enhancements

- [ ] Add support for complex conditions with multiple and/or joiners
- [ ] Add delete confirmation dialog
- [ ] Add variable reference sidebar
- [ ] Add copy to clipboard button for JSON
- [ ] Add dark mode support
- [ ] Add example configurations/templates
- [ ] Add undo/redo functionality

## Available Variables Reference

Phase variables: BOARDING, PUSH_BACK, TAXI, TAKE_OFF, REJECTED_TAKE_OFF, CLIMB, CRUISE, DESCENT, APPROACH, FINAL, LANDED, GO_AROUND, TAXI_TO_GATE

Position/Movement: latitude, longitude, altitude, altitudeAgl, bank, heading, pitch, gs, vs, tas, ias

Aircraft: aircraftType, aircraftEmptyWeight, enginesCount, engine1-4Firing, engine1-4N1, engine1-4N2

Controls: gearControl, flapsControl, flapsLeftPosition, flapsRightPosition

Fuel: fuelTotalQuantityWeight, fuelUsed

Time: clockHour, clockMin, clockSec, zuluHour, zuluMin, etc.

Status: planeOnground, pauseFlag, slewMode, simulationRate, stallWarning, overspeedWarning, crashed

Communications: transponderFreq, com1Freq, com2Freq, nav1Freq, nav2Freq

Other: windDirection, windSpeed, pressureQNH, milesToGo, cruiseAltitude, landingDistance, gForceTouchDown, landingRate