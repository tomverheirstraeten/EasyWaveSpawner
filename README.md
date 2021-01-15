# EasyWaveSpawner
A game developer API to add waves to their games or to existing games.

## Requirements

npm installs 
-   node packages
    - [supertest]https://www.npmjs.com/package/supertest
    - [cors]https://www.npmjs.com/package/cors
    - [express]https://www.npmjs.com/package/express
    - [knex]https://www.npmjs.com/package/knex
    - [nodemon]https://www.npmjs.com/package/nodemon
    - [pg]https://www.npmjs.com/package/pg
    - [uuid]https://www.npmjs.com/package/uuid
    - [body-parser]https://www.npmjs.com/package/body-parser
    - [jest]https://www.npmjs.com/package/jest
    
## Startup
```bash
cd api
docker-compose up
```
=> open localhost:3000

## Endpoints
-   /getAllWaves => get all the existing waves
-   /getAllGames => get all existing games
-   /getWavesFromGame/:title => get all the waves from a given game , params : gametitle
-   /getwavesbydifficulty/:difficulty => get all the waves with a certain difficulty : params : easy/medium/hard/extreme
-   /deleteWaveByid/:id => delete a specific wave by id
-   /deleteGame/:id => delete a game by id with all of its linked waves
-   /changeWave/:id => change wave properties with specific id 
-   /createGame => create new game with title and name
-   /createWave/:gameTitle => create a new wave in existing game




## License
[MIT](/LICENSE)



## Contributing
I would like to the contributing.md file in the root of of this repository.

