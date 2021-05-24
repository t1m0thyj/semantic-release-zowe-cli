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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = require("@octokit/rest");
var execa_1 = __importDefault(require("execa"));
var git_url_parse_1 = __importDefault(require("git-url-parse"));
var semver_diff_1 = __importDefault(require("semver-diff"));
var monorepo_1 = require("./monorepo");
function getGitOwnerAndRepo(context) {
    var urlParsed = git_url_parse_1.default(context.options.repositoryUrl);
    return [urlParsed.owner, urlParsed.name];
}
exports.default = (function (pluginConfig, context) { return __awaiter(void 0, void 0, void 0, function () {
    var oldPkgVer, newPkgVer, releaseType, octokit, _a, owner, repo, prs, _b, _c, labels, labelNames, releaseType;
    var _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                oldPkgVer = (_e = context.lastRelease) === null || _e === void 0 ? void 0 : _e.version;
                newPkgVer = monorepo_1.readPackageVersion(context);
                if (oldPkgVer != null && newPkgVer != null) {
                    releaseType = semver_diff_1.default(oldPkgVer, newPkgVer);
                    if (releaseType != null) {
                        context.logger.log("Detected release type '" + releaseType + "' from package.json version field");
                        return [2 /*return*/, null];
                    }
                }
                octokit = new rest_1.Octokit({
                    auth: context.env.GH_TOKEN || context.env.GITHUB_TOKEN
                });
                _a = getGitOwnerAndRepo(context), owner = _a[0], repo = _a[1];
                _c = (_b = octokit.repos).listPullRequestsAssociatedWithCommit;
                _d = {
                    owner: owner, repo: repo
                };
                return [4 /*yield*/, execa_1.default("git", ["rev-parse", "HEAD"])];
            case 1: return [4 /*yield*/, _c.apply(_b, [(_d.commit_sha = (_f.sent()).stdout,
                        _d)])];
            case 2:
                prs = _f.sent();
                if (!(prs.data.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, octokit.issues.listLabelsOnIssue({
                        owner: owner, repo: repo,
                        issue_number: prs.data[0].number
                    })];
            case 3:
                labels = _f.sent();
                labelNames = labels.data.map(function (label) { return label.name; });
                releaseType = undefined;
                if (labelNames.includes("release-major")) {
                    releaseType = "major";
                }
                else if (labelNames.includes("release-minor")) {
                    releaseType = "minor";
                }
                else if (labelNames.includes("release-patch")) {
                    releaseType = "patch";
                }
                else if (labelNames.includes("no-release")) {
                    releaseType = null;
                }
                if (releaseType !== undefined) {
                    context.logger.log("Detected release type '" + (releaseType || "none") + "' from pull request label");
                    return [2 /*return*/, releaseType];
                }
                _f.label = 4;
            case 4: return [2 /*return*/, null];
        }
    });
}); });
