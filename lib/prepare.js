"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var constants_1 = require("./constants");
var utils = __importStar(require("./utils"));
function updateChangelog(context, changelogFile) {
    var _a;
    if (fs.existsSync(changelogFile) && context.nextRelease != null) {
        var oldContents = fs.readFileSync(changelogFile, "utf-8");
        var searchValue = "## Recent Changes";
        var replaceValue = "## `" + context.nextRelease.version + "`";
        var newContents = oldContents.replace(searchValue, replaceValue);
        if (newContents !== oldContents) {
            if (!((_a = context.options) === null || _a === void 0 ? void 0 : _a.dryRun)) {
                fs.writeFileSync(changelogFile, newContents);
                context.logger.log("Updated version header in " + changelogFile);
            }
            else {
                context.logger.log("[skip] Replace \"" + searchValue + "\" with \"" + replaceValue + "\" in " + changelogFile);
            }
        }
    }
}
exports.default = (function (pluginConfig, context) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, location_1, changelogFile;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (context.nextRelease != null) {
                    process.env.GIT_TAG_MESSAGE = "Release " + context.nextRelease.version + " to " + context.branch.name;
                }
                if (!constants_1.Constants.USE_LERNA) return [3 /*break*/, 5];
                _i = 0;
                return [4 /*yield*/, utils.getLernaPackageInfo(context)];
            case 1:
                _a = (_b.sent()).filter(function (pkg) { return pkg.changed; });
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                location_1 = _a[_i].location;
                changelogFile = path.join(path.relative(process.cwd(), location_1), "CHANGELOG.md");
                updateChangelog(context, changelogFile);
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 2];
            case 4: return [3 /*break*/, 6];
            case 5:
                updateChangelog(context, "CHANGELOG.md");
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
