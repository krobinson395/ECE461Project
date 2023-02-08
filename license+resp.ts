const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");
const {dotenv} = require("dotenv"); 

dotenv.config();

const octokit = new Octokit ({
    auth: `token ${process.env.GITHUB_TOKEN}`, 
    userAgent: '461npm v1.2.3',
    baseUrl: 'https://api.github.com'
});

//license 
const resp = async(owner, repo) => {
    try {
        const {data:repository } = await octokit.repos.get({
            owner,
            repo,
          
        });

        if ((repository.license.name == "MIT License") || (repository.license.name == "GNU GPL")){
            fs.appendFile('info.tmp', "LGPLv2.1 Compatible");
        }
    }
    catch (error) {
        console.error(error)
        return error; 
    }
};

//responsiveness calculation
const issues = async(owner, repo) =>{
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

    const fileName = 'info.tmp';
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

    let jsonData = JSON.parse(total);
    jsonData.newKey = 'new value';

    fs.appendFile(fileName, '\n', 'utf8', (err) => {
        if (err) throw err;
        console.log('Data appended to file');
      });

    fs.appendFile(fileName, total, 'utf8', (err) => {
        if (err) throw err;
        console.log('Data appended to file');
      });
    
});
};

export async function liceMain (){
    resp(process.argv[1], process.argv[2]); //license 
    issues(process.argv[1], process.argv[2]); //responsiveness calculation
}

