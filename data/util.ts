const seedrandom = require("seedrandom");

export const getRNG = (seed: string): any => {
  return seedrandom(seed);
};

export const getRandomNumber = (rng: any, max: number): number => {
  return rng.int32() % max;
};