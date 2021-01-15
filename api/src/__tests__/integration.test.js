const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);


///DELETE ENTIRE GAME///
describe('/createWave/:gameTitle', () => {
    let data_1 = {
        "enemy_amount": 5,
        "time_between_enemies": 10.2,
        "difficulty": "medium"
    }

    //if returns false when game doesnt exist
    //if returns false when difficulty is other than easy/medium/hard/extreme


    test('return 500 when game doesnt exist', async (done) => {
        try {
            const response = await request.post(`/createWave/bestaatNiet`).send(data_1)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })

    let data_2 = {
        "enemy_amount": 5,
        "time_between_enemies": 10.2,
        "difficulty": "madium"
    }
    test('return 500 when difficulty is other than easy/medium/hard/extreme', async (done) => {
        try {
            const response = await request.post(`/createWave/call of duty`).send(data_2)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })
    let data_3 = {
        "enemy_amount": -5,
        "time_between_enemies": 10.2,
        "difficulty": "medium"
    }
    test('return 500 when enemy_amount is smaller than 0', async (done) => {
        try {
            const response = await request.post(`/createWave/call of duty`).send(data_3)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })
    let data_4 = {
        "enemy_amount": "invalid",
        "time_between_enemies": 10.2,
        "difficulty": "medium"
    }
    test('return 500 when enemy_amount is no number', async (done) => {
        try {
            const response = await request.post(`/createWave/call of duty`).send(data_4)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })
    let data_5 = {
        "enemy_amount": 5,
        "time_between_enemies": -3,
        "difficulty": "medium"
    }
    test('return 500 when time_between_enemy is smaller than 0', async (done) => {
        try {
            const response = await request.post(`/createWave/call of duty`).send(data_5)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })
    let data_6 = {
        "enemy_amount": 6,
        "time_between_enemies": "invalid",
        "difficulty": "medium"
    }
    test('return 500 when time_between_enemy is no number', async (done) => {
        try {
            const response = await request.post(`/createWave/call of duty`).send(data_6)
            expect(response.status).toBe(500);
            done()

        } catch (error) {
            console.log(error);
        }
    })
})