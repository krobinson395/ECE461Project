import json

file = open('coverage.json')
covered_lines = 0
total_lines = 0
passed = 0
total = 0
data = json.load(file)
#print(data.keys())
files = data.get('files')
fileKeys = list(files.keys())
#print(files)
curFile = files.get(fileKeys[0])
#print(curFile)
summary = curFile.get('summary')
covered_lines += summary.get('covered_lines')
total_lines += summary.get('num_statements')

mochaFile = open('../mochawesome-report/mochawesome.json')
mochaData = json.load(mochaFile)
mochaStats = mochaData.get('stats')
passed+= mochaStats.get('passes')
total+= mochaStats.get('tests')

file1 = open('nycCoverage', 'r')
line = file1.readline()
line = line.split('(')
line = line[1].split(' ')
line = line[1].split('/')
covered_lines += int(line[0])
total_lines += int(line[1])


coverage = (covered_lines / total_lines) * 100
inputFile = open('pythonResults.txt', 'r')
testData = inputFile.read().splitlines()
passed += int(testData[1]) - int(testData[0])
total += int(testData[1])


print(f'{passed}/{total} test cases passed. {coverage}% line coverage achieved.');


