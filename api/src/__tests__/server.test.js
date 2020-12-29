const app = require("../server.js")



describe("server test", () => {
    test("if server exists", async (done) => {

        try {
            const response = await request.get('/')
            expect(response.status).toBe(200)
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })
})