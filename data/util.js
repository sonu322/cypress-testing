"use strict";
exports.__esModule = true;
exports.getPositiveRandomNumber = exports.getRNG = void 0;
var seedrandom = require("seedrandom");
var getRNG = function (seed) {
    return seedrandom(seed);
};
exports.getRNG = getRNG;
var getPositiveRandomNumber = function (rng, max) {
    var randomInt = rng.int32() % max;
    if (randomInt < 0) {
        randomInt = randomInt * -1;
    }
    return randomInt;
};
exports.getPositiveRandomNumber = getPositiveRandomNumber;
