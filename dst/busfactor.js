"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.busFactorMain = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const core_1 = require("@octokit/core");
const fs = __importStar(require("fs"));
// send GraphQL query to GitHub API
// Returns response containing fork count 
function getForkCount(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new core_1.Octokit({ auth: `token ${process.env.GITHUB_TOKEN}` });
        const query = `{
            repository(owner: "${owner}", name: "${repo}") {
            forkCount
            }  
        }`;
        try {
            const response = yield octokit.graphql(query);
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
        }
    });
}
// calculate bus factor
function calculateBusFactor(forkCount) {
    if (forkCount >= 1000)
        return 1;
    else
        return forkCount / 1000;
}
function busFactorMain(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield getForkCount(owner, repo);
        const data = JSON.parse(JSON.stringify(response));
        const busFactor = calculateBusFactor(data.repository.forkCount);
        fs.writeFileSync('info.tmp', busFactor.toString());
    });
}
exports.busFactorMain = busFactorMain;
// main function call example
busFactorMain("node-fetch", "node-fetch");
// old driver code
// (async () => {
//     const response = await getForkCount("node-fetch", "node-fetch")
//     const data = JSON.parse(JSON.stringify(response))    
//     const busFactor = calculateBusFactor(data.repository.forkCount)
//     // console.log(busFactor)
//     fs.writeFileSync('info.tmp', busFactor.toString());
//   })()
