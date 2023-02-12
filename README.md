# ECE461 Project NPM Package Analyzer

## Using the CLI
1. run install
* After initially downloading the repository use run install in order to download and install the required dependencies in userland. This process should ensure the correct version of all required libraries are installed and any additional packages needed have been pulled down
* If running into permission issues while attempting to execute run perform "$ chmod +x run" in order to grant the script execution privilges
2. run build
* Once installation is complete this can be ran to compiled the required typescript files for both testing and exeution of the overall program
3. run test
* This executes the required test suite which will create and output to stdout indicating the number of tests run, the number of succeses, and the total coverage for these tests
4. run filePath
* When provided with a valid path to a new line delimited list of URLS this will run the main report of the program
* Currently the program only supports URLS linking to valid GitHub repositories or URLS linking to npm packages that have a linked valid GitHub repository within them
* Upon a successful execution a number of NDJSON objects will be generated on stdout equal to the number of valid URLS within the specified file
* These NDJSON objects will contain the following data
> * GitHub URL
> * Net Score
> * Ramp Up Score
> * Correctness Score
> * Bus Factor Score
> * Responsive Maintainer Score
> * License Score


