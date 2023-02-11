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

        var licenseName = ['bsd-2-clause License', 'wtfpl License', 'Zlib License', 'Unlicense', 'ncsa License'
        , 'MIT License', 'ISC License', 'LGPL-3.0 License', 'LGPL-2.1 License', 'GPL-2.0 License', 'postgresql License']; 

        if (licenseName.includes(repository.license.name)){
            fs.appendFileSync('info.tmp', '1.0');
            //console.log(repository.license.name);
        }
        else{
            fs.appendFileSync('info.tmp', '0.0'); 
        }

    }
    catch (error) {
        console.error(error)
        return error; 
    }
};

//responsiveness calculation
async function responsiveness(owner: string, repo: string) {
    //query for the total issues 
    const issues = await octokit.issues.listForRepo({
        owner, 
        repo, 
        state: 'all'
    });

    
    //query for the closed issues
    const closedissues = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'closed'
    });

    //error checking
    if (!issues.data.length) {
        throw new Error("No data in API response");
      } 

    if (!closedissues.data.length) {
        throw new Error("No data in API response");
    } 

    //calcuate the ratio of closed issues/ total issues for the formula
    const issueLen = issues.data.length; //num of total issues
    const closedIssueLen = closedissues.data.length; //num of closed issues
    const total = closedIssueLen/issueLen; //ratio calculation

    //query for the commits 
    const { data: commit } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1
    });
    //date of last commit
    const commitDate = commit[0].commit.committer.date;
  
    //calculation to find number of days since last commit
    const currentDate = new Date();

    const dateParts = commitDate.split("-");
    const dateObject = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
    )

    const timeDifference = currentDate.getTime() - dateObject.getTime();
    const differenceInDays = Math.round(timeDifference / (1000 * 3600 * 24));

    //plugging values into the formula 
    const num2 = 20 / differenceInDays; //(20/t)
    const final = Math.tanh(total * num2);

    fs.appendFileSync('info.tmp', '\n');
    fs.appendFileSync('info.tmp', final.toString());
    fs.appendFileSync('info.tmp', '\n'); 
}
  
export async function liceMain(owner: string, repo: string){
    //parameter 1 = repo, parameter 2 = owner
    license(owner, repo); //license 
    responsiveness(owner, repo); //responsiveness calculation
};

liceMain(process.argv[2], process.argv[3]);