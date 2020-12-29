const supertest = require("supertest");
const app = require("../server.js")
const request = supertest(app);



describe("server test", () => {
    test("if server exists", async (done) => {

        try {
            const response = await request.get('/')
            expect(response.status).toBe(200, done())
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })
})
describe("server test", () => {
    test("if server exists", async (done) => {

        try {
            const response = await request.get('/')
            expect(response.status).toBe(200, done())
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })
})
describe("server test", () => {
    test("if server exists", async (done) => {

        try {
            const response = await request.get('/')
            expect(response.status).toBe(200, done())
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })
})