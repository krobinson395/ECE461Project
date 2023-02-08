const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");

const octokit = new Octokit ({
    auth: `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`, 
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
        //console.log(repository.license.name); 

        fs.writeFile('data.json', JSON.stringify(repository.license.name), (err) => {
            if (err) throw err;
            console.log('Data has been written to file');
        });
       
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

    // fs.writeFile('data.json', JSON.stringify(total), (err) => {
    //     if (err) throw err;
    //     console.log('Data has been written to file');
    // });


    const fileName = 'data.json';
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

    let jsonData = JSON.parse(total);
    jsonData.newKey = 'new value';


    fs.appendFile(fileName,'\n', 'utf8', (err) => {
        if (err) throw err;
        console.log('Data appended to file');
      });

    fs.appendFile(fileName, JSON.stringify(total), 'utf8', (err) => {
        if (err) throw err;
        console.log('Data appended to file');
      });
    
});

};


//parameter 1 = repo, parameter 2 = owner 
resp(process.argv[2], process.argv[3]); //license 
issues(process.argv[2], process.argv[3]); //responsiveness calculation