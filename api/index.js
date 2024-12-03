require('dotenv').config();
const {sql}= require('@vercel/postgres')
const express = require('express')
const app = express();

const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')

app.use(express.json());

const PORT = 4000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

const songs = [{ id: 1, title: 'Treasure', genre: 'pop', releaseYear: '2024', artist:'Bruno Mars', likes: '999' }, {  id: 2, title: 'Daylight', genre: 'rap', releaseYear: '2023', artist:'Maroon 5', likes: '998'}];
let songId = songs.length;

// http://localhost:4000/songs
app.get('/songs', (req, res) => {
    if (req.query) {
        if (req.query.id) {
            // http://localhost:4000/tasks?id=1
            const song = songs.find((song) => song.id === parseInt(req.query.id));
            if (song) {
                res.json(song);
            } else {
                res.status(404).json();
            }
            return;
        }
    }

    res.json(songs);
});

// http://localhost:4000/songs/1
app.get('/songs/:id', (req, res) => {
    const id = req.params.id;
    const song = songs.find((song) => song.id === parseInt(id));

    if (song) {
        res.json(song);
    } else {
        res.status(404).json();
    }
});

// http://localhost:4000/create - { "song": "New Song" }
app.post('/create', (req, res) => {
    songId++;
    req.body.id =songId;
    songs.push(req.body);
    res.status(201).json();
});

app.put('/songs/:id', (req, res) => {
    const id = req.params.id;
    const song = songs.find((song) => song.id === parseInt(id));

    if (song) {
        song.id = parseInt(id);
        song.title = (req.body.title != undefined ? req.body.title : song.title);
        song.genre = (req.body.genre != undefined ? req.body.genre : song.genre);
        song.releaseYear = (req.body.releaseYear != undefined ? req.body.releaseYear : song.releaseYear);
        song.artist = (req.body.artist != undefined ? req.body.artist : song.artist);
        song.likes = (req.body.likes != undefined ? req.body.likes : song.likes);

        res.json(song);
    } else {
        res.status(404).json();
    }
});


// http://localhost:4000/tasks/1
app.delete('/songs/:id', (req, res) => {
    const id = req.params.id;
    const song = songs.find((song) => song.id === parseInt(id));

    if (song) {
        songs.splice(songs.indexOf(song), 1);
        res.status(204).json();
    } else {
        res.status(404).json();
    }
});