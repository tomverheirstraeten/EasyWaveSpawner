const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);


/**
* FLOW of tests
* ----------------------------------------------
* create game
* create wave on that specific game
* get all waves and check if that game is included
* update the wave
* delete the game
* check waves and games if all are deleted
*/



describe('/creategame/', () => {
    let gamedata = {
        title: "little big planet",
        summary: "coop adventure game where u play as a customizable character"
    }
    let waveuuid;
    let gameuuid;

    //create game
    test('create game', async (done) => {
        try {
            const response = await request.post(`/createGame`).send(gamedata)
            expect(response.status).toBe(201);
            gameuuid = (response.body.uuid);
            done()
        } catch (error) {
            console.log(error)
        }
    })

    //create wave 
    let wavedata = {
        "enemy_amount": 12,
        "time_between_enemies": 1.2,
        "difficulty": "hard"
    }
    test('create wave on "little big planet"', async (done) => {

        try {
            const response = await request.post(`/createWave/little big planet`).send(wavedata)
            expect(response.status).toBe(201);

            done()
        } catch (error) {
            console.log(error);
        }
    })
    //get waves of little big planet
    test('if little big planet exists and wave was added ', async (done) => {
        try {
            const response = await request.get('/getWavesFromGame/little big planet')

            waveuuid = response.body[0].uuid;
            expect(response.status).toBe(200);
            done()
        } catch (error) {

        }
    })

    //update the wave
    test('if wavedifficulty is updated', async (done) => {
        let data = {
            "difficulty": "extreme"
        }
        try {

            const response = await request.patch(`/changeWave/${waveuuid}`).send(data)
            expect(response.status).toBe(204);
            done()
        } catch (error) {
            console.log(error);
        }
    })
    //delete game
    test('if game is deleted', async (done) => {

        try {

            const response = await request.delete(`/deleteGame/${gameuuid}`)
            expect(response.status).toBe(200);
            done()
        } catch (error) {
            console.log(error);
        }
    })

    //get waves of little big planet
    test('if little big planet doesnt exist anymore and waves were removed ', async (done) => {
        try {
            const response = await request.get('/getWavesFromGame/little big planet')


            expect(response.status).toBe(404);
            done()
        } catch (error) {

        }
    })


})