import * as dotenv from 'dotenv'
dotenv.config() 
import { Octokit } from "@octokit/core"
import * as fs from 'fs';

/**
 * Call busfactor.js file as node busfactor.js "owner_name" "repo_name"
 */


// Send GraphQL query to GitHub API
// Returns a promise to the number of forks in a given repository
export async function getForkCount(owner: string, repo: string)
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
        const forkData = JSON.parse(JSON.stringify(response))
        const forkCount = forkData.repository.forkCount
        return forkCount
    }

    catch (error){
        if(error instanceof Error) {
        return error.message
        }

    }
    
    
}


// Send REST query to GitHub API
// Returns a promise to the most recent commit
export async function getRecentCommit(owner: string, repo: string)
{
    const octokit = new Octokit({auth: `token ${process.env.GITHUB_TOKEN}`});
    try
    {
        const commitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: owner,
            repo: repo,
            per_page: 1,
        });
        const commitData = JSON.parse(JSON.stringify(commitResponse))
        const commitDate = commitData.data[0].commit.author.date.split("T")[0]
        return commitDate;
    }
    catch(error)
    {
        if(error instanceof Error)       
            return error.message
        
    }
    
}



// Returns number of days passed since commitDate
export function calculateDays(commitDate: string)
{
    const currentDate = new Date();

    const dateParts = commitDate.split("-");
    const dateObject = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
    )

    const timeDifference = currentDate.getTime() - dateObject.getTime();
    const differenceInDays = Math.round(timeDifference / (1000 * 3600 * 24));
    return differenceInDays
    
}



// Calculates bus factor
// If forkCount is 1000+, bus factor = 1/time factor
// Else busfactor = forkCount/1000/time factor
// Time factor = years passed since most recent commit + 1
// If most recent commit is within 1 year, time factor = 1
export function calculateBusFactor(forkCount: number, daysSinceCommit: number)
{
    const timeFactor = Math.ceil(daysSinceCommit/365)
    
    if(forkCount >= 1000)
        return 1 / timeFactor
    else
        return forkCount / timeFactor / 1000
    
}


// driver code
(async () => {

    const owner = process.argv[2]
    const repo = process.argv[3]

    try
    {
        const forkCount = await getForkCount(owner, repo)
        const commitDate = await getRecentCommit(owner, repo)
        const daysSinceCommit = calculateDays(commitDate)
        const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
        fs.appendFileSync('info.tmp', busFactor.toString());
    }
    
    catch(error)
    {
        if(error instanceof Error)       
            return error.message
    }
    
  })()