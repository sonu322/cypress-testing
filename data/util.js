"use strict";
exports.__esModule = true;
exports.getRandomPositiveNumber = exports.getRandomWholeNumber = exports.getRNG = void 0;
var seedrandom = require("seedrandom");
var getRNG = function (seed) {
    return seedrandom(seed);
};
exports.getRNG = getRNG;
var getRandomWholeNumber = function (rng, max) {
    var randomInt = rng.int32() % max;
    if (randomInt < 0) {
        randomInt = randomInt * -1;
    }
    return randomInt;
};
exports.getRandomWholeNumber = getRandomWholeNumber;
var getRandomPositiveNumber = function (rng, max) {
    var randomInt = rng.int32() % max;
    if (randomInt < 0) {
        randomInt = randomInt * -1;
    }
    if (randomInt === 0) {
        randomInt = (0, exports.getRandomPositiveNumber)(rng, max);
    }
    return randomInt;
};
exports.getRandomPositiveNumber = getRandomPositiveNumber;
