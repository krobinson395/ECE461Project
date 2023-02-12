import json

file = open('coverage.json')

data = json.load(file)
#print(data.keys())
files = data.get('files')
fileKeys = list(files.keys())
#print(files)
curFile = files.get(fileKeys[0])
#print(curFile)
summary = curFile.get('summary')
covered_lines = summary.get('covered_lines')
total_lines = summary.get('num_statements')


coverage = (covered_lines / total_lines) * 100

print(f'Test Coverage {coverage}%');


