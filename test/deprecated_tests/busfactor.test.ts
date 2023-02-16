import {getForkCount, getRecentCommit, calculateDays, calculateBusFactor} from '../src/busfactor'

describe("Get Fork Count", () => 
{

    test("should return 3 forks in a repo", async () => 
    {
            const forkCount = await getForkCount("krobinson395", "ECE461Project")
            expect(forkCount).toBe(3)
    })
})

describe("Get Fork Count Invalid", () => 
{

    test("should throw an error", async () => 
    {
            const forkCount = await getForkCount("krobinson395", "fakeproject")
            expect(forkCount).toBe("Request failed due to following response errors:\n - Could not resolve to a Repository with the name 'krobinson395/fakeproject'.") 
    })
})

describe("Get Recent Commit", () => 
{

    test("should return most recent commit date", async () => 
    {
            const commitDate = await getRecentCommit("kulkar62", "HyperVerge-Bus-Reservations")
            expect(commitDate).toBe("2022-03-09")
    })
})

describe("Get Recent Commit Invalid", () => 
{

    test("should throw an error", async () => 
    {
            const commitDate = await getRecentCommit("kulkar62", "fakerepo")
            expect(commitDate).toBe("Not Found")
    })
})

describe("Calculate Days Current Date", () => 
{

    test("should return difference in days", () => 
    {

        const myDate = new Date().toISOString().split('T')[0];
        const difference = calculateDays(myDate)
        expect(difference === 0 || difference === 1).toBe(true)
    })
})

describe("Calculate Days Yesterday's Date", () => 
{

    test("should return difference in days", () => 
    {
        const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const myDate = date.toISOString().split('T')[0];
        const difference = calculateDays(myDate)
        expect(difference === 1 || difference === 2).toBe(true)
    })
})

describe("Calculate Bus Factor on Personal Repo", () => 
{

    test("should return low score for personal repository", async () => 
    {
        const owner = "krobinson395"
        const repo = "ECE461Project"
        const forkCount = await getForkCount(owner, repo)
        const commitDate = await getRecentCommit(owner, repo)
        const daysSinceCommit = calculateDays(commitDate)
        const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
        expect(busFactor < 0.1).toBe(true)
    })
})

describe("Calculate Bus Factor on Popular Repo", () => 
{

    test("should return high score for a popular and active repository", async () => 
    {
        const owner = "ultralytics"
        const repo = "yolov5"
        const forkCount = await getForkCount(owner, repo)
        const commitDate = await getRecentCommit(owner, repo)
        const daysSinceCommit = calculateDays(commitDate)
        const busFactor = calculateBusFactor(forkCount, daysSinceCommit)
        expect(busFactor > 0.9).toBe(true)
    })
})