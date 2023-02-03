import os
import csv
import math
import git
import sys
def main():
    print(str(sys.argv[1]))
    gitURL = str(sys.argv[1])
    cloneRepo(gitURL)
    createClocFile('./tmpRepo', 'clocOutput')
    clocOut = readClocFile('clocOutput')
    #print('Comments: ' + str(clocOut[0]))
    #print('Code Lines: ' + str(clocOut[1]))
    #print('Total Lines: ' +  str(clocOut[2]))
    rampUp = calcRampUp(clocOut[0], clocOut[1])
    #print('Ramp Up: ' + str(rampUp))
    writeToFile('test.tmp', 'exampleGitHubURL', str(clocOut[0]), str(clocOut[1]), str(rampUp))
    deleteRepo()
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

def calcRampUp(docLines, codeLines):
    ratio = docLines/codeLines
    rampUp = math.tanh(1.5 * ratio / (math.log(codeLines, 100)))
    return(rampUp)

def writeToFile(fileName, gitURL, docLines, codeLines, rampUp):
    file = open(fileName, 'w')
    file.write(gitURL + "\n")
    file.write(codeLines + "\n")
    file.write(docLines+ "\n")
    file.write(rampUp)
    file.close()
def cloneRepo(gitURL):
    git.Repo.clone_from(gitURL, './tmpRepo')

def deleteRepo():
    os.system('rm -r ./tmpRepo')
    os.system('rmdir tmpRepo')

if __name__ == "__main__":
    main()
