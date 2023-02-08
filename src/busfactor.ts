import dotenv from 'dotenv'
dotenv.config() 
import { Octokit } from "@octokit/core"
import * as fs from 'fs';

// send GraphQL query to GitHub API
// Returns response containing fork count 
async function getForkCount(owner: string, repo: string)
{
    const octokit = new Octokit({auth: `token ${process.env.GITHUB_TOKEN}`});

    const query = 
        `{
            repository(owner: "${owner}", name: "${repo}") {
            forkCount
            }  
        }`

    try {
        const response = await octokit.graphql(query)
        return response
    }

    catch (error){
        if(error instanceof Error) {
            return error.message
        }

    }
    
    
}

// calculate bus factor
function calculateBusFactor(forkCount: number)
{
    if(forkCount >= 1000)
        return 1
    else
        return forkCount/1000
}



// driver code
export async function busFactorMain(owner: string, repo: string)
{
    const response = await getForkCount(owner, repo)
    const data = JSON.parse(JSON.stringify(response))    
    const busFactor = calculateBusFactor(data.repository.forkCount)
    fs.writeFileSync('info.tmp', busFactor.toString());
}
