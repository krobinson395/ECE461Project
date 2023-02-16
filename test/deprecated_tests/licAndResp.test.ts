import {license, responsiveness} from '../src/licAndResp'

//License --> Valid License Check (MIT License)
describe("Get Valid License", () => 
{

    test("should return 1.0", async () => 
    {
            const lic = await license("nullivex", "nodist")
            expect(lic).toBe("1.0")
    })
})

//License --> No License Check
describe("Get No License", () => 
{

    test("should return 0.0", async () => 
    {
            const lic = await license("nidhikunigal", "PS_Group6")
            expect(lic).toBe("0.0")
    })
})


//License --> Invalid License Check (GNU Affero License)
describe("Get Invalid License", () => 
{

    test("should return 0.0", async () => 
    {
            const lic = await license("bigdoods", "docker-bimserver ")
            expect(lic).toBe("0.0")
    })
})


//Responsiveness --> repo with good contributor reponse time and ratio of closed/total issues is good
describe("Get High Responsiveness Score", () => 
{

    test("should return high score", async () => 
    {
            const resp = await responsiveness("Cloudinary", "cloudinary_npm")
            var resp2: number = +resp
            expect(resp2 >= 0.8).toBe(true)
    })
})

//Responsiveness --> terrible response time + not a lot of closed issues 
describe("Get Low Responsiveness Score", () => 
{

    test("should return low score", async () => 
    {
            const resp = await responsiveness("kazimierz-256", "EventCalculusWebApp")
            var resp2: number = +resp
            expect(resp2 < 0.1).toBe(true)
    })
})

//Responsiveness --> Case with 0 issues on the repo
describe("Get Low Responsiveness Score", () => 
{

    test("should return low score", async () => 
    {
            const resp = await responsiveness("paulmillr", "popular-user-agents")
            var resp2: number = +resp
            expect(resp2 < 0.2).toBe(true)
    })
})

//Responsiveness --> Case with irresponsive contributors
describe("Get Low Responsiveness Score", () => 
{

    test("should return low score", async () => 
    {
            const resp = await responsiveness("MinecraftModdedClients", "Resilience-Client-Source ")
            var resp2: number = +resp
            expect(resp2 < 0.2).toBe(true)
    })
})

//Responsiveness --> Case with a LOT of unresolved issues
describe("Get Low Responsiveness Score", () => 
{

    test("should return low score", async () => 
    {
            const resp = await responsiveness("npm", "npm")
            var resp2: number = +resp
            expect(resp2 < 0.2).toBe(true)
    })
})