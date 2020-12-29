const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const uuidHelper = require("./utils/UuidHelper.js");
const { debug } = require('console');



const pg = require("knex")({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@container:5432/EasyWaveSpawnerDB'
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



app.get('/', (req, res) => {
    res.send(200);
})


async function initialiseTables() {
    await pg.schema.hasTable('games').then(async (exists) => {
        if (!exists) {
            await pg.schema
                .createTable('games', (table) => {
                    table.increments();
                    table.uuid('uuid');
                    table.string('title');
                    table.string('summary');
                })
                .then(async () => {
                    const uuid = uuidHelper.generateUUID();
                    console.log(uuid);
                    await pg.table('games').insert({ uuid, title: `random element number`, summary: `some summary of the game` });
                }).catch(e => console.log(e));

        }
    });
    await pg.schema.hasTable('waves').then(async (exists) => {
        if (!exists) {
            await pg.schema
                .createTable('waves', (table) => {
                    table.increments();
                    table.uuid('uuid');
                    table.string("game_uuid");
                    table.integer('enemy_amount');
                    table.string('difficulty');
                    table.float('time_between_enemies');
                })
                .then(async () => {
                    const uuid = uuidHelper.generateUUID();
                    console.log(uuid);
                    await pg.table('waves').insert({ uuid, game_uuid: `uuidofgame`, enemy_amount: 0, difficulty: "hard", time_between_enemies: 2.5 });
                }).catch(e => console.log(e));

        }
    });
}
initialiseTables()



module.exports = app;