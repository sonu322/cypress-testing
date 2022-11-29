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
var node_fetch_1 = require("node-fetch");
var util_1 = require("./util");
var mockIssueData_1 = require("./mockIssueData");
var base64 = require("base-64");
var rngIssueData = (0, util_1.getRNG)("mockissuedata");
var rngParentKey = (0, util_1.getRNG)("parent");
var LXPAPI = /** @class */ (function () {
    function LXPAPI(baseURL, username, password) {
        this.baseURL = baseURL;
        this.username = username;
        this.password = password;
    }
    // private readonly _AP: any = AP;
    LXPAPI.prototype.createIssue = function (projectKey, summary, issueTypeName) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create issueeeeeeeeeeeee");
                        bodyData = JSON.stringify({
                            fields: {
                                project: {
                                    key: projectKey
                                },
                                summary: summary,
                                issuetype: {
                                    name: issueTypeName
                                }
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issue/"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (res.ok) {
                            console.log("res ok");
                            console.log("RETURNED ISSUE DATA");
                            console.log(data);
                            console.log(res.statusText);
                            return [2 /*return*/, data];
                        }
                        else {
                            console.log("res not ok");
                            throw new Error("error fetchingissue");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log("caught error");
                        console.log(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getFullProject = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("calling full project");
                        console.log(project.self);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])(project.self, {
                                method: "GET",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json"
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(res.statusText);
                        return [2 /*return*/, data];
                    case 4:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getProjectIssueTypeNames = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("calling issue type ids");
                        console.log(project.self);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])(project.self, {
                                method: "GET",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json"
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(res.statusText);
                        return [2 /*return*/, data.issueTypes.map(function (issueType) { return issueType.name; })];
                    case 4:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getIssueLinkTypeNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("calling issue link type names");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issueLinkType/"), {
                                method: "GET",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json"
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(res.statusText);
                        console.log("links!!!!!!!!!!!!!!");
                        console.log(data);
                        return [2 /*return*/, data.issueLinkTypes.map(function (issueLinkType) { return issueLinkType.name; })];
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getFields = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/field"), {
                                method: "GET",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (res.ok) {
                            console.log("FIELDS!!!!");
                            console.log(data);
                            return [2 /*return*/, data];
                        }
                        else {
                            throw new Error("some error occurred fetching fields");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype._createIssueBodyData = function (projectKey, issueTypeName, rngIssueData, epicFieldId, parentIssueKeys, epicName) {
        console.log("CREATE BODY DATA CALLED");
        var mockIssueIndex = (0, util_1.getRandomWholeNumber)(rngIssueData, mockIssueData_1["default"].length);
        console.log("mock issue index", mockIssueIndex);
        var issueData = {
            fields: {
                summary: mockIssueData_1["default"][mockIssueIndex].summary,
                project: {
                    key: projectKey
                },
                issuetype: {
                    name: issueTypeName
                }
            }
        };
        if (issueTypeName === "Epic") {
            issueData.fields[epicFieldId] = epicName;
        }
        if (issueTypeName.includes("Sub")) {
            console.log("PARENT KEYS!!!!!!!!!!!!!!!!");
            console.log(parentIssueKeys);
            var chosenIndex = (0, util_1.getRandomWholeNumber)(rngParentKey, parentIssueKeys.length);
            var chosenParentKey = parentIssueKeys[chosenIndex];
            console.log("CHOSEN PARENT", chosenIndex, chosenParentKey);
            issueData.fields.parent = {
                key: chosenParentKey
            };
        }
        console.log("----------------------------");
        console.log(issueData);
        console.log("-------------------------------");
        return issueData;
    };
    LXPAPI.prototype._createIssueDataList = function (issueTypeNames, numberOfIssues, issueDataGenerator) {
        console.log("CREATE DATA LIST CALLED");
        console.log(numberOfIssues);
        var rng = (0, util_1.getRNG)("issuetype");
        var issues = [];
        for (var i = 0; i < numberOfIssues; i++) {
            var typeIndex1 = 0;
            if (issueTypeNames.length > 1) {
                typeIndex1 = (0, util_1.getRandomWholeNumber)(rng, issueTypeNames.length);
            }
            var typeName1 = issueTypeNames[typeIndex1];
            console.log(typeIndex1, typeName1);
            if (typeName1 === undefined) {
                throw new Error("type NAME undefined");
            }
            // const issueData = this._createIssueBodyData(
            //   project.key,
            //   typeName1,
            //   rngIssueData,
            //   epicNameFieldId,
            //   parentIssueKeys,
            //   epicName
            // );
            // issues.push(issueData);
            var issue = issueDataGenerator(typeName1, rngIssueData);
            issues.push(issue);
        }
        return issues;
    };
    LXPAPI.prototype.createIssuesInBulk = function (project, noOfIssuesPerProject, issueTypeNames) {
        return __awaiter(this, void 0, void 0, function () {
            var issueDataList, bodyData, res, data, err, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create issues");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        console.log(issueTypeNames);
                        if (issueTypeNames === undefined) {
                            throw new Error("no issue types from proje");
                        }
                        console.log("calling data list");
                        issueDataList = this._createIssueDataList(
                        // project,
                        issueTypeNames, noOfIssuesPerProject, function (issueTypeName, rngIssueData) {
                            return _this._createIssueBodyData(project.key, issueTypeName, rngIssueData);
                        });
                        if (issueDataList.length === 0) {
                            throw new Error("no data list");
                        }
                        console.log("------------------------------");
                        console.log(issueDataList);
                        console.log("------------------------------");
                        bodyData = JSON.stringify({
                            issueUpdates: issueDataList
                        });
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issue/bulk"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (!res.ok) return [3 /*break*/, 4];
                        console.log("res ok");
                        console.log(data);
                        console.log(res.statusText);
                        return [2 /*return*/, data.issues];
                    case 4:
                        console.log("res not ok");
                        return [4 /*yield*/, data];
                    case 5:
                        err = _a.sent();
                        throw new Error(err.message);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_6 = _a.sent();
                        console.log("caught error");
                        console.log(error_6);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype._createClassicEpicBodyData = function (projectKey, issueTypeName, rngIssueData, epicNameFieldKey, epicName) {
        console.log("CREATE CLASSIC EPIC BODY DATA CALLED");
        var mockIssueIndex = (0, util_1.getRandomWholeNumber)(rngIssueData, mockIssueData_1["default"].length);
        console.log("mock issue index", mockIssueIndex);
        var issueData = {
            fields: {
                summary: mockIssueData_1["default"][mockIssueIndex].summary,
                project: {
                    key: projectKey
                },
                issuetype: {
                    name: issueTypeName
                }
            }
        };
        console.log("EPIC NAME FIELD KEY", epicNameFieldKey);
        issueData.fields[epicNameFieldKey] = epicName;
        console.log("----------------------------");
        console.log(issueData);
        console.log("-------------------------------");
        return issueData;
    };
    LXPAPI.prototype._createNextGenEpicBodyData = function (projectKey, issueTypeName, rngIssueData) {
        console.log("CREATE CLASSIC EPIC BODY DATA CALLED");
        var mockIssueIndex = (0, util_1.getRandomWholeNumber)(rngIssueData, mockIssueData_1["default"].length);
        console.log("mock issue index", mockIssueIndex);
        var issueData = {
            fields: {
                summary: mockIssueData_1["default"][mockIssueIndex].summary,
                project: {
                    key: projectKey
                },
                issuetype: {
                    name: issueTypeName
                }
            }
        };
        console.log("----------------------------");
        console.log(issueData);
        console.log("-------------------------------");
        return issueData;
    };
    LXPAPI.prototype.createEpicIssuesInBulk = function (projectKey, numberOfIssues, epicIssueTypeName, epicName, epicNameFieldKey, projectStyle) {
        return __awaiter(this, void 0, void 0, function () {
            var issueDataList, bodyData, res, data, err, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("-------------------------------------");
                        console.log("called create epic issues");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        issueDataList = this._createIssueDataList([epicIssueTypeName], numberOfIssues, function (epicIssueTypeName, rngIssueData) {
                            if (projectStyle === "classic") {
                                return _this._createClassicEpicBodyData(projectKey, epicIssueTypeName, rngIssueData, epicNameFieldKey, epicName);
                            }
                            else {
                                return _this._createNextGenEpicBodyData(projectKey, epicIssueTypeName, rngIssueData);
                            }
                        });
                        bodyData = JSON.stringify({
                            issueUpdates: issueDataList
                        });
                        console.log("FINALBODYDATA");
                        console.log(bodyData);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issue/bulk"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (!res.ok) return [3 /*break*/, 4];
                        console.log("epic res ok");
                        console.log(data);
                        console.log(res.statusText);
                        return [2 /*return*/, data.issues];
                    case 4:
                        console.log("epic res not ok");
                        return [4 /*yield*/, data];
                    case 5:
                        err = _a.sent();
                        throw new Error(err.message);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        console.log("caught error");
                        console.log(error_7);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype._createSubtaskBodyData = function (projectKey, issueTypeName, rngIssueData, parentIssueKeys) {
        console.log("CREATE BODY DATA CALLED");
        var mockIssueIndex = (0, util_1.getRandomWholeNumber)(rngIssueData, mockIssueData_1["default"].length);
        console.log("mock issue index", mockIssueIndex);
        var issueData = {
            fields: {
                summary: mockIssueData_1["default"][mockIssueIndex].summary,
                project: {
                    key: projectKey
                },
                issuetype: {
                    name: issueTypeName
                }
            }
        };
        console.log("PARENT KEYS!!!!!!!!!!!!!!!!");
        console.log(parentIssueKeys);
        var chosenIndex = (0, util_1.getRandomWholeNumber)(rngParentKey, parentIssueKeys.length);
        var chosenParentKey = parentIssueKeys[chosenIndex];
        console.log("CHOSEN PARENT", chosenIndex, chosenParentKey);
        issueData.fields.parent = {
            key: chosenParentKey
        };
        console.log("----------------------------");
        console.log(issueData);
        console.log("-------------------------------");
        return issueData;
    };
    LXPAPI.prototype.createSubtasksInBulk = function (projectKey, noOfIssues, subtaskFieldName, parentIssueKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var issueDataList, bodyData, res, data, err, error_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("-------------------------------------");
                        console.log("called create subtask issues");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        issueDataList = this._createIssueDataList(
                        // project,
                        [subtaskFieldName], noOfIssues, 
                        // parentIssueKeys
                        function (subtaskFieldName, rngIssueData) {
                            return _this._createSubtaskBodyData(projectKey, subtaskFieldName, rngIssueData, parentIssueKeys);
                        });
                        bodyData = JSON.stringify({
                            issueUpdates: issueDataList
                        });
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issue/bulk"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (!res.ok) return [3 /*break*/, 4];
                        console.log("subtask res ok");
                        console.log(data);
                        console.log(res.statusText);
                        return [2 /*return*/, data.issues];
                    case 4:
                        console.log("res not ok");
                        return [4 /*yield*/, data];
                    case 5:
                        err = _a.sent();
                        throw new Error(err.message);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_8 = _a.sent();
                        console.log("caught error");
                        console.log(error_8);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // async createEpicChildrenInBulk(
    //   project,
    //   noOfIssues,
    //   childIssueTypeNames,
    //   epicIssueKeys,
    //   projectStyle,
    //   epicLinkFieldKey
    // ): Promise<any[]> {
    //   console.log("-------------------------------------");
    //   console.log("called create epic children issues");
    //   try {
    //     let issueDataList = [];
    //     if (projectStyle === "classic") {
    //       issueDataList = this._createIssueDataList(
    //         project,
    //         childIssueTypeNames,
    //         noOfIssues,
    //         undefined,
    //         undefined,
    //         undefined,
    //         epicIssueKeys,
    //         epicLinkFieldKey
    //       );
    //     } else {
    //       issueDataList = this._createIssueDataList(
    //         project,
    //         childIssueTypeNames,
    //         noOfIssues,
    //         epicIssueKeys
    //       );
    //     }
    //     const bodyData = JSON.stringify({
    //       issueUpdates: issueDataList,
    //     });
    //     const res = await fetch(`${this.baseURL}/rest/api/3/issue/bulk`, {
    //       method: "POST",
    //       headers: {
    //         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    //         Authorization: `Basic ${base64.encode(
    //           `${this.username}:${this.password}`
    //         )}`,
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //       body: bodyData,
    //     });
    //     console.log(res);
    //     const data = await res.json();
    //     if (res.ok) {
    //       console.log("subtask res ok");
    //       console.log(data);
    //       console.log(res.statusText);
    //       return data.issues;
    //     } else {
    //       console.log("res not ok");
    //       const err = await data;
    //       throw new Error(err.message);
    //     }
    //   } catch (error) {
    //     console.log("caught error");
    //     console.log(error);
    //   }
    // }
    LXPAPI.prototype.getMyself = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/myself"), {
                                method: "GET",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json"
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_9 = _a.sent();
                        console.log(error_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.createProject = function (description, leadAccountId, projectTemplateKey, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, data, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bodyData = JSON.stringify({
                            description: description,
                            leadAccountId: leadAccountId,
                            projectTemplateKey: projectTemplateKey,
                            name: name,
                            key: key
                        });
                        console.log("CALLED CREATE PROJECCT");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/project"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(data);
                        console.log(res.statusText);
                        return [2 /*return*/, data];
                    case 4:
                        error_10 = _a.sent();
                        console.log("error from create project");
                        console.log(error_10);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.createVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("Method not implemented");
            });
        });
    };
    LXPAPI.prototype.createLink = function (outwardIssueKey, inwardIssueKey, linkTypeName) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create link", linkTypeName);
                        console.log("outward", outwardIssueKey);
                        console.log("inward", inwardIssueKey);
                        bodyData = JSON.stringify({
                            outwardIssue: {
                                key: outwardIssueKey
                            },
                            inwardIssue: {
                                key: inwardIssueKey
                            },
                            type: {
                                name: linkTypeName
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.baseURL, "/rest/api/3/issueLink/"), {
                                method: "POST",
                                headers: {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    Authorization: "Basic ".concat(base64.encode("".concat(this.username, ":").concat(this.password))),
                                    "Content-Type": "application/json",
                                    Accept: "application/json"
                                },
                                body: bodyData
                            })];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        // NOTE: returns invalid json. res.json() gives error
                        // console.log(await res.json());
                        if (res.ok) {
                            console.log("res ok");
                            console.log(res.statusText);
                        }
                        else {
                            console.log("res not ok");
                            throw new Error("error fetchingissue");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        console.log("caught error");
                        console.log(error_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LXPAPI;
}());
exports["default"] = LXPAPI;
