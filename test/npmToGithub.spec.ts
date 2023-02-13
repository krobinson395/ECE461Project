import { assert } from 'chai'
import {lineMatching, writeToFile, npmCall, npmToGithubDriver, testingFunction} from '../src/npmToGithub'
//import {describe, expect, test} from '@jest/globals'
import {getForkCount, getRecentCommit, calculateDays, calculateBusFactor} from '../src/busfactor'

describe("Convert NPM link to Github link", () => 
{
    
    it("null query and triggers catch", async () => 
    {
            const line = await npmCall("")
            assert.equal(line, "error")
    })

    it("Identify git type repository but not hosted on Github", async () => 
    {
            const line = await npmCall("https://www.npmjs.com/package/studiokit-scaffolding-js")
            assert.equal(line, "NoGitHubLinkFound")
    })
    it("returns valid conversion", async () => 
    {
            const line = await npmCall("https://www.npmjs.com/package/popular-user-agents")
            assert.equal(line,"https://github.com/paulmillr/popular-user-agents")
    })

    // can't find a npm package that isn't git type repo
    // can't find a npm package that doesn't have a repo
    

})


describe("File writing detection", () => 
{

    it("Succesfully wrote to a file", async () => 
    {
            const line = await writeToFile("unitTesting.txt", "this is the unit testing writing to the file", "unit testing could not write to the file")
            assert.equal(line,"success")
    })
})


describe("URL input detection", () => 
{

    it("Identify NPM URL from input and convert to Github URL", async () => 
    {
            const line = await lineMatching("https://www.npmjs.com/package/popular-user-agents")
            assert.equal(line, "https://github.com/paulmillr/popular-user-agents")
    })
    it("Identify Github URL from input", async () => 
    {
            const line = await lineMatching("https://github.com/cliffano/bob")
            assert.equal(line, "https://github.com/cliffano/bob") 
    })
    it("Identify invalid link from input - should return that neither a npm nor github link was identifed", async () => 
    {
            const line = await lineMatching("joe mama")
            assert.equal(line, "noMatch")
    })
})

describe("Driver Function testing ", () => 
{
    
        //THIS ERRORS FOR SOME REASON
    
    it("returns valid conversion", async () => 
    {
            const line = await npmToGithubDriver("unitTestingURLS.txt")
            assert.equal(line, "success")
    })
    it("null query that passes through ", async () => 
    {
            const line = await npmToGithubDriver("")
            assert.equal(line, "nullInput")
    })
    
    
})


describe("Get Fork Count", () =>
{
        it("should return 3 forks in a repo", async() =>
        {
                const forkCount = await getForkCount("krobinson395", "ECE461Project")
                assert.equal(forkCount, 3)
        })
})


describe("Get Fork Count Invalid", () =>
{
        it("should throw an error", async() =>
        {
                const forkCount = await getForkCount("krobinson395", "fakeproject")
                assert.equal(forkCount, "Request failed due to following response errors:\n - Could not resolve to a Repository with the name 'krobinson395/fakeproject'.")
        })
})

describe("Get Recent Commit", () =>
{
        it("should return most recent commit date", async() =>
        {
                const commitDate = await getRecentCommit("kulkar62", "HyperVerge-Bus-Reservations")
                assert.equal(commitDate, "2022-03-09")
        })
})

describe("Get Recent Commit Invalid", () =>
{
        it("should return Not Found", async() =>
        {
                const commitDate = await getRecentCommit("kulkar62", "fakerepo")
                assert.equal(commitDate, "Not Found")
        })
})

describe("Calculate Bus Factor on Personal Repo", () =>
{
        it("should return low score for personal repository", async() =>
        {
                const owner = "krobinson395"
                const repo = "ECE461Project"
                const forkCount = await getForkCount(owner, repo)
                const commitDate = await getRecentCommit(owner, repo)
                const daysSinceCommit = calculateDays(commitDate)
                const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
                const bool = busFactor < 0.1
                assert.equal(bool, true)
        })
})

describe("Calculate Bus Factor on Popular Repo", () =>
{
        it("should return high score for a popular and active repository", async() =>
        {
                const owner = "ultralytics"
                const repo = "yolov5"
                const forkCount = await getForkCount(owner, repo)
                const commitDate = await getRecentCommit(owner, repo)
                const daysSinceCommit = calculateDays(commitDate)
                const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
                const bool = busFactor > 0.9
                assert.equal(bool, true)
        })
})




