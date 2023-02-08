import * as dotenv from 'dotenv'
dotenv.config() 
import { Octokit } from "@octokit/core"
import * as fs from 'fs';

/**
 * Call busfactor.js file as node busfactor.js "owner_name" "repo_name"
 */


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
// const busFactor = 0;

(async () => {

    const owner = process.argv[2]
    const repo = process.argv[3]

    const response = await getForkCount(owner, repo)
    const data = JSON.parse(JSON.stringify(response))    
    const busFactor = calculateBusFactor(data.repository.forkCount)
    // console.log(busFactor)

    fs.appendFileSync('info.tmp', busFactor.toString());

    // fs.writeFileSync('info.tmp', busFactor.toString());

  })()





// old main function
// export async function busFactorMain(owner: string, repo: string)
// {
//     const response = await getForkCount(owner, repo)
//     const data = JSON.parse(JSON.stringify(response))    
//     const busFactor = calculateBusFactor(data.repository.forkCount)
//     fs.writeFileSync('info.tmp', busFactor.toString());
// }
