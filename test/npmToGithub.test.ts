import {lineMatching, writeToFile, npmCall, npmToGithubDriver, testingFunction} from '../src/npmToGithub'
//import {describe, expect, test} from '@jest/globals'




describe("invalid test", () => 
{

    test("this test will fail due to a bug in jest", async () => 
    {
            const line = await npmCall("")
            expect(line).toBe("error")
    })
})

describe("Convert NPM link to Github link", () => 
{
    
    test("null query and triggers catch", async () => 
    {
            const line = await npmCall("")
            expect(line).toBe("error")
    })

    test("Identify git type repository but not hosted on Github", async () => 
    {
            const line = await npmCall("https://www.npmjs.com/package/studiokit-scaffolding-js")
            expect(line).toBe("NoGitHubLinkFound")
    })
    test("returns valid conversion", async () => 
    {
            const line = await npmCall("https://www.npmjs.com/package/popular-user-agents")
            expect(line).toBe("https://github.com/paulmillr/popular-user-agents")
    })

    // can't find a npm package that isn't git type repo
    // can't find a npm package that doesn't have a repo
    

})


describe("File writing detection", () => 
{

    test("Succesfully wrote to a file", async () => 
    {
            const line = await writeToFile("unitTesting.txt", "this is the unit testing writing to the file", "unit testing could not write to the file")
            expect(line).toBe("success")
    })
})


describe("URL input detection", () => 
{

    test("Identify NPM URL from input and convert to Github URL", async () => 
    {
            const line = await lineMatching("https://www.npmjs.com/package/popular-user-agents")
            expect(line).toBe("https://github.com/paulmillr/popular-user-agents")
    })
    test("Identify Github URL from input", async () => 
    {
            const line = await lineMatching("https://github.com/cliffano/bob")
            expect(line).toBe("https://github.com/cliffano/bob") 
    })
    test("Identify invalid link from input - should return that neither a npm nor github link was identifed", async () => 
    {
            const line = await lineMatching("joe mama")
            expect(line).toBe("noMatch")
    })
})

describe("Driver Function testing ", () => 
{
    
        //THIS ERRORS FOR SOME REASON
    
    test("returns valid conversion", async () => 
    {
            const line = await npmToGithubDriver("unitTestingURLS.txt")
            expect(line).toBe("success")
    })
    test("null query that passes through ", async () => 
    {
            const line = await npmToGithubDriver("")
            expect(line).toBe("nullInput")
    })
    
    
})







