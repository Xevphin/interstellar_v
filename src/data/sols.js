export const INITIAL_STATS = {
  power: 60,
  oxygen: 60,
  shielding: 60,
  food: 60,
};

export const RESOURCE_KEYS = ["power", "oxygen", "shielding", "food"];

export const OUTPOST_STRUCTURES = [
  {
    id: "moxie",
    day: 1,
    position: [-9.5, 0, -4.5],
    interactionRadius: 5.2,
    event: "normal",
    choiceA: {
      effects: { oxygen: 20, power: -20 },
    },
    choiceB: {
      effects: { power: 15, oxygen: -15 },
    },
  },
  {
    id: "greenhouse",
    day: 2,
    position: [-7.5, 0, 7.5],
    interactionRadius: 5.2,
    event: "normal",
    choiceA: {
      effects: { food: 20, shielding: -20 },
    },
    choiceB: {
      effects: { shielding: 15, food: -15 },
    },
  },
  {
    id: "comms",
    day: 3,
    position: [0, 0, -11.5],
    interactionRadius: 5.2,
    event: "solarStorm",
    choiceA: {
      effects: { shielding: 25, power: -20, oxygen: -10 },
    },
    choiceB: {
      effects: { oxygen: 10, shielding: -25 },
    },
  },
  {
    id: "solar",
    day: 4,
    position: [9.5, 0, -4.5],
    interactionRadius: 5.2,
    event: "dustDevil",
    choiceA: {
      effects: { power: 25, oxygen: -15, food: -10 },
      cleanPanels: true,
    },
    choiceB: {
      effects: { power: -15, food: 10 },
      cleanPanels: false,
    },
  },
  {
    id: "algae",
    day: 5,
    position: [8.0, 0, 7.5],
    interactionRadius: 5.2,
    event: "normal",
    choiceA: {
      effects: { oxygen: 25, power: -15, food: -10 },
    },
    choiceB: {
      effects: { power: 10, food: 10, oxygen: -10 },
    },
  },
  {
    id: "habitat",
    day: 6,
    position: [0, 0, 0],
    interactionRadius: 5.8,
    event: "freezingNight",
    choiceA: {
      effects: { power: -15, oxygen: -10, shielding: -10 },
    },
    choiceB: {
      effects: { power: -25, food: -15 },
    },
  },
];

export const DEFAULT_BENCHMARKS = [
  { name: "Cmdr. Dr. Farah", score: 3450, tasks: 6, quiz: "4/4", isBenchmark: true },
  { name: "Capt. Neil S.", score: 3120, tasks: 6, quiz: "4/4", isBenchmark: true },
  { name: "Lt. Aisyah R.", score: 2780, tasks: 6, quiz: "3/4", isBenchmark: true },
  { name: "Cadet Leo M.", score: 2390, tasks: 5, quiz: "3/4", isBenchmark: true },
  { name: "Ensign Mei L.", score: 1950, tasks: 4, quiz: "2/4", isBenchmark: true },
];
