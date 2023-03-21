import os
import csv
import math
import git
import sys
def main():
    repoDir = 'repoDir'
    
    file  = open('githubURLS.txt', 'r')
    lines = file.read().splitlines()
    for line in lines:
        clocOut = countLines(line, repoDir)
        #print('Ramp Up: ' + str(rampUp))
        correctness = calcCorrectness(clocOut)
        rampUp = calcRampUp(clocOut[0], clocOut[1], clocOut[3])
        writeToFile('info.tmp', line, str(clocOut[0]), str(clocOut[1]), str(rampUp), str(correctness))
        owner, repo = createTokens(line)   
        #Call extra js files
        #os.system('node ./src/licAndResp.js ' + owner + ' ' + repo)
        dummyCalls = open("info.tmp", "a")
        dummyCalls.write("-1\n-1\n")
        dummyCalls.close()
        os.system('node ./src/busfactor.js ' + owner + ' ' + repo)
        tempInfo = readTempFile('info.tmp')
        outputJSON = createJSONFile(tempInfo)
        print(outputJSON)

#reads the completed version of the info file (inter-system storage), calculates netScore from the information and outputs the results as a list of strings
def readTempFile(tmpFile):
    tempFile = open(tmpFile, 'r')
    tempInfo = tempFile.read().splitlines()
    netScore = float(tempInfo[3]) * 0.3 + float(tempInfo[4]) * 0.3 + float(tempInfo[7]) * 0.4
    #netScore = netScore * float(tempInfo[5]);
    tempFile.close()
    tempInfo.append(str(netScore))
    os.system("rm " + tmpFile)
    return(tempInfo)

#Tokenizes the reopURL to extract the owner and repo name to be passed to other functions in the system
def createTokens(repoURL):
    tokens = repoURL.split('/')
    owner = tokens[len(tokens) - 2]
    repo = tokens[len(tokens) - 1]

    if repo.endswith(".git"):
        repo = repo[:-4]
    return(owner,repo)

#Calculates the correctness score using the cloco data produced from countLines
def calcCorrectness(clocOut):
    diff = clocOut[1] - clocOut[3]
    diff = 1 if diff == 0 else diff
    correctness = clocOut[3] / diff * 0.6 + clocOut[3] * .001
    correctness  = 1 if correctness > 1 else correctness
    return(correctness)

#Counts the number of lines of code and returns an output in the form [numDocLines, numCodeLines, totalNumLines, numTestLines]
def countLines(repoURL, repoDir):
    deleteRepo(repoDir)
    cloneRepo(repoURL, repoDir)
    createClocFile(repoDir, 'clocOutput')
    clocOut = readClocFile('clocOutput')
    findTestDirs(repoDir)
    numTestLines = countLinesTest('testList', repoDir)
    clocOut.append(numTestLines)
    deleteRepo(repoDir)
    return(clocOut)
#Runs the installed cloc commands and creates a file containing a csv version of the data. The first line contians all code
#The second line contains specifically documentation related files
def createClocFile(repoDir, outputFile):

    clocLoc = 'cloc/cloc'
    cmd = clocLoc + ' --csv ' + repoDir + '| tail -n 1 > ' + outputFile
    os.system(cmd)
    cmd = clocLoc + ' --csv --include-lang=Markdown,Text,TeX ' + repoDir + ' | tail -n 1 >> ' + outputFile
    os.system(cmd)

#Reads the outputted cloc file and calculates numComments, numCodeLines and numTotalLines
def readClocFile(inputFile):
    numComments = 0
    numCodeLines = 0
    numTotalLines = 0
    line_count = 0
    with open(inputFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if line_count == 0:
                numComments = int(row[3])
                numCodeLines = int(row[4])
                line_count+= 1
            else:
                numComments += int(row[4])
                numCodeLines -= int(row[4])
                numTotalLines = numComments + numCodeLines
    return([numComments, numCodeLines, numTotalLines])


#Calculates the ramp up score using the following formula: tanh(3* (docLine/(codeLines - testLines)) / (log_100(codeLines - testLines)))
def calcRampUp(docLines, codeLines, testLines):
    print(testLines)
    adjLines = codeLines - testLines
    adjLines = adjLines if adjLines >= 0 else 1
    ratio = docLines/adjLines
    rampUp = math.tanh(3 * ratio / (math.log(codeLines - testLines, 100)))
    return(rampUp)
#Writes relevant data to the info file to be accessed later and by other programs
def writeToFile(fileName, gitURL, docLines, codeLines, rampUp, correctness):
    file = open(fileName, 'w')
    file.write(gitURL + "\n")
    file.write(codeLines + "\n")
    file.write(docLines+ "\n")
    file.write(rampUp + "\n")
    file.write(correctness + "\n")
    file.close()

#Uses gitPython to clone the target repo into the designated repo directory
def cloneRepo(gitURL, repoDir):
    git.Repo.clone_from(gitURL, './' + repoDir)

#Cleans the temporary repo directory
def deleteRepo(repoDir):
    os.system('rm -rf ./' + repoDir )
    #os.system('rmdir tmpRepo')

#Creates a file containing all possible test files of a given repo
def findTestDirs(repoDir):
    cmd1 = "ls " + repoDir + " | grep test > testList"
    cmd2 = "ls " + repoDir + " | grep Test >> testList"
    cmd3 = "echo \" \" >> testList"
    os.system(cmd1)
    os.system(cmd2)
    os.system(cmd3)

#Loops through the given file to count lines of test code
def countLinesTest(testFile, repoDir):
    file = open(testFile, 'r')
    testDirs = file.read().splitlines()
    for testDir in testDirs:
        fullDir = repoDir + '/' + testDir.strip()
        #print(fullDir)
        cmd = 'cloc/cloc --csv ' + fullDir + ' | tail -n 1 >> numTestLines'
        cmd2 = 'echo " " >> numTestLines'
        #print(cmd)
        if(fullDir != repoDir + '/'):
            os.system(cmd)
        os.system(cmd2)
    lineCount = 0
    with open("./numTestLines") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        for row in csv_reader:
            if(len(row) >=4):
                lineCount+= int(row[4])
    os.system("rm ./numTestLines")
    os.system("rm ./testList")
    return(lineCount);
#Uses tmpInfo created from the info.tmp file to output the NDJSON file
def createJSONFile(tmpInfo):
    jsonString = '{"URL":"' + tmpInfo[0] +'", "NET_SCORE":' + tmpInfo[8] + ', "RAMP_UP_SCORE":'+ tmpInfo[3];
    jsonString += ', "CORRECTNESS_SCORE":' + tmpInfo[4] + ', "BUS_FACTOR_SCORE":' + tmpInfo[7];
    jsonString += ', "RESPONSIVE_MAINTAINER_SCORE":' + tmpInfo[6] + ', "LICENSE_SCORE":' + tmpInfo[5] + '}\n'
    return(jsonString)

if __name__ == "__main__":
    main()
