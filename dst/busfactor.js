var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import { Octokit } from "@octokit/core";
import * as fs from 'fs';
// send GraphQL query to GitHub API
// Returns response containing fork count 
function getForkCount(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new Octokit({ auth: `token ${process.env.GITHUB_TOKEN}` });
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
export function busFactorMain(owner, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield getForkCount(owner, repo);
        const data = JSON.parse(JSON.stringify(response));
        const busFactor = calculateBusFactor(data.repository.forkCount);
        fs.writeFileSync('info.tmp', busFactor.toString());
    });
}
// main function call example
// busFactorMain("node-fetch", "node-fetch")
// old driver code
// (async () => {
//     const response = await getForkCount("node-fetch", "node-fetch")
//     const data = JSON.parse(JSON.stringify(response))    
//     const busFactor = calculateBusFactor(data.repository.forkCount)
//     // console.log(busFactor)
//     fs.writeFileSync('info.tmp', busFactor.toString());
//   })()
