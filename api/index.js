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

// const songs = [{ id: 1, title: 'Treasure', genre: 'pop', releaseYear: '2024', artist:'Bruno Mars', likes: '999' }, {  id: 2, title: 'Daylight', genre: 'rap', releaseYear: '2023', artist:'Maroon 5', likes: '998'}];
// let songId = songs.length;

// http://localhost:4000/songs
app.get('/songs', async (req, res) => 
{
    if (req.query) 
    {
        if (req.query.id) 
        {
            // http://localhost:4000/tasks?id=1
            const song = await sql`SELECT FROM songs WHERE id= ${req.query.id};`;
            if (song.rowCount> 0) 
            {
                res.json(task.rows[0]);
            } 
            else 
            {
                res.status(404).json();
            }
            return;
        }
    }
const songs= await sql;`SELECT*FROM songs ORDER BY id`
res.json(songs.rows);
});

// http://localhost:4000/songs/1
app.get('/songs/:id', async (req, res) => 
{
    const id = req.params.id;
    const song = await sql `SELECT*FROM songs WHERE id= ${id};`;

    if (task.rowCount>0) 
    {
        res.json(task.rows[0]);
    } else 
    {
        res.status(404).json();
    }
});

// http://localhost:4000/create - { "song": "New Song" }
app.post('/create', async (req, res) => {
    try {
        await sql`
            INSERT INTO songs (title, genre, releaseYear, artist, likes) 
            VALUES (${req.body.title}, ${req.body.genre}, ${req.body.releaseYear}, ${req.body.artist}, ${req.body.likes});
        `;
        res.status(201).json({ message: 'Song created successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'An error occurred while creating the song' });
    }
});


app.put('/songs/:id', async (req, res) => {
    const id = req.params.id;
    const songUpdate = await sql`UPDATE songs SET 
    title =${(req.body.title !=undefined? req.body.title:song.title)}, genre =${(req.body.genre !=undefined? req.body.genre:song.genre)}, releaseYear =${(req.body.releaseYear !=undefined? req.body.title:song.releaseYear)}, 
    artist =${(req.body.artist !=undefined? req.body.artist:song.artist)}, 
    likes =${(req.body.likes !=undefined? req.body.title:song.likes)}`

    if (songUpdate.rowCount>0) 
    {
        res.json(song);
    } 
    else 
    {
        res.status(404).json();
    }
});


// http://localhost:4000/tasks/1
app.delete('/songs/:id', async (req, res) => {
    const id = req.params.id;
    const song = await sql`DELETE FROM songs WHERE id = ${id};`;
    if (song.rowCount > 0) 
    {
        res.status(204).json();
    } 
    else 
    {
        res.status(404).json();
    }
});

module.exports= app;