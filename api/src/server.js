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



app.get('/', (req, res) => {
    res.sendStatus(200);
})

///GET ALL WAVES///
/**
    * @param none
    * @returns array of objects
*/
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
/**
    * @param none
    * @returns array of objects
*/
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
/**
    * @param title => gametitle
    * @returns array of objects => empty if no game found
*/
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
            res.json(
                result
            )
        }
    } catch (error) {
        res.send(error)
    }
})
///GET ALL WAVES BY DIFFICULTY///
/**
    * @param difficulty => easy/medium/hard/extreme
    * @returns array of objects => empty if no wave found
*/
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
/**
    * @param id => game uuid
    * @returns if succeeded => id of game | if not succeeded => 404 | if wave doesn't exist =>"wave doesn't exist"
*/
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
/**
    * @param id => uuid of game
    * @returns if succeeded => id of game | if not succeeded => 404 | if game doesn't exist =>"game doesn't exist"
*/
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
/**
    * @param id => uuid of wave | body = object with change params {difficulty:string,enemy_amount:number,time_between_enemies:number}
    * @returns if params are bad => false, succeeded => 204, not found => "wave doesnt exist"
*/
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
/**
    * @param body (object) => {title:string,summary:string}
    * @returns 201 (succeeded), 500 (if game already exists),500 (if game title is "")
*/
app.post('/createGame', async (req, res) => {
    //no caps
    req.body.title = req.body.title.toLowerCase();
    if (req.body.title !== "") {

        try {
            const result = await pg.from("games").where({ title: req.body.title });
            console.log(result.length);
            if (result.length === 0) {

                try {
                    const uuid = uuidHelper.generateUUID();
                    await pg.table("games").insert({ uuid, title: req.body.title, summary: req.body.summary }).then(() => {

                        res.status(201).send({ uuid: uuid });
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
    } else {
        res.status(500).send("title of game needs to be at least 1 character long");
    }
    //check if already exist
})
///CREATE NEW WAVE///
/**
    * @param gameTitle => name of game | body = object with params {difficulty:string,enemy_amount:number,time_between_enemies:number}
    * @returns 201 (succeeded), 500 (if wave already exists),500 (if game title is not found)
*/
app.post('/createWave/:gameTitle', async (req, res) => {
    //no caps in difficulty
    req.body.difficulty = req.body.difficulty.toLowerCase();
    req.params.gameTitle = req.params.gameTitle.toLowerCase();
    let gameID;
    let canpass = true;
    console.log(req.body);
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
        if (newEnemyAmount < 0) {
            canpass = false

        }

    }
    if (req.body.hasOwnProperty("time_between_enemies")) {
        let newTime = req.body.time_between_enemies
        if (typeof newTime !== "number") {
            canpass = false

        }
        if (newTime < 0) {
            canpass = false

        }

    }
    if (canpass) {


        //if game exist => make wave with id of game
        try {
            let result = await pg.select(["id"]).from("games").where({ title: req.params.gameTitle });



            if (result.length !== 0) {
                gameID = result[0].id;

                try {
                    const allwaves = await pg.from("waves").where({ game_id: gameID, difficulty: req.body.difficulty, enemy_amount: req.body.enemy_amount, time_between_enemies: req.body.time_between_enemies });
                    console.log(allwaves.length);
                    if (allwaves.length === 0) {
                        try {
                            const uuid = uuidHelper.generateUUID();
                            await pg.table("waves").insert({ game_id: gameID, uuid, time_between_enemies: req.body.time_between_enemies, enemy_amount: req.body.enemy_amount, difficulty: req.body.difficulty }).then(() => {
                                res.status(201).send();
                            })

                        } catch (error) {
                            res.send(error)
                        }
                    }
                    else {
                        res.status(500).send("wave already exist")
                    }
                } catch (error) {

                }
            } else {
                res.status(500).send("game not found");
            }
        } catch (error) {

        }
    } else { res.status(500).send() }

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