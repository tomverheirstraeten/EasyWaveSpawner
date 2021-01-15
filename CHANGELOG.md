# V0.2.0

## Endpoints
```
-[post] /creatGame => gives back uuid of created game for usage
```
## Tests
```
- integration tests added
- end to end tests added
```

# V0.1.0

## Endpoints
```
-[GET]     /getAllWaves => get all the existing waves
-[GET]     /getAllGames => get all existing games
-[GET]     /getWavesFromGame/:title => get all the waves from a given game , params : gametitle
-[GET]     /getwavesbydifficulty/:difficulty => get all the waves with a certain difficulty : params : easy/medium/hard/extreme
-[DELETE]  /deleteWaveByid/:id => delete a specific wave by id
-[DELETE]  /deleteGame/:id => delete a game by id with all of its linked waves
-[PATCH]   /changeWave/:id => change wave properties with specific id 
-[POST]    /createGame => create new game with title and name
-[POST]    /createWave/:gameTitle => create a new wave in existing game
```

## Tests
```
- unit tests for every endpoint
```
