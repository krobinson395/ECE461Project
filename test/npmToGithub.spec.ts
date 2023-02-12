import { assert } from 'chai'
import {lineMatching, writeToFile, npmCall, npmToGithubDriver, testingFunction} from '../src/npmToGithub'
//import {describe, expect, test} from '@jest/globals'




describe("invalid test", () => 
{

    it("this test will fail due to a bug in jest", async () => 
    {
            const line = await npmCall("")
            assert.equal(line, "error")
    })
})

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







