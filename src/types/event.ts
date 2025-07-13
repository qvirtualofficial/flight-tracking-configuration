export interface TrackingEvent {
  id: string;
  condition: string;
  message: string;
  initialValue?: boolean;
  timeout?: number;
}

export interface TrackingConfiguration {
  events: Omit<TrackingEvent, "id">[];
}

export type ComparisonOperator =
  | "greater_than"
  | "less_than"
  | "equals"
  | "not_equals"
  | "increased_by"
  | "decreased_by"
  | "changed"
  | "increased"
  | "decreased";

export type LogicalOperator = "and" | "or";

export interface ConditionSegment {
  variable: string;
  operator: ComparisonOperator;
  value?: string | number;
  logicalOperator?: LogicalOperator;
}

export const VARIABLES = {
  position: [
    { value: "latitude", label: "Latitude", description: "Decimal latitude" },
    {
      value: "longitude",
      label: "Longitude",
      description: "Decimal longitude",
    },
    { value: "altitude", label: "Altitude MSL", description: "Altitude MSL" },
    {
      value: "altitudeAgl",
      label: "Altitude AGL",
      description: "Altitude AGL",
    },
    {
      value: "bank",
      label: "Bank",
      description: "Degrees bank (left is negative)",
    },
    { value: "heading", label: "Heading", description: "True heading" },
    {
      value: "pitch",
      label: "Pitch",
      description: "Degrees pitch (down is negative)",
    },
  ],
  speed: [
    {
      value: "gs",
      label: "Ground Speed",
      description: "Ground speed in knots",
    },
    {
      value: "tas",
      label: "True Airspeed",
      description: "True airspeed in knots",
    },
    { value: "ias", label: "Indicated Airspeed", description: "IAS in knots" },
    {
      value: "vs",
      label: "Vertical Speed",
      description: "Vertical speed in feet per minute",
    },
  ],
  aircraft: [
    {
      value: "aircraftType",
      label: "Aircraft Type",
      description: "Aircraft type string",
    },
    {
      value: "aircraftEmptyWeight",
      label: "Empty Weight",
      description: "Empty weight of the aircraft",
    },
    {
      value: "enginesCount",
      label: "Engine Count",
      description: "Number of engines",
    },
    {
      value: "engine1Firing",
      label: "Engine 1 Status",
      description: "Boolean (true is on)",
    },
    {
      value: "engine2Firing",
      label: "Engine 2 Status",
      description: "Boolean (true is on)",
    },
    {
      value: "engine3Firing",
      label: "Engine 3 Status",
      description: "Boolean (true is on)",
    },
    {
      value: "engine4Firing",
      label: "Engine 4 Status",
      description: "Boolean (true is on)",
    },
  ],
  controls: [
    {
      value: "gearControl",
      label: "Gear Control",
      description: "Boolean (true when down)",
    },
    {
      value: "flapsControl",
      label: "Flaps Control",
      description: "Flaps detent number",
    },
    {
      value: "flapsLeftPosition",
      label: "Left Flaps",
      description: "Percentage of left flaps",
    },
    {
      value: "flapsRightPosition",
      label: "Right Flaps",
      description: "Percentage of right flaps",
    },
  ],
  phase: [
    {
      value: "phase",
      label: "Flight Phase",
      description: "Current flight phase",
    },
    {
      value: "phaseString",
      label: "Phase String",
      description: "Flight phase string",
    },
  ],
  status: [
    {
      value: "planeOnground",
      label: "On Ground",
      description: "Boolean (true on ground)",
    },
    {
      value: "pauseFlag",
      label: "Paused",
      description: "Boolean (true when paused)",
    },
    {
      value: "slewMode",
      label: "Slew Mode",
      description: "Boolean (true in slew)",
    },
    {
      value: "simulationRate",
      label: "Sim Rate",
      description: "Simulation rate",
    },
    {
      value: "stallWarning",
      label: "Stall Warning",
      description: "Boolean (true when stalling)",
    },
    {
      value: "overspeedWarning",
      label: "Overspeed",
      description: "Boolean (true when overspeeding)",
    },
    {
      value: "crashed",
      label: "Crashed",
      description: "Detect if aircraft has crashed",
    },
  ],
  fuel: [
    {
      value: "fuelTotalQuantityWeight",
      label: "Total Fuel",
      description: "Total fuel quantity weight",
    },
    {
      value: "fuelUsed",
      label: "Fuel Used",
      description: "Amount of fuel used",
    },
  ],
  navigation: [
    {
      value: "milesToGo",
      label: "Miles to Go",
      description: "Nautical miles to arrival",
    },
    {
      value: "cruiseAltitude",
      label: "Cruise Altitude",
      description: "Current cruise altitude",
    },
    {
      value: "landingDistance",
      label: "Landing Distance",
      description: "Distance of landing rollout",
    },
  ],
  communications: [
    {
      value: "transponderFreq",
      label: "Transponder",
      description: "Transponder code",
    },
    { value: "com1Freq", label: "COM1", description: "Com 1 frequency" },
    { value: "com2Freq", label: "COM2", description: "Com 2 frequency" },
    { value: "nav1Freq", label: "NAV1", description: "Nav 1 frequency" },
    { value: "nav2Freq", label: "NAV2", description: "Nav 2 frequency" },
  ],
  environment: [
    {
      value: "windDirection",
      label: "Wind Direction",
      description: "Wind direction in degrees",
    },
    {
      value: "windSpeed",
      label: "Wind Speed",
      description: "Wind speed in knots",
    },
    {
      value: "pressureQNH",
      label: "QNH",
      description: "Pressure setting in millibars",
    },
  ],
  performance: [
    {
      value: "gForceTouchDown",
      label: "G-Force at Touchdown",
      description: "G-forces at touchdown",
    },
    {
      value: "landingRate",
      label: "Landing Rate",
      description: "Landing rate in feet per minute",
    },
  ],
};
