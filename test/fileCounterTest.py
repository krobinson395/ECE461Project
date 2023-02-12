import sys
sys.path.insert(0, '..')
from fileCounter import *
import unittest

class TestFileCounter(unittest.TestCase):


    def testReadTempFile(self):
        tempInfo = readTempFile("testInfo.tmp")
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

    



if __name__ == '__main__':
    unittest.main()

