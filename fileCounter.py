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
        gitURL = line
        cloneRepo(gitURL, repoDir)
        createClocFile(repoDir, 'clocOutput')
        clocOut = readClocFile('clocOutput')
        findTestDirs(repoDir)
        numTestLines = countLinesTest('testList', repoDir)
        correctness = numTestLines / (clocOut[1] - numTestLines) * 0.6 + numTestLines * .001
        correctness  = 1 if correctness > 1 else correctness
        #print('Ramp Up: ' + str(rampUp))
        rampUp = calcRampUp(clocOut[0], clocOut[1], numTestLines)
        writeToFile('info.tmp', gitURL, str(clocOut[0]), str(clocOut[1]), str(rampUp), str(correctness))
        deleteRepo(repoDir)
        tokens = line.split('/')
        owner = tokens[len(tokens) - 2]
        repo = tokens[len(tokens) - 1]

        if repo.endswith(".git"):
            repo = repo[:-4]
    
        #Call extra js files
        os.system('node ./src/licAndResp.js ' + owner + ' ' + repo)
        os.system('node ./src/busfactor.js ' + owner + ' ' + repo)
        tempFile = open('info.tmp', 'r')
        tempInfo = tempFile.read().splitlines()
        #print(tempInfo)
        netScore = float(tempInfo[3]) * 0.175 + float(tempInfo[4]) * 0.175 + float(tempInfo[6]) * 0.25 + float(tempInfo[7]) * 0.4
        netScore = netScore * float(tempInfo[5]);
        tempFile.close()
        createJSONFile(tempInfo, netScore)
        #print("PRINTNG NET SCORE")
        #print(str(netScore))
        #tempInfo = open('info.tmp', 'a')
        #tempInfo.write('\n' + str(netScore))
        #tempInfo.close()
        #TESTING
        #os.system('cat info.tmp')
        #os.system('echo \n')
        os.system('rm info.tmp')
def createClocFile(repoDir, outputFile):

    clocLoc = 'cloc/cloc'
    cmd = clocLoc + ' --csv ' + repoDir + '| tail -n 1 > ' + outputFile
    os.system(cmd)
    cmd = clocLoc + ' --csv --include-lang=Markdown,Text,TeX ' + repoDir + ' | tail -n 1 >> ' + outputFile
    os.system(cmd)

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

def calcRampUp(docLines, codeLines, testLines):
    ratio = docLines/(codeLines - testLines)
    rampUp = math.tanh(3 * ratio / (math.log(codeLines - testLines, 100)))
    return(rampUp)

def writeToFile(fileName, gitURL, docLines, codeLines, rampUp, correctness):
    file = open(fileName, 'w')
    file.write(gitURL + "\n")
    file.write(codeLines + "\n")
    file.write(docLines+ "\n")
    file.write(rampUp + "\n")
    file.write(correctness + "\n")
    file.close()
def cloneRepo(gitURL, repoDir):
    git.Repo.clone_from(gitURL, './' + repoDir)

def deleteRepo(repoDir):
    os.system('rm -rf ./' + repoDir )
    #os.system('rmdir tmpRepo')

def findTestDirs(repoDir):
    cmd1 = "ls " + repoDir + " | grep test > testList"
    cmd2 = "ls " + repoDir + " | grep Test >> testList"
    os.system(cmd1)
    os.system(cmd2)
def countLinesTest(testFile, repoDir):
    file = open(testFile, 'r')
    testDirs = file.read().splitlines()
    for testDir in testDirs:
        fullDir = repoDir + '/' + testDir
        #print(fullDir)
        cmd = 'cloc/cloc --csv ' + fullDir + ' | tail -n 1 >> numTestLines'
        #print(cmd)
        os.system(cmd)
    lineCount = 0
    with open("./numTestLines") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        for row in csv_reader:
            lineCount+= int(row[4])
    os.system("rm ./numTestLines")
    os.system("rm ./testList")
    return(lineCount);
def createJSONFile(tmpInfo, netScore):
    jsonString = '{"URL":"' + tmpInfo[0] +', "NET_SCORE":' + str(netScore) + ', "RAMP_UP_SCORE":'+ tmpInfo[3];
    jsonString += ', "CORRECTNESS_SCORE":' + tmpInfo[4] + ', "BUS_FACTOR_SCORE":' + tmpInfo[7];
    jsonString += ', "RESPONSIVE_MAINTAINER_SCORE":' + tmpInfo[6] + ', "LICENSE_SCORE":' + tmpInfo[5] + '}\n'
    print(jsonString)

if __name__ == "__main__":
    main()
