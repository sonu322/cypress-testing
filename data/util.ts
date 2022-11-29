const seedrandom = require("seedrandom");

export const getRNG = (seed: string): any => {
  return seedrandom(seed);
};

export const getRandomWholeNumber = (rng: any, max: number): number => {
  let randomInt = rng.int32() % max;
  if (randomInt < 0) {
    randomInt = randomInt * -1;
  }
  return randomInt;
};

export const getRandomPositiveNumber = (rng: any, max: number): number => {
  let randomInt = rng.int32() % max;
  if (randomInt < 0) {
    randomInt = randomInt * -1;
  }
  if (randomInt === 0) {
    randomInt = getRandomPositiveNumber(rng, max);
  }
  return randomInt;
};