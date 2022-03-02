"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = require("@octokit/rest");
var request_error_1 = require("@octokit/request-error");
var delay_1 = __importDefault(require("delay"));
var semver_1 = __importDefault(require("semver"));
var constants_1 = require("./constants");
var utils = __importStar(require("./utils"));
exports.default = (function (pluginConfig, context) { return __awaiter(void 0, void 0, void 0, function () {
    var oldPkgVer, newPkgVer, releaseType;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                oldPkgVer = (_a = context.lastRelease) === null || _a === void 0 ? void 0 : _a.version;
                newPkgVer = utils.readPackageVersion(context);
                if (oldPkgVer != null && newPkgVer != null) {
                    releaseType = semver_1.default.diff(oldPkgVer, newPkgVer);
                    if (releaseType != null) {
                        context.logger.log("Detected release type '" + releaseType + "' from package.json version field");
                        return [2 /*return*/, releaseType];
                    }
                }
                return [4 /*yield*/, getPrReleaseType(context)];
            case 1:
                releaseType = _b.sent();
                if (releaseType != null) {
                    return [2 /*return*/, releaseType];
                }
                return [2 /*return*/, "prepatch"]; // Default to prepatch instead of null so semantic-release always tries to publish
        }
    });
}); });
function getPrReleaseType(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var octokit, repo, prs, prNumber, labels, events, collaborators, releaseLabels, approvedLabelEvents, timeoutInMinutes, _i, _b, name_1, oldVersion, comment, startTime, timeoutInMsec, lastEtag, response, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    octokit = new rest_1.Octokit({
                        auth: context.env.GH_TOKEN || context.env.GITHUB_TOKEN
                    });
                    repo = utils.gitRepoFromUrl(context);
                    return [4 /*yield*/, octokit.repos.listPullRequestsAssociatedWithCommit(__assign(__assign({}, repo), { commit_sha: context.envCi.commit }))];
                case 1:
                    prs = _c.sent();
                    if (prs.data.length === 0) {
                        context.logger.log("Could not find pull request associated with commit " + context.envCi.commit);
                        return [2 /*return*/, null];
                    }
                    prNumber = prs.data[0].number;
                    return [4 /*yield*/, octokit.issues.listLabelsOnIssue(__assign(__assign({}, repo), { issue_number: prNumber }))];
                case 2:
                    labels = _c.sent();
                    if (labels.data.findIndex(function (label) { return label.name === "released"; }) !== -1) {
                        context.logger.log("Pull request already released, no new version detected");
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, octokit.issues.listEvents(__assign(__assign({}, repo), { issue_number: prNumber }))];
                case 3:
                    events = _c.sent();
                    return [4 /*yield*/, octokit.repos.listCollaborators(repo)];
                case 4:
                    collaborators = _c.sent();
                    releaseLabels = constants_1.Constants.PR_RELEASE_LABELS;
                    approvedLabelEvents = findApprovedLabelEvents(events.data, collaborators.data, releaseLabels);
                    if (!(approvedLabelEvents.length !== 1 && !((_a = context.options) === null || _a === void 0 ? void 0 : _a.dryRun))) return [3 /*break*/, 18];
                    timeoutInMinutes = 30;
                    _i = 0, _b = labels.data.filter(function (label) { return releaseLabels.includes(label.name); });
                    _c.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    name_1 = _b[_i].name;
                    return [4 /*yield*/, octokit.issues.removeLabel(__assign(__assign({}, repo), { issue_number: prNumber, name: name_1 }))];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    oldVersion = context.lastRelease.version;
                    return [4 /*yield*/, octokit.issues.createComment(__assign(__assign({}, repo), { issue_number: prNumber, body: "Version info from a repo admin is required to publish a new version. " +
                                ("Please add one of the following labels within " + timeoutInMinutes + " minutes:\n") +
                                ("* **" + releaseLabels[0] + "**: `" + oldVersion + "` (default)\n") +
                                ("* **" + releaseLabels[1] + "**: `" + semver_1.default.inc(oldVersion, "patch") + "`\n") +
                                ("* **" + releaseLabels[2] + "**: `" + semver_1.default.inc(oldVersion, "minor") + "`\n") +
                                ("* **" + releaseLabels[3] + "**: `" + semver_1.default.inc(oldVersion, "major") + "`\n\n") +
                                "<sub>Powered by Octorelease :rocket:</sub>" }))];
                case 9:
                    comment = _c.sent();
                    // Wait for release label to be added to PR
                    context.logger.log("Waiting for repo admin to add release label to pull request...");
                    startTime = new Date().getTime();
                    timeoutInMsec = timeoutInMinutes * 60000;
                    lastEtag = events.headers.etag;
                    _c.label = 10;
                case 10:
                    if (!(approvedLabelEvents.length !== 1 && (new Date().getTime() - startTime) < timeoutInMsec)) return [3 /*break*/, 16];
                    return [4 /*yield*/, delay_1.default(1000)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    _c.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, octokit.issues.listEvents(__assign(__assign({}, repo), { issue_number: prNumber, headers: { "if-none-match": lastEtag } }))];
                case 13:
                    response = _c.sent();
                    approvedLabelEvents = findApprovedLabelEvents(response.data, collaborators.data, releaseLabels);
                    lastEtag = response.headers.etag;
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _c.sent();
                    if (!(error_1 instanceof request_error_1.RequestError && error_1.status === 304)) {
                        throw error_1;
                    }
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 10];
                case 16:
                    if (approvedLabelEvents.length === 1) {
                        context.logger.log("Release label \"" + approvedLabelEvents[0].label.name + "\" was added by " +
                            approvedLabelEvents[0].actor.login);
                    }
                    else {
                        context.logger.log("Timed out waiting for release label");
                    }
                    // Delete comment since it is no longer useful
                    return [4 /*yield*/, octokit.issues.deleteComment(__assign(__assign({}, repo), { comment_id: comment.data.id }))];
                case 17:
                    // Delete comment since it is no longer useful
                    _c.sent();
                    _c.label = 18;
                case 18:
                    if (approvedLabelEvents.length === 1) {
                        return [2 /*return*/, [null, "patch", "minor", "major"][releaseLabels.indexOf(approvedLabelEvents[0].label.name)]];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function findApprovedLabelEvents(events, collaborators, releaseLabels) {
    /**
     * Filter to remove the following:
     *  - Other kinds of events besides label creation
     *  - Labels that were added before the PR was merged
     *  - Labels that were temporarily added and later removed
     *  - Labels that were added by user without admin privileges
     *  - Non-release labels with names we don't care about
     */
    return events.filter(function (event, idx) {
        var futureEvents = events.slice(idx + 1);
        if (event.event !== "labeled") {
            return false;
        }
        else if (futureEvents.findIndex(function (e) { return e.event === "merged"; }) !== -1) {
            return false;
        }
        else if (futureEvents.findIndex(function (e) { return e.event === "unlabeled" && e.label.name === event.label.name; }) !== -1) {
            return false;
        }
        else if (collaborators.findIndex(function (user) { var _a; return user.id === event.actor.id && ((_a = user.permissions) === null || _a === void 0 ? void 0 : _a.admin); }) === -1) {
            return false;
        }
        else if (!releaseLabels.includes(event.label.name)) {
            return false;
        }
        return true;
    });
}
