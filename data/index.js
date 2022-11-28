"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var config_1 = require("./config");
var api_1 = require("./api");
var Util = require("./util");
var noOfRecords = config_1["default"].noOfRecords;
var noOfProjects = 2;
var api = new api_1["default"](config_1["default"].baseURL, config_1["default"].username, config_1["default"].password);
var maxLinks = 10, maxVersions = 5;
// Random number generators
var linksRNG = Util.getRNG("linksRNG");
var linkFinderRNG = Util.getRNG("linkFinderRNG");
var linkTypesRNG = Util.getRNG("linkTypesRNG");
var versionsRNG = Util.getRNG("versionsRNG");
var module = {
    generateProjects: function () {
        return __awaiter(this, void 0, void 0, function () {
            var myself, projects, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, api.getMyself()];
                    case 1:
                        myself = _e.sent();
                        console.log(myself);
                        projects = [];
                        _b = (_a = projects).push;
                        return [4 /*yield*/, api.createProject("sample description 400 700 random", myself.accountId, "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban", "big-test-1", "BT1")];
                    case 2:
                        _b.apply(_a, [_e.sent()]);
                        console.log("in gen project");
                        console.log(projects);
                        _d = (_c = projects).push;
                        return [4 /*yield*/, api.createProject("sample description", myself.accountId, "com.pyxis.greenhopper.jira:gh-simplified-scrum-classic", "big-test-2", "BT2")];
                    case 3:
                        _d.apply(_c, [_e.sent()]); // classic project
                        return [2 /*return*/, projects];
                }
            });
        });
    },
    generateIssues: function (projects, noOfIssues) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, i, resultantIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("in gen issues");
                        console.log(projects);
                        issues = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < projects.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, api.createIssuesInBulk(projects[i], noOfIssues)];
                    case 2:
                        resultantIssues = _a.sent();
                        console.log("RESULTATNT ISSSUES");
                        console.log(resultantIssues);
                        if (resultantIssues.length > 0) {
                            issues = issues.concat(resultantIssues);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log("-----------------------------ALL ISSUES-----------------------------");
                        console.log(issues);
                        console.log("----------------------------------------------------------");
                        return [2 /*return*/, issues];
                }
            });
        });
    },
    generateLinks: function (issues) {
        return __awaiter(this, void 0, void 0, function () {
            var linkTypeNames, _i, issues_1, issue, noOfLinks, j, issueIndex, linkTypeIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.getIssueLinkTypeNames()];
                    case 1:
                        linkTypeNames = _a.sent();
                        console.log("FETCTHDE LINK TYPES!!");
                        console.log(linkTypeNames);
                        console.log("issues");
                        console.log(issues);
                        console.log("-----------------------------------------------------");
                        _i = 0, issues_1 = issues;
                        _a.label = 2;
                    case 2:
                        if (!(_i < issues_1.length)) return [3 /*break*/, 7];
                        issue = issues_1[_i];
                        noOfLinks = Util.getPositiveRandomNumber(linksRNG, maxLinks + 1);
                        console.log("NO OF LINKS", noOfLinks);
                        j = 0;
                        _a.label = 3;
                    case 3:
                        if (!(j < noOfLinks)) return [3 /*break*/, 6];
                        issueIndex = Util.getPositiveRandomNumber(linkFinderRNG, issues.length);
                        linkTypeIndex = Util.getPositiveRandomNumber(linkTypesRNG, linkTypeNames.length);
                        console.log(issueIndex, linkTypeIndex);
                        return [4 /*yield*/, api.createLink(issue.key, issues[issueIndex].key, linkTypeNames[linkTypeIndex])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        j++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    generateVersions: function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var noOfVersions, versions, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        noOfVersions = Util.getPositiveRandomNumber(versionsRNG, maxVersions);
                        versions = [];
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < noOfVersions)) return [3 /*break*/, 4];
                        _b = (_a = versions).push;
                        return [4 /*yield*/, api.createVersion()];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, versions];
                }
            });
        });
    }
};
// main logic
var generateData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projects, noOfIssues, issues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, module.generateProjects()];
            case 1:
                projects = _a.sent();
                noOfIssues = noOfRecords / projects.length;
                if (!(projects.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, module.generateIssues(projects, noOfIssues)];
            case 2:
                issues = _a.sent();
                if (!(issues.length > 0)) return [3 /*break*/, 4];
                console.log("issues are there");
                console.log(issues.length);
                return [4 /*yield*/, module.generateLinks(issues)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
generateData();
