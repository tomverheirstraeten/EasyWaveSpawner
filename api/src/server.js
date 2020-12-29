const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const uuidHelper = require("./utils/UuidHelper.js");
const { debug } = require('console');
const { randomInt } = require('crypto');



const pg = require("knex")({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@127.0.0.1:5432/easywavespawnerdb'
});



const app = express();
http.Server(app);


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true
    })
);


///HOMEPAGE///
app.get('/', (req, res) => {
    res.sendStatus(200);
})
///GET ALL WAVES///
app.get('/getAllWaves', async (req, res) => {
    try {
        const result = await pg.select(["uuid", "game_uuid", "enemy_amount", "difficulty", "time_between_enemies"]).from("waves");

        res.json({
            res: result,
        });
    } catch (error) {
        console.log(error);
    }

})
///GET ALL WAVES FROM SPECIFIC GAME///
app.get('/getWavesFromGame/:title', async (req, res) => {

    try {
        const result = await pg
            .select(["waves.id", "waves.uuid", "waves.enemy_amount", "waves.difficulty", "waves.time_between_enemies"])
            .from("games")
            .rightJoin('waves', 'waves.game_id', 'games.id').where({ title: req.params.title });
        if (result.length == 0) {
            res.sendStatus(204);
        } else {
            res.json({
                waves: result
            })
        }
    } catch (error) {
        console.log(error);
    }
})
///GET ALL WAVES BY DIFFICULTY///
app.get('/getWavesByDifficulty/:difficulty', async (req, res) => {
    try {
        const result = await pg
            .from("waves")
            .where({ difficulty: req.params.difficulty })
        res.json({
            waves: result
        })
    } catch (error) {
        console.log(error);
    }
})


///INITIALISETABLES IF THEY DON'T EXIST///
async function initialiseTables() {

    await pg.schema.hasTable('games').then(async (exists) => {
        if (!exists) {
            try {
                await pg.schema
                    .createTable('games', (table) => {
                        table.increments();
                        table.uuid('uuid');
                        table.string('title');
                        table.string('summary');
                    })
                    .then(async () => {
                        for (let index = 0; index < 2; index++) {
                            const uuid = uuidHelper.generateUUID();
                            await pg.table('games').insert({ uuid, title: `game${index + 1}`, summary: `some summary of game${index + 1}` });
                        }
                    });
            } catch (error) {
                console.log(error);
            }

        }
    });

    await pg.schema.hasTable('waves').then(async (exists) => {
        if (!exists) {
            try {
                await pg.schema
                    .createTable('waves', (table) => {
                        table.increments();
                        table.uuid('uuid');
                        table.integer("game_id");
                        table.integer('enemy_amount');
                        table.string('difficulty');
                        table.float('time_between_enemies');
                    })
                    .then(async () => {
                        const result = await pg
                            .select(['id'])
                            .from('games');
                        console.log(result);
                        for (let index = 0; index < 10; index++) {
                            const uuid = uuidHelper.generateUUID();
                            await pg.table('waves').insert({
                                uuid, game_id: result[randomInt(2)].id, enemy_amount: 0, difficulty: "hard", time_between_enemies: 2.5
                            });
                        }
                    });
            } catch (error) {
                console.log(error);
            }

        }
    });

}
initialiseTables()



module.exports = app;