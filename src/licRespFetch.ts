const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");

const octokit = new Octokit ({
    auth: `token ${process.env.GITHUB_TOKEN}`, 
    userAgent: '461npm v1.2.3',
    baseUrl: 'https://api.github.com'
});

//license 
async function license(owner: string , repo:string ) {
    try {
        const {data:repository } = await octokit.repos.get({
            owner,
            repo,
          
        });

        if ((repository.license.name == "MIT License") || (repository.license.name == "GNU GPL")){
            fs.appendFileSync('info.tmp', "LGPLv2.1 Compatible");
        }
        else{
            fs.appendFileSync('info.tmp', "LGPLv2.1 Compatible"); 
        }
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

export async function liceMain(owner: string, repo: string){
    //parameter 1 = repo, parameter 2 = owner
    license(owner, repo); //license 
    responsiveness(owner, repo); //responsiveness calculation
};

liceMain(process.argv[2], process.argv[3]);