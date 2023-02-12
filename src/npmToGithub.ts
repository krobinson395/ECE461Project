import * as fs from 'fs';
import * as readline from 'readline';
import * as dotenv from "dotenv"

dotenv.config()

const {Octokit} = require("@octokit/core");
const { request } = require("@octokit/request");

//DELTE THE AUTH TOKEN BEFORE UPLOADING TO GITHUB
const octokit = new Octokit ({
    auth: `token ${process.env.GITHUB_TOKEN}`,
    userAgent: '461npm v1.2.3',
    baseUrl: 'https://api.github.com',
});

const owner = 'npm'
const repo = 'npm'

const npmURLMatch = 'npmjs.com'
const githubURLMatch = 'github.com'

const outputFile = "githubURLS.txt"
const logFile = "logFile.txt"

const emptyString = "";

export async function testingFunction(line:string){
    return("true")
}

export async function npmCall(line:string){

    //console.log("hello\n\n\n")
    let fullLine:string = line
    let replacement = "registry"

    fullLine = fullLine.replace('www', replacement)
    fullLine = fullLine.replace('/package', emptyString)
    writeToFile(logFile, "api call: " + fullLine, "error in writing to log file")
    //console.log(fullLine)
    try {
        const prs = await octokit.request(fullLine, {
            owner: owner,
            repo: repo
        });
        //console.log(prs.data.repository); //print repository info
        if(prs != null && prs.data != null && prs.data.repository != null && prs.data.repository.type != null && prs.data.repository.url != null){
            //console.log(prs.data)
            if(prs.data.repository.type == 'git'){
                let requestedURL:string = prs.data.repository.url
                //console.log(requestedURL)
                if(requestedURL.includes(githubURLMatch)){
                    var result = requestedURL.substring(requestedURL.lastIndexOf("github.com"))
                    result = result.replace('.git', emptyString)
                    //console.log(result)
                    //need to make sure there is actually something there matching before writing
                    result = "https://" + result
                    writeToFile(outputFile, result, "error in writing to log file")
                    writeToFile(logFile, "Wrote npm now github link succesfully!: " + result, "error in writing to log file")
                    return(result)
                }
                else{
                    writeToFile(logFile, "No git repository found for this package. At this time this tool only supports npm modules hosted on github repositories", "error in writing to log file")
                    return("NoGitHubLinkFound")
                }
            }
            else{
                writeToFile(logFile, "No git repository found for this package. At this time this tool only supports npm modules hosted on github repositories", "error in writing to log file")
                return("NoGitRepoTypeFound")
            }
        }
        else{
            writeToFile(logFile, "No git repository found for this package. At this time this tool only supports npm modules hosted on github repositories", "error in writing to log file")
            return("NullData")
        }
                    
    }
    catch (error) {
        writeToFile(logFile, "No git repository found for this package. At this time this tool only supports npm modules hosted on github repositories", "error in writing to log file")
        //console.error(error)
        return("error")
    }

};

export function writeToFile(filename:string, lineToWrite:string, errorMessage:string){
    //console.log(filename + " -> " + lineToWrite)
    fs.appendFile(filename, lineToWrite + '\n', (err) => {
        if (err) {
          console.log(err);
          console.log(errorMessage);
        }
    })
    return("success")
}

export function lineMatching(line:string){
    if(line.includes(npmURLMatch)){
        writeToFile(logFile, "npm link identified: " + line, "error in writing to log file") 
        var returnValue = npmCall(line)
        return(returnValue)
    }
    else if(line.includes(githubURLMatch)){
        var result = line.substring(line.lastIndexOf("github.com"))
        result = "https://" + result
        writeToFile(logFile, "github link identified: " + result, "error in writing to log file")   
        writeToFile(outputFile,  result, "error in writing to output file")
        return(result)
    }
   else {
        writeToFile(logFile, "neither url link identiied, check input format. provided url: " + line , "error in writing to log file")  
        return("noMatch")
    } 
}


//PROGRAM STARTS HERE
export function npmToGithubDriver(urlList: string){
    if(urlList != null && urlList != ""){
        fs.writeFileSync(logFile, emptyString); //clear log file
        fs.writeFileSync(outputFile, emptyString); //clear url file

        const lineReader = readline.createInterface({
            input: fs.createReadStream(urlList),
            terminal: false,
        });

        lineReader.on('line', (line) => {
            lineMatching(line)
        });
        return("success")
    }
    else{
        return("nullInput")
    }


}

npmToGithubDriver(process.argv[2]);

