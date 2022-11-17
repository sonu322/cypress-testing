"use strict";
exports.__esModule = true;
exports.getRandomNumber = exports.getRNG = void 0;
var seedrandom = require("seedrandom");
var getRNG = function (seed) {
    return seedrandom(seed);
};
exports.getRNG = getRNG;
var getRandomNumber = function (rng, max) {
    return rng.int32() % max;
};
exports.getRandomNumber = getRandomNumber;
