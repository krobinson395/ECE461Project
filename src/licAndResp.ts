
const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");

const octokit = new Octokit ({
    auth: `token ${process.env.GITHUB_TOKEN}`, 
    userAgent: '461npm v1.2.3',
    baseUrl: 'https://api.github.com'
});

//license 
export async function license(owner: string , repo:string ) {
    try {
        const {data:repository } = await octokit.repos.get({
            owner,
            repo,
          
        });

        var licenseName = ['BSD 2-Clause "Simplified" License', 'Do What The F*ck You Want To Public License', 'zlib License', 'The Unlicense', 'ncsa License'
        , 'MIT License', 'ISC License', 'GNU Lesser General Public License v3.0', 'GNU Lesser General Public License v2.1', 'GNU General Public License v2.0', 'PostgreSQL License']; 


        if (repository.license != null && licenseName.includes(repository.license.name)){
            fs.appendFileSync('info.tmp', '1.0');
            return ('1.0')
            //console.log(repository.license.name);
        }
        else{
            fs.appendFileSync('info.tmp', '0.0'); 
            return ('0.0')
        }

    }
    catch (error) {
        fs.appendFileSync('info.tmp', '0.0'); 
        console.error(error)
        return error; 
    }
};

//responsiveness calculation
export async function responsiveness(owner: string, repo: string) {
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

    //calcuate the ratio of closed issues/ total issues for the formula
    const issueLen = issues.data.length; //num of total issues
    const closedIssueLen = closedissues.data.length; //num of closed issues
    var total = closedIssueLen/issueLen; //ratio calculation

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

    if ((!(issues.data.length) || !(closedissues.data.length))){
         total = 1;

         const num2 = 20 / differenceInDays; //(20/t)
         const final = Math.tanh(total * num2);
     
         fs.appendFileSync('info.tmp', '\n');
         fs.appendFileSync('info.tmp', final.toString());
         fs.appendFileSync('info.tmp', '\n');  
         return (final.toString())
    }

    else {
    //plugging values into the formula 
    const num2 = 20 / differenceInDays; //(20/t)
    const final = Math.tanh(total * num2);

    fs.appendFileSync('info.tmp', '\n');
    fs.appendFileSync('info.tmp', final.toString());
    fs.appendFileSync('info.tmp', '\n'); 
    return (final.toString())
    }
}
  
export async function liceMain(owner: string, repo: string){
    //parameter 1 = repo, parameter 2 = owner
    license(owner, repo); //license 
    responsiveness(owner, repo); //responsiveness calculation
};

liceMain(process.argv[2], process.argv[3]);