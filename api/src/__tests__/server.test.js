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
            // console.log(error);
        }
    })
    test("gives back not found when game doesnt exist", async (done) => {

        try {
            const response = await request.get('/getWavesFromGame/game88')
            expect(response.status).toBe(404);
            done()
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
            // console.log(error);
        }
    })


})
///GET ALL WAVES BY DIFFICULTY///
describe('getWavesByDifficulty', () => {

    test('If I get waves back', async done => {
        try {
            const response = await request.get('/getWavesByDifficulty/hard')
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('if difficulty is hard,medium,easy or extreme', async done => {
        try {
            const response = await request.get('/getWavesByDifficulty/somethingelsethanallowed')

            expect(response.body).toBeFalsy;
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('caps or no caps dont matter', async done => {
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
// describe('deleteGame', () => {

//     test('if game is deleted', async (done) => {
//         try {
//             ///delete id of game3
//             const response = await request.delete('/deleteGame/:id')
//             .then(await request.get('/getWavesFromGame/Game3'))
//             done()
//         } catch (error) {
//             console.log(error);
//         }
//     })
//     test('if waves get deleted with game', async (done) => {
//         try {
//             const response = await request.delete('/deleteGame/:id')
//             expect(response.status).toBe(200);
//             done()
//         } catch (error) {
//             console.log(error);
//         }
//     })


// })
///update wave difficulty
describe('updateWaves', () => {
    let id;


    test('if wavedifficulty is updated', async (done) => {
        let data = {
            "difficulty": "easy",
            "enemy_amount": 0
        }
        try {
            const waves = await request.get("/getAllWaves")
            try {
                for (const wave of waves.body) {
                    id = wave.uuid
                }
                const response = await request.patch(`/changeWave/${id}`).send(data)
                expect(response.status).toBe(204);
                done()
            } catch (error) {
                console.log(error)
            }


            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('if new difficulty is "hard","easy",extreme" or medium', async (done) => {
        let data = {
            "difficulty": "55"
        }
        try {
            const waves = await request.get("/getAllWaves")
            try {
                for (const wave of waves.body) {
                    id = wave.uuid
                }
                const response = await request.patch(`/changeWave/${id}`).send(data)
                expect(response.body).toBeFalsy;
                done()
            } catch (error) {
                console.log(error)
            }



        } catch (error) {
            console.log(error);
        }
    })
    test('caps or no caps dont matter', async (done) => {
        let data = {
            "difficulty": "HaRd"
        }
        try {
            const waves = await request.get("/getAllWaves")
            try {
                for (const wave of waves.body) {
                    id = wave.uuid
                }
                const response = await request.patch(`/changeWave/${id}`).send(data)
                expect(response.status).toBe(204);
                done()
            } catch (error) {
                console.log(error)
            }



        } catch (error) {
            console.log(error);
        }
    })
})

describe('create waves/games', () => {
    test('if game is created', async (done) => {
        let data = {
            "title": "fallguys",
            "summary": "platformer where people fight to be the last man standing"
        }

        try {
            const response = await request.post(`/createGame`).send(data)
            expect(response.status).toBe(201);
            done()
        } catch (error) {
            console.log(error)
        }
    })
    test('if game has title', async (done) => {
        let data = {
            "title": "",
            "summary": "summary of the game"
        }

        try {
            const response = await request.post(`/createGame`).send(data)
            expect(response.status).toBe(500);
            done()
        } catch (error) {
            console.log(error)
        }
    })
    test('if game already exists', async (done) => {
        let data = {
            "title": "fallguys",
            "summary": "platformer where people fight to be the last man standing"
        }

        try {
            const response = await request.post(`/createGame`).send(data)
            expect(response.status).toBe(500);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('if wave is created', async (done) => {
        let data = {
            "enemy_amount": 0,
            "time_between_enemies": 2.3,
            "difficulty": "extreme"
        }

        try {
            const response = await request.post(`/createWave/game1`).send(data)
            expect(response.status).toBe(201);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('if wave exists', async (done) => {
        let data = {
            "enemy_amount": 0,
            "time_between_enemies": 2.3,
            "difficulty": "extreme"
        }

        try {
            const response = await request.post(`/createWave/game1`).send(data)
            expect(response.status).toBe(500);
            done()
        } catch (error) {
            console.log(error);
        }
    })


    test('if the game for the new wave exists', async (done) => {
        let data = {
            "enemy_amount": 5,
            "time_between_enemies": 10.2,
            "difficulty": "medium"
        }

        try {
            const response = await request.post(`/createWave/bestaatNiet`).send(data)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })


})
