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
var mockProjectsData_1 = require("./mockProjectsData");
var noOfRecords = config_1["default"].noOfRecords;
// const noOfProjects = 2;
var api = new api_1["default"](config_1["default"].baseURL, config_1["default"].username, config_1["default"].password);
var maxLinks = 2;
var maxVersions = 5;
// Random number generators
var linksRNG = Util.getRNG("linksRNG");
var linkFinderRNG = Util.getRNG("linkFinderRNG");
var linkTypesRNG = Util.getRNG("linkTypesRNG");
var versionsRNG = Util.getRNG("versionsRNG");
var parentIssueNumberRNG = Util.getRNG("no-of-parent-issues");
var epicIssueNumberRNG = Util.getRNG("epic-issues");
var module = {
    generateProjects: function (mockProjectsData) {
        return __awaiter(this, void 0, void 0, function () {
            var myself, promises, projects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, api.getMyself()];
                    case 1:
                        myself = _a.sent();
                        console.log(myself);
                        promises = [];
                        mockProjectsData.forEach(function (projectData) {
                            promises.push(api.createProject(projectData.description, myself.accountId, projectData.projectTemplateKey, projectData.name, projectData.key));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        projects = _a.sent();
                        return [2 /*return*/, projects];
                }
            });
        });
    },
    generateEpics: function (project, numberOfIssues, epicName, epicIssueTypeName, projectStyle, fields) {
        return __awaiter(this, void 0, void 0, function () {
            var epicNameField, epicNameFieldKey, epicIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        epicNameField = fields.find(function (field) { return field.name === "Epic Name"; });
                        epicNameFieldKey = epicNameField.key;
                        return [4 /*yield*/, api.createEpicIssuesInBulk(project.key, numberOfIssues, epicIssueTypeName, epicName, epicNameFieldKey, projectStyle)];
                    case 1:
                        epicIssues = _a.sent();
                        return [2 /*return*/, epicIssues];
                }
            });
        });
    },
    generateChildIssues: function (project, numberOfIssues, childIssueTypeNames, epicIssues, projectStyle, fields) {
        return __awaiter(this, void 0, void 0, function () {
            var epicIssueKeys, epicLinkField, epicLinkFieldKey, childIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        epicIssueKeys = epicIssues.map(function (epicIssue) { return epicIssue.key; });
                        epicLinkField = fields.find(function (field) { return field.name === "Epic Link"; });
                        epicLinkFieldKey = epicLinkField.key;
                        return [4 /*yield*/, api.createEpicChildrenInBulk(project.key, numberOfIssues, childIssueTypeNames, epicIssueKeys, projectStyle, epicLinkFieldKey)];
                    case 1:
                        childIssues = _a.sent();
                        return [2 /*return*/, childIssues];
                }
            });
        });
    },
    generateSubtasks: function (projectKey, noOfIssues, subtaskFieldName, parentIssues) {
        return __awaiter(this, void 0, void 0, function () {
            var parentIssueKeys, childIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parentIssueKeys = parentIssues.map(function (parentIssue) { return parentIssue.key; });
                        return [4 /*yield*/, api.createSubtasksInBulk(projectKey, noOfIssues, subtaskFieldName, parentIssueKeys)];
                    case 1:
                        childIssues = _a.sent();
                        return [2 /*return*/, childIssues];
                }
            });
        });
    },
    generateIssues: function (projects, noOfIssues) {
        return __awaiter(this, void 0, void 0, function () {
            var issues, i, fullProject, issueTypeNames, projectStyle, parentIssueTypeNames, fields, noOfParents, parentIssues, noOfEpics, epicIssues, childIssueTypeNames, childIssues, subtaskIssueTypeName, subtasks, otherIssueTypeNames, otherIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("in gen issues");
                        console.log(projects);
                        issues = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < projects.length)) return [3 /*break*/, 10];
                        console.log("PROJECT!!!!!!!!!!!!!!!!!!!!!");
                        return [4 /*yield*/, api.getFullProject(projects[i])];
                    case 2:
                        fullProject = _a.sent();
                        console.log(fullProject.style);
                        issueTypeNames = fullProject.issueTypes.map(function (issueType) { return issueType.name; });
                        projectStyle = fullProject.style;
                        parentIssueTypeNames = issueTypeNames.filter(function (type) { return !type.includes("Sub") && !(type === "Epic"); });
                        return [4 /*yield*/, api.getFields()];
                    case 3:
                        fields = _a.sent();
                        // creating parents
                        console.log("creating parent issues");
                        noOfParents = Util.getRandomPositiveNumber(parentIssueNumberRNG, 
                        // noOfIssues
                        5);
                        return [4 /*yield*/, api.createIssuesInBulk(projects[i], noOfParents, parentIssueTypeNames)];
                    case 4:
                        parentIssues = _a.sent();
                        console.log("PARENT ISSSUES");
                        console.log(parentIssues);
                        if (parentIssues.length > 0) {
                            issues = issues.concat(parentIssues);
                        }
                        // // adding epic issues
                        console.log("creating epic issues");
                        noOfEpics = Util.getRandomPositiveNumber(epicIssueNumberRNG, 
                        // noOfIssues
                        5);
                        return [4 /*yield*/, module.generateEpics(projects[i], noOfEpics, "my-epic", "Epic", projectStyle, fields)];
                    case 5:
                        epicIssues = _a.sent();
                        if (epicIssues.length > 0) {
                            issues = issues.concat(epicIssues);
                        }
                        // add child issues for epics
                        console.log("creating chil issues fro epics");
                        childIssueTypeNames = issueTypeNames.filter(function (type) { return !type.includes("Sub") && !(type === "Epic"); });
                        return [4 /*yield*/, module.generateChildIssues(projects[i], noOfIssues, childIssueTypeNames, epicIssues, projectStyle, fields)];
                    case 6:
                        childIssues = _a.sent();
                        if (childIssues.length > 0) {
                            issues = issues.concat(childIssues);
                        }
                        // add subtasks to parents
                        console.log("creating subtask issues");
                        subtaskIssueTypeName = issueTypeNames.find(function (type) {
                            return type.includes("Sub");
                        });
                        parentIssues = parentIssues.concat(childIssues);
                        return [4 /*yield*/, module.generateSubtasks(projects[i].key, noOfIssues, subtaskIssueTypeName, parentIssues)];
                    case 7:
                        subtasks = _a.sent();
                        if (subtasks.length > 0) {
                            issues = issues.concat(subtasks);
                        }
                        otherIssueTypeNames = issueTypeNames.filter(function (type) { return !type.includes("Sub") && !(type === "Epic"); });
                        // other issues
                        console.log("creating other issues");
                        return [4 /*yield*/, api.createIssuesInBulk(projects[i], noOfIssues, otherIssueTypeNames)];
                    case 8:
                        otherIssues = _a.sent();
                        console.log("OTHER ISSSUES");
                        console.log(otherIssues);
                        if (otherIssues.length > 0) {
                            issues = issues.concat(otherIssues);
                        }
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 1];
                    case 10:
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
                        noOfLinks = Util.getRandomPositiveNumber(linksRNG, maxLinks + 1);
                        console.log("NO OF LINKS", noOfLinks);
                        j = 0;
                        _a.label = 3;
                    case 3:
                        if (!(j < noOfLinks)) return [3 /*break*/, 6];
                        issueIndex = Util.getRandomWholeNumber(linkFinderRNG, issues.length);
                        linkTypeIndex = Util.getRandomWholeNumber(linkTypesRNG, linkTypeNames.length);
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
                        console.log(project);
                        noOfVersions = Util.getRandomWholeNumber(versionsRNG, maxVersions);
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
var generateData = function (mockProjectsData) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, noOfIssues, issues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, module.generateProjects(mockProjectsData)];
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
void generateData(mockProjectsData_1.mockProjectsData);
