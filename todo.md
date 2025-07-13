# Flight Tracking Configuration UI - Todo List

## Setup & Dependencies

- [ ] Install shadcn/ui with Vite/React setup
- [ ] Install @dnd-kit/sortable for drag and drop functionality
- [ ] Configure Tailwind CSS (required by shadcn)
- [ ] Set up Vitest for browser testing
- [ ] Configure GitHub Pages workflow

## Core Features Based on Documentation

- [ ] Create main layout with shadcn components
- [ ] Build event configuration form with:
  - Condition builder (variable, comparison, reference)
  - Support for joiners (and/or)
  - Message template editor with variable insertion
  - InitialValue toggle
  - Timeout input (milliseconds)
- [ ] Implement drag-and-drop ordering using @dnd-kit
- [ ] Add JSON preview/editor component with syntax highlighting
- [ ] Create import/export functionality for configurations
- [ ] Add validation for:
  - Valid JSON structure
  - Valid variable names in conditions and messages
  - Valid comparison operators
  - String vs number comparisons

## UI Components

- [ ] Header with title and export/import buttons
- [ ] Event list with draggable items showing:
  - Condition summary
  - Message preview
  - Edit/Delete actions
- [ ] Add/Edit event modal with:
  - Condition builder UI
  - Message template editor
  - Variable picker/autocomplete
  - InitialValue checkbox
  - Timeout input
- [ ] JSON preview panel with:
  - Syntax highlighting
  - Copy to clipboard
  - Download as file
- [ ] Delete confirmation dialog
- [ ] Variable reference panel/sidebar

## Condition Builder Features

- [ ] Variable dropdown with all available variables
- [ ] Comparison operator dropdown (greater_than, less_than, equals, not_equals, etc.)
- [ ] Reference value input (with quotes for strings)
- [ ] Add condition segment button for and/or joiners
- [ ] Support for special comparisons (changed, increased, decreased)
- [ ] Visual condition preview

## Testing

- [ ] Set up Vitest browser test environment
- [ ] Test drag and drop functionality
- [ ] Test condition builder logic
- [ ] Test form validation
- [ ] Test JSON import/export
- [ ] Test event creation and deletion
- [ ] Test variable replacement in messages

## Deployment

- [ ] Configure vite.config.js for GitHub Pages base path
- [ ] Create GitHub Actions workflow for automatic deployment
- [ ] Test deployment process

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
