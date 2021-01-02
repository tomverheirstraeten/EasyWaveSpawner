const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);

///SERVER TEST///
describe("server test", () => {

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
///GET ALL GAMES///
describe('getAllGames', () => {
    test('If i get games back', async (done) => {
        try {
            const response = await request.get('/getAllGames')
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })


})
///GET WAVES BY GAME///
describe('getWavesFromGame/:title', () => {
    test('Caps or no caps dont matter', async (done) => {
        try {
            const response = await request.get('/getWavesFromGame/Game2')
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test("gives back not found when game doesnt exist", async () => {

        try {
            const response = await request.get('/getWavesFromGame/game88')
            expect(response.status).toBe(404);

        } catch (e) {
            if (e) {
                console.log(e);
            }
        }
    })

})
///GET ALL WAVES///
describe('getAllWaves', () => {

    test('If I get waves back', async (done) => {
        try {
            const response = await request.get('/getAllWaves')
            console.log(response);
            expect(response.status).toBe(200);
            done()

        } catch (error) {
            console.log(error);
        }
    })


})
///GET ALL WAVES BY DIFFICULTY///
describe('getWavesByDifficulty', () => {

    test('If I get waves back', async (done) => {
        try {
            const response = await request.get('/getWavesByDifficulty/hard')
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('if difficulty is hard,medium,easy or extreme', async () => {
        try {
            const response = await request.get('/getWavesByDifficulty/somethingelsethanallowed')
            expect(response).toBeFalsy();

        } catch (error) {
            console.log(error);
        }
    })
    test('caps or no capps dont matter', async (done) => {
        try {
            const response = await request.get('/getWavesByDifficulty/HaRd')
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })


})
///DELETE ENTIRE GAME///
describe('deleteGame', () => {

    // test('if game is deleted', async (done) => {
    //     try {
    //         ///delete id of game3
    //         const response = await request.delete('/deleteGame/:id')
    //         .then(await request.get('/getWavesFromGame/Game3'))
    //         done()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })
    // test('if waves get deleted with game', async (done) => {
    //     try {
    //         const response = await request.delete('/deleteGame/:id')
    //         expect(response.status).toBe(200);
    //         done()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })


})
