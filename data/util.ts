const seedrandom = require("seedrandom");

export const getRNG = (seed: string): any => {
  return seedrandom(seed);
};

export const getPositiveRandomNumber = (rng: any, max: number): number => {
  let randomInt = rng.int32() % max;
  if (randomInt < 0) {
    randomInt = randomInt * -1;
  }
  return randomInt;
};