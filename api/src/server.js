const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const uuidHelper = require("./utils/UuidHelper.js");
const { debug } = require('console');
const { randomInt } = require('crypto');
const cors = require('cors')



const pg = require("knex")({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/easywavespawnerdb'
});



const app = express();
http.Server(app);
app.use(cors())


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
/////READ/////
///GET ALL WAVES///
app.get('/getAllWaves', async (req, res) => {
    try {
        const result = await pg.select(["uuid", "game_id", "enemy_amount", "difficulty", "time_between_enemies"]).from("waves");

        res.json(
            result
        );
    } catch (error) {
        res.send(error)
    }

})
///GET ALL GAMES///
app.get('/getAllGames', async (req, res) => {
    try {
        const result = await pg.from("games");

        res.json({
            res: result,
        });
    } catch (error) {
        res.send(error)
    }

})
///GET ALL WAVES FROM SPECIFIC GAME///
app.get('/getWavesFromGame/:title', async (req, res) => {
    let titletocheck = req.params.title.toLowerCase();
    try {
        const result = await pg
            .select(["waves.id", "waves.uuid", "waves.enemy_amount", "waves.difficulty", "waves.time_between_enemies"])
            .from("games")
            .rightJoin('waves', 'waves.game_id', 'games.id').where({ title: titletocheck });
        if (result.length == 0) {
            res.sendStatus(404);
        } else {
            res.json({
                waves: result
            })
        }
    } catch (error) {
        res.send(error)
    }
})
///GET ALL WAVES BY DIFFICULTY///
app.get('/getWavesByDifficulty/:difficulty', async (req, res) => {
    let stringToCheck = req.params.difficulty.toLowerCase();
    if (stringToCheck !== "easy" && stringToCheck !== "medium" && stringToCheck !== "hard" && stringToCheck !== "extreme") {
        res.send(false)
    } else {

        try {
            const result = await pg
                .from("waves")
                .where({ difficulty: stringToCheck })
            res.json({
                waves: result
            })
        } catch (error) {
            res.send(error)
        }
    }
})
/////DELETE/////
///DELETE WAVE BY ID///
app.delete('/deleteWaveByid/:id', async (req, res) => {
    try {
        const result = await pg.from("waves").where({ uuid: req.params.id })
        if (result.length !== 0) {

            await pg
                .table("waves")
                .where({ uuid: req.params.id })
                .del().then(() => {
                    console.log(`deleted ${req.params.id} from waves`);
                    res.send(`deleted ${req.params.id} from waves`);
                }).catch((e) => {
                    console.log(e);
                })
        } else {
            res.send("wave doesn't exist");
        }


    } catch (error) {
        res.send(error)
    }
})
///DELETE ENTIRE GAME///
app.delete('/deleteGame/:id', async (req, res) => {
    try {
        const result = await pg.from("games").where({ uuid: req.params.id })
        if (result.length !== 0) {

            await pg
                .table("games")
                .where({ uuid: req.params.id })
                .del().then(() => {
                    console.log(`deleted ${req.params.id} from games`);
                    res.send(`deleted ${req.params.id} from games`);
                }).catch((e) => {
                    console.log(e);
                })
        } else {
            res.send("wave doesn't exist");
        }


    } catch (error) {
        res.send(error)
    }
})
/////UPDATE/////
///ADJUST WAVE DIFFICULTY///
app.patch('/changeWave/:id', async (req, res) => {
    let canpass = true;
    if (req.body.hasOwnProperty("difficulty")) {
        let newdifficulty = req.body.difficulty.toLowerCase();
        if (newdifficulty !== "easy" && newdifficulty !== "medium" && newdifficulty !== "hard" && newdifficulty !== "extreme") {
            canpass = false

        } else {
            req.body.difficulty = newdifficulty
        }

    }
    if (req.body.hasOwnProperty("enemy_amount")) {
        let newEnemyAmount = req.body.enemy_amount
        if (typeof newEnemyAmount !== "number") {
            canpass = false
        }
    }
    if (req.body.hasOwnProperty("time_between_enemies")) {
        let newTime = req.body.time_between_enemies
        if (typeof newTime !== "number") {
            canpass = false
        }

    }

    if (canpass === false) {
        res.send(canpass);
    } else {

        try {
            const result = await pg.from("waves").where({ uuid: req.params.id })
            if (result.length !== 0) {
                await pg
                    .table("waves")
                    .where({ uuid: req.params.id })
                    .update(req.body).then(() => {
                        res.send(204);
                    }).catch((e) => {
                        console.log(e);
                    })
            } else {
                res.send("wave doesn't exist");
            }


        } catch (error) {
            res.send(error)
        }
    }
})
/////CREATE/////
///CREATE NEW GAME///
app.post('/createGame', async (req, res) => {
    //no caps
    req.body.title = req.body.title.toLowerCase();
    //check if already exist
    try {
        const result = await pg.from("games").where({ title: req.body.title });
        console.log(result.length);
        if (result.length === 0) {

            try {
                const uuid = uuidHelper.generateUUID();
                await pg.table("games").insert({ uuid, title: req.body.title, summary: req.body.summary }).then(() => {

                    res.status(201).send();
                })

            } catch (error) {
                res.send(error)
            }
        } else {

            res.status(500).send();
        }
    } catch (error) {
        res.send(error);
    }
})
///CREATE NEW WAVE///
app.post('/createWave/:gameTitle', async (req, res) => {
    //no caps in difficulty
    req.body.difficulty = req.body.difficulty.toLowerCase();
    //if game exist => make wave with id of game
    //else res.send(false,game doesnt exist)
    try {
        const uuid = uuidHelper.generateUUID();
        await pg.table("waves").insert({ uuid, title: req.body.title, summary: req.body.summary }).then(() => {
            res.send(`created ${uuid} with name ${req.body.title}`)
        })

    } catch (error) {
        res.send(error)
    }
})
///INITIALISETABLES IF THEY DON'T EXIST///
async function initialiseTables() {

    await pg.schema.hasTable('games').then(async (exists) => {
        if (!exists) {
            try {
                await pg.schema
                    .createTable('games', (table) => {
                        table.increments("id")
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
                        table.integer("game_id").unsigned().references("id").inTable("games").onDelete("CASCADE").onUpdate("CASCADE");
                        table.integer('enemy_amount');
                        table.string('difficulty');
                        table.float('time_between_enemies');
                    }).then(async () => {

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