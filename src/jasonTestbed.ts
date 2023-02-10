const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");
import dotenv from "dotenv"

dotenv.config()

const octokit = new Octokit ({
    auth: `token `, 
    userAgent: '461npm v1.2.3',
    baseUrl: 'https://api.github.com'
});

//license 
async function license(ownerPassIn: string , repoPassIn:string ) {
    try {
        const data = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
            owner: ownerPassIn,
            repo: repoPassIn
          })
          console.log(data)

        
    }
    catch (error) {
        console.error(error)
        return error; 
    }
};

//responsiveness calculation
async function responsiveness(owner: string, repo: string ) {
    //total issues
   
    const issues = await octokit.issues.listForRepo({
        owner, 
        repo, 
        state: 'all'
    });

    //closed issues
    const closedissues = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'closed'
    });

    if (!issues.data.length) {
        throw new Error("No data in API response");
      } 

    if (!closedissues.data.length) {
        throw new Error("No data in API response");
    } 
    const issueLen = issues.data.length;
    const closedIssueLen = closedissues.data.length; 

    const total = String(closedIssueLen/issueLen)

    fs.appendFileSync('info.tmp', '\n');
    fs.appendFileSync('info.tmp', (total).toString());
    fs.appendFileSync('info.tmp', '\n');
};

async function quickness(ownerPassIn: string , repoPassIn:string ) {
    try {
        const result = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
            owner: ownerPassIn,
            repo: repoPassIn
          })
        console.log(JSON.stringify(result.data))
        console.log(result.data)

        
    }
    catch (error) {
        console.error(error)
        return error; 
    }
};

quickness(process.argv[2], process.argv[3]);
