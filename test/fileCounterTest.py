import sys
sys.path.insert(0, '..')
from fileCounter import *
import unittest
import json

class TestFileCounter(unittest.TestCase):


    def testReadTempFile(self):
        tempInfo = readTempFile("testInfo.txt")
        self.assertEqual(tempInfo[0], "https://github.com/paulmillr/popular-user-agents")
        self.assertEqual(tempInfo[1], str(314))
        self.assertEqual(tempInfo[2], str(500))
        self.assertEqual(tempInfo[3], str(0.5))
        self.assertEqual(tempInfo[4], str(0.25))
        self.assertEqual(tempInfo[5], str(1))
        self.assertEqual(tempInfo[6], str(0.75))
        self.assertEqual(tempInfo[7], str(1))
        self.assertEqual(tempInfo[8], str(0.71875))

    def testCreateTokens(self):
        owner, repo = createTokens("https://github.com/paulmillr/popular-user-agents")
        self.assertEqual(owner, "paulmillr")
        self.assertEqual(repo, "popular-user-agents")

    def testCalcCorrectness(self):
        clocOut = [0, 3000, 0, 100]
        correctness = calcCorrectness(clocOut)
        self.assertEqual(round(correctness, 2), .12)

    def testCountLines(self):
        clocOut = countLines('https://github.com/vesln/package.git', 'testRepoDir')
        self.assertEqual(clocOut[0], 87)
        self.assertEqual(clocOut[1], 110)
        self.assertEqual(clocOut[2], 197)
        self.assertEqual(clocOut[3], 45)
    
    def testCalcRampUp(self):
        rampUp = calcRampUp(100,500,100)
        self.assertEqual(round(rampUp , 2), .52)

    def testCreateJSONFile(self):
        tmpInfo = ["A/gitHUB/URL", '.1', '.2' , '.3' , '.4', '.5', '.6', '.7', '.8']
        createdString = createJSONFile(tmpInfo)
        testString = '{"URL":"A/gitHUB/URL", "NET_SCORE":.8, "RAMP_UP_SCORE":.3, "CORRECTNESS_SCORE":.4, "BUS_FACTOR_SCORE":.7, "RESPONSIVE_MAINTAINER_SCORE":.6, "LICENSE_SCORE":.5}\n'
        print(testString)
        print(createdString)
        self.assertEqual(createdString, testString)

def warp_test_suite(testcase_class):
    suite = unittest.TestSuite()
    tests = unittest.defaultTestLoader.loadTestsFromTestCase(testcase_class)
    suite.addTest(tests)
    return(suite)
        

if __name__ == '__main__':
    result_value = {"Failures": 0, "Ran" : 0}
    runner = unittest.TextTestRunner()
    TextTestResult = runner.run(warp_test_suite(TestFileCounter))

    result_value["Failures"] += len(TextTestResult.failures)
    result_value["Failures"] += len(TextTestResult.errors)
    result_value["Failures"] += len(TextTestResult.skipped)
    result_value["Ran"] += TextTestResult.testsRun
    outputFile = open('pythonResults.txt', 'w')
    outputFile.write(str(result_value["Failures"] ) + "\n")
    outputFile.write(str(result_value["Ran"]))

