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
var base64 = require("base-64");
var LXPAPI = /** @class */ (function () {
    function LXPAPI(baseURL, username, password) {
        this.baseURL = baseURL;
        this.username = username;
        this.password = password;
        // this._axios = axios.create({ baseURL: this.baseURL });
        // this.jira = new JiraApi({
        //   protocol: "https",
        //   host: baseURL,
        //   username: username,
        //   password: password,
        //   apiVersion: "3",
        //   strictSSL: true,
        // });
    }
    // private readonly _AP: any = AP;
    LXPAPI.prototype.createIssue = function (projectKey, summary, issueTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, data, err, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create issue");
                        bodyData = JSON.stringify({
                            fields: {
                                project: {
                                    key: projectKey
                                },
                                summary: summary,
                                issuetype: {
                                    id: issueTypeId
                                }
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
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
                        if (!res.ok) return [3 /*break*/, 4];
                        console.log("res ok");
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(data);
                        console.log(res.statusText);
                        return [3 /*break*/, 6];
                    case 4:
                        console.log("res not ok");
                        return [4 /*yield*/, res.json()];
                    case 5:
                        err = _a.sent();
                        throw new Error(err.message);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.log("caught error");
                        console.log(error_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getProjectIssueTypeNames = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_2;
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
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getFields = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_3;
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
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype._createBodyData = function (projectKey, issueTypeName, epicFieldId) {
        var issueData = {
            fields: {
                summary: "testing epic 2",
                project: {
                    key: projectKey
                },
                issuetype: {
                    name: issueTypeName
                }
            }
        };
        if (issueTypeName === "Epic") {
            issueData.fields[epicFieldId] = "my_epic";
        }
        console.log("----------------------------");
        console.log(issueData);
        console.log("-------------------------------");
        return issueData;
    };
    LXPAPI.prototype.createIssuesInBulk = function (project, noOfIssuesPerProject) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, epicNameField, epiNameFieldId, issueTypeNames, rng1, rng2, typeIndex1, typeIndex2, typeName1, typeName2, bodyData, res, data, err, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create issues");
                        console.log(project);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.getFields()];
                    case 2:
                        fields = _a.sent();
                        epicNameField = fields.find(function (field) { return field.name === "Epic Name"; });
                        if (epicNameField === undefined) {
                            throw new Error("epic name field is undefined.");
                        }
                        console.log("epic: ", epicNameField.id);
                        epiNameFieldId = epicNameField.id;
                        return [4 /*yield*/, this.getProjectIssueTypeNames(project)];
                    case 3:
                        issueTypeNames = _a.sent();
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        console.log(issueTypeNames);
                        if (issueTypeNames === undefined) {
                            throw new Error("no issue types from proje");
                        }
                        rng1 = (0, util_1.getRNG)("issuetype1");
                        rng2 = (0, util_1.getRNG)("asdf");
                        typeIndex1 = (0, util_1.getRandomNumber)(rng1, issueTypeNames.length);
                        typeIndex2 = (0, util_1.getRandomNumber)(rng1, issueTypeNames.length);
                        if (typeIndex1 < 0) {
                            typeIndex1 *= -1;
                        }
                        if (typeIndex2 < 0) {
                            typeIndex2 *= -1;
                        }
                        typeName1 = issueTypeNames[typeIndex1];
                        typeName2 = issueTypeNames[typeIndex2];
                        console.log(typeIndex1, typeName1);
                        console.log(typeIndex2, typeName2);
                        if (typeName1 === undefined || typeName2 === undefined) {
                            throw new Error("type id undefined");
                        }
                        bodyData = JSON.stringify({
                            issueUpdates: [
                                this._createBodyData(project.key, typeName1, epiNameFieldId),
                                this._createBodyData(project.key, typeName1, epiNameFieldId),
                            ]
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
                    case 4:
                        res = _a.sent();
                        console.log(res);
                        return [4 /*yield*/, res.json()];
                    case 5:
                        data = _a.sent();
                        if (!res.ok) return [3 /*break*/, 6];
                        console.log("res ok");
                        console.log(data);
                        console.log(res.statusText);
                        return [3 /*break*/, 8];
                    case 6:
                        console.log("res not ok");
                        return [4 /*yield*/, data];
                    case 7:
                        err = _a.sent();
                        throw new Error(err.message);
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_4 = _a.sent();
                        console.log("caught error");
                        console.log(error_4);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.getMyself = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_5;
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
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LXPAPI.prototype.createProject = function (description, leadAccountId, projectTemplateKey, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, data, error_6;
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
                        error_6 = _a.sent();
                        console.log("error from create project");
                        console.log(error_6);
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
    LXPAPI.prototype.createLink = function (issueId1, issueId2, linkTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyData, res, data, err, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("called create issue");
                        bodyData = JSON.stringify({
                            outwardIssue: {
                                key: "EX-3"
                            },
                            inwardIssue: {
                                key: "EX-4"
                            },
                            type: {
                                name: "Blocks"
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
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
                        if (!res.ok) return [3 /*break*/, 4];
                        console.log("res ok");
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log(data);
                        console.log(res.statusText);
                        return [3 /*break*/, 6];
                    case 4:
                        console.log("res not ok");
                        return [4 /*yield*/, res.json()];
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
    return LXPAPI;
}());
exports["default"] = LXPAPI;
