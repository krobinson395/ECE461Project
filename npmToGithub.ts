import * as fs from 'fs';
import * as readline from 'readline';
let {PythonShell} = require('python-shell'); 
import dotenv from "dotenv"

dotenv.config()

const {Octokit} = require("@octokit/core");
const { request } = require("@octokit/request");

var pyFile = 'pythonScript.py'

let options = {
    pythonOptions: ['-u'], // get print results in real-time
    args: ['pythonOutput.txt']
  };


console.log("begin")

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

const resp = async(line:string) => {
    let fullLine:string = line
    let replacement = "registry"

    fullLine = fullLine.replace('www', replacement)
    fullLine = fullLine.replace('/package', emptyString)
    writeToFile(logFile, "api call: " + fullLine, "error in writing to log file")
    
    try {
        const prs = await octokit.request(fullLine, {
            owner: owner,
            repo: repo
        });
        console.log(prs.data.repository); //print repository info
        if(prs.data.repository.type == 'git'){
            let requestedURL:string = prs.data.repository.url
            var result = requestedURL.substring(requestedURL.lastIndexOf("github.com"))
            console.log(result)
            //need to make sure there is actually something there matching before writign
            writeToFile(outputFile, "https://" + result, "error in writing to log file")
            writeToFile(logFile, "Wrote npm now github link succesfully!", "error in writing to log file")
        }
        else{
            writeToFile(logFile, "No git repository found for this package. At this time this tool only suports github repositories", "error in writing to log file")
        }
                
    }
    catch (error) {
        writeToFile(logFile, "No git repository found for this package from the API call. At this time this tool only suports github repositories", "error in writing to log file")
        console.error(error)
        //return error; 
    }
};

const lineReader = readline.createInterface({
    input: fs.createReadStream(process.argv.slice(2).toString()),
    terminal: false,
});

function writeToFile(filename:string, lineToWrite:string, errorMessage:string){
    fs.appendFile(filename, lineToWrite + '\n', (err) => {
        if (err) {
          console.log(err);
        }
    });
}

//PROGRAM STARTS HERE
fs.writeFileSync(logFile, emptyString); //clear log file
fs.writeFileSync(outputFile, emptyString); //clear url file
console.log("in the middle")
lineReader.on('line', (line) => {
    if(line.includes(npmURLMatch)){
        writeToFile(logFile, "npm link identified", "error in writing to log file")
        resp(line)
    }
    else if(line.includes(githubURLMatch)){
        writeToFile(outputFile, line, "error in writing to log file")  
        writeToFile(logFile, "github link identified", "error in writing to log file")  
    }
    else {
        writeToFile(logFile, "neither link identiied, check input format. the line: " + line, "error in writing to log file")  
    }
    
});

console.log("near the end")
var pyShell = PythonShell.run(pyFile, options, function (err:any) {
    if(err) {console.log(err);}
});

console.log("end")