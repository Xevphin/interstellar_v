export const INITIAL_STATS = {
  power: 60,
  oxygen: 60,
  shielding: 60,
  food: 60,
};

export const RESOURCE_KEYS = ["power", "oxygen", "shielding", "food"];

export const SOL_DATA = [
  {
    id: 1,
    focusModule: "moxie",
    event: "normal",
    choiceA: {
      effects: { oxygen: 20, power: -20 },
    },
    choiceB: {
      effects: { power: 15, oxygen: -15 },
    },
  },
  {
    id: 2,
    focusModule: "greenhouse",
    event: "normal",
    choiceA: {
      effects: { food: 20, shielding: -20 },
    },
    choiceB: {
      effects: { shielding: 15, food: -15 },
    },
  },
  {
    id: 3,
    focusModule: "habitat",
    event: "solarStorm",
    choiceA: {
      effects: { shielding: 25, power: -20, oxygen: -10 },
    },
    choiceB: {
      effects: { oxygen: 10, shielding: -25 },
    },
  },
  {
    id: 4,
    focusModule: "solar",
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
    id: 5,
    focusModule: "greenhouse",
    event: "normal",
    choiceA: {
      effects: { oxygen: 25, power: -15, food: -10 },
    },
    choiceB: {
      effects: { power: 10, food: 10, oxygen: -10 },
    },
  },
  {
    id: 6,
    focusModule: "habitat",
    event: "freezingNight",
    choiceA: {
      effects: { power: -15, oxygen: -10, shielding: -10 },
    },
    choiceB: {
      effects: { power: -25, food: -15 },
    },
  },
];
