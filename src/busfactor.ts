import * as dotenv from 'dotenv'
dotenv.config() 
import { Octokit } from "@octokit/core"
import * as fs from 'fs';

/**
 * Call busfactor.js file as node busfactor.js "owner_name" "repo_name"
 */


// Send GraphQL query to GitHub API
// Returns a promise to the number of forks in a given repository
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

// Send REST query to GitHub API
// Returns a promise to the most recent commit
async function getRecentCommit(owner: string, repo: string)
{
    const octokit = new Octokit({auth: `token ${process.env.GITHUB_TOKEN}`});
    try
    {
        const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: owner,
            repo: repo,
            per_page: 1,
        });
        return response;
    }
    catch(error)
    {
        if(error instanceof Error)       
            return error.message
        
    }
    
}

// Returns number of days passed since commitDate
function calculateDays(commitDate: string)
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
function calculateBusFactor(forkCount: number, daysSinceCommit: number)
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

    const forkResponse = await getForkCount(owner, repo)
    const forkData = JSON.parse(JSON.stringify(forkResponse))
    const forkCount = forkData.repository.forkCount
    
    const commitResponse = await getRecentCommit(owner, repo)
    const commitData = JSON.parse(JSON.stringify(commitResponse))
    const commitDate = commitData.data[0].commit.author.date.split("T")[0]

    const daysSinceCommit = calculateDays(commitDate)
    const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
    // console.log(busFactor)

    fs.appendFileSync('info.tmp', busFactor.toString());
  })()



// old main function
// export async function busFactorMain(owner: string, repo: string)
// {
//     const response = await getForkCount(owner, repo)
//     const data = JSON.parse(JSON.stringify(response))    
//     const busFactor = calculateBusFactor(data.repository.forkCount)
//     fs.writeFileSync('info.tmp', busFactor.toString());
// }
