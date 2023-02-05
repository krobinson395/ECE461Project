
const fs = require("fs");
const {Octokit} = require("@octokit/rest");
const { request } = require("@octokit/request");

const octokit = new Octokit ({
    auth: 'insert auth here', 
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

    const total = issueLen + closedIssueLen
    //console.log(total)
    
    ////___________________________________ NOT DONE (contributor response time) __________________________________________________
    const events = await octokit.issues.listEventsForTimeline({
        owner, 
        repo,
        issue_number: 1,
    });

    let startTime; 
    let endTime;

    for (const event of events.data) {
        if(event.event == "opened"){
            startTime = new Date(event.created_at);
        }
        else if(event.event == "commented"){
            endTime = new Date(event.created_at); 
            break; 
        }
    }

    if(!startTime || !endTime ){
        return -1;
    }

    const diffTime = endTime.getTime() - startTime.getTime(); 
    console.log(diffTime / 1000 / 60); 
 //______________________________________________________________________________________
};


//parameter 1 = repo, parameter 2 = owner 
resp(process.argv[2], process.argv[3]); //license 
issues(process.argv[2], process.argv[3]); //responsiveness calculation
