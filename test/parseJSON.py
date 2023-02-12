import json

file = open('coverage.json')

data = json.load(file)

covered_lines = data.get('summary').get('covered_lines')
total_lines = data.get('summary').get('num_statements')


coverage = covered_lines / total_lines

print(f'Test Coverage {coverage}%');


