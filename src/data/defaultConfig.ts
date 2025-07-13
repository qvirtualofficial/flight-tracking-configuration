import type { TrackingConfiguration } from "@/types/event";

export const defaultConfiguration: TrackingConfiguration = {
  "events": [
    {
      "condition": "{altitude} greater_than 100",
      "message": "Aircraft is airborne at {altitude} feet"
    },
    {
      "condition": "{altitude} greater_than 1000",
      "message": "Climbing through {altitude} feet"
    },
    {
      "condition": "{altitude} greater_than 5000",
      "message": "Reached {altitude} feet, continuing climb"
    },
    {
      "condition": "{altitude} greater_than 10000",
      "message": "Flight level change - now at {altitude} feet"
    },
    {
      "condition": "{altitude} greater_than 18000",
      "message": "Entering Class A airspace at FL{altitude_fl}"
    },
    {
      "condition": "{altitude} greater_than 25000",
      "message": "High altitude cruise - FL{altitude_fl}"
    },
    {
      "condition": "{altitude} greater_than 35000",
      "message": "Very high altitude - FL{altitude_fl}"
    },
    {
      "condition": "{vs} greater_than 500",
      "message": "Climbing at {vs} feet per minute"
    },
    {
      "condition": "{vs} less_than -500",
      "message": "Descending at {vs} feet per minute"
    },
    {
      "condition": "{vs} greater_than 2000",
      "message": "Rapid climb detected - {vs} fpm"
    },
    {
      "condition": "{vs} less_than -2000",
      "message": "Rapid descent detected - {vs} fpm"
    },
    {
      "condition": "{ground_speed} greater_than 100 and {altitude} less_than 500",
      "message": "High speed taxi or takeoff roll - {ground_speed} knots"
    },
    {
      "condition": "{ground_speed} greater_than 250 and {altitude} less_than 10000",
      "message": "Exceeding 250 knots below 10,000 feet - {ground_speed} knots at {altitude} feet"
    },
    {
      "condition": "{ground_speed} greater_than 400",
      "message": "High speed cruise - {ground_speed} knots"
    },
    {
      "condition": "{heading} changed",
      "message": "Course change - now heading {heading}°"
    },
    {
      "condition": "{flaps} changed",
      "message": "Flap setting changed to {flaps}"
    },
    {
      "condition": "{gear} changed",
      "message": "Landing gear {gear}"
    },
    {
      "condition": "{lights_beacon} changed",
      "message": "Beacon lights {lights_beacon}"
    },
    {
      "condition": "{lights_nav} changed",
      "message": "Navigation lights {lights_nav}"
    },
    {
      "condition": "{lights_strobe} changed",
      "message": "Strobe lights {lights_strobe}"
    },
    {
      "condition": "{lights_taxi} changed",
      "message": "Taxi lights {lights_taxi}"
    },
    {
      "condition": "{lights_landing} changed",
      "message": "Landing lights {lights_landing}"
    },
    {
      "condition": "{autopilot} changed",
      "message": "Autopilot {autopilot}"
    },
    {
      "condition": "{transponder} changed",
      "message": "Transponder set to {transponder}"
    },
    {
      "condition": "{engines_running} equals true",
      "message": "Engines started - ready for taxi"
    },
    {
      "condition": "{engines_running} equals false",
      "message": "Engines shut down"
    },
    {
      "condition": "{fuel_quantity} less_than 1000",
      "message": "Low fuel warning - {fuel_quantity} lbs remaining"
    },
    {
      "condition": "{fuel_quantity} less_than 500",
      "message": "Critical fuel level - {fuel_quantity} lbs remaining"
    },
    {
      "condition": "{ground_speed} less_than 5 and {engines_running} equals true",
      "message": "Aircraft stationary with engines running"
    },
    {
      "condition": "{ground_speed} equals 0 and {altitude} greater_than 0",
      "message": "Aircraft appears to be hovering or in a hover state"
    },
    {
      "condition": "{outside_air_temperature} less_than -40",
      "message": "Extremely cold conditions - OAT {outside_air_temperature}°C"
    },
    {
      "condition": "{wind_speed} greater_than 25",
      "message": "Strong winds detected - {wind_speed} knots from {wind_direction}°"
    },
    {
      "condition": "{wind_speed} greater_than 40",
      "message": "Very strong winds - {wind_speed} knots, use caution"
    }
  ]
};