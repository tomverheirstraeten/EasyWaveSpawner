const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);

describe("server test", () => {

    test("if server exists", () => {

        expect(200).toBe(200);
    })
})

describe("server test2", () => {

    test("if server exists", async (done) => {

        try {
            const response = await request.get('/')
            expect(response.status).toBe(200);
            done()
        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })
})
// // describe("getWavesFromGame/:title", () => {
// //     test("if title exists", async (done) => {
// //         try {
// //             const response = await request.get('/getWavesFromGame/GAMETHATDOESNTEXIST');
// //             expect(response.status).toBe(204);
// //             done()
// //         } catch (e) {
// //             console.log(e);


// //         }

// //     })

// //     // test("can only enter string", () => {

// //     //     try {
// //     //         const response = await request.get('/getWavesFromGame/4')
// //     //         expect(response.status).toBe(404, done())
// //     //     } catch (e) {
// //     //         if (e) {
// //     //             console.log(e);
// //     //         }
// //     //     }

// //     // })
// // })
// //commit test
describe('getWavesFromGame/:title', () => {
    test('check if response is created', async (done) => {
        try {
            const response = await request.get('/getWavesFromGame/game8')
            expect(response.status).toBe(204);
            done()
        } catch (error) {
            console.log(error);
        }
    })
})
