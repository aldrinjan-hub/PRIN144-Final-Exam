require('dotenv').config();
const {sql}= require('@vercel/postgres')
const express = require('express')
const app = express();

const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')

const file  =  fs.readFileSync(process.cwd() + '/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
	customCss:
		'.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
	customCssUrl: CSS_URL,
}));

// app.use(express.json());

// const PORT = 4000;

// app.listen(process.env.PORT || PORT, () => {
//     console.log(`Server is listening on port ${PORT}`)
// })

// const songs = [{ id: 1, title: 'Treasure', genre: 'pop', releaseYear: '2024', artist:'Bruno Mars', likes: '999' }, {  id: 2, title: 'Daylight', genre: 'rap', releaseYear: '2023', artist:'Maroon 5', likes: '998'}];
// let songId = songs.length;

// http://localhost:4000/songs
app.get('/songs', async (req, res) => {
    try {
        if (req.query && req.query.id) {
            // http://localhost:4000/songs?id=1
            const song = await sql`SELECT * FROM songs WHERE id = ${req.query.id}`;
            if (song.rowCount > 0) {
                res.json(song.rows[0]);
            } else {
                res.status(404).json({ error: 'Song not found' });
            }
            return;
        }

        const songs = await sql`SELECT * FROM songs ORDER BY id`;
        res.json(songs.rows);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'An error occurred while fetching the songs' });
    }
});


// http://localhost:4000/songs/1
app.get('/songs/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

        if (song.rowCount > 0) {
            res.json(song.rows[0]);
        } else {
            res.status(404).json({ error: 'Song not found' });
        }
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({ error: 'An error occurred while fetching the song' });
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
    
    try {
        // Fetch current song details
        const currentSong = await sql`SELECT * FROM songs WHERE id = ${id}`;
        
        if (currentSong.rowCount === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        
        const song = currentSong.rows[0];
        
        // Update the song
        const songUpdate = await sql`
            UPDATE songs SET 
            title = ${req.body.title !== undefined ? req.body.title : song.title},
            genre = ${req.body.genre !== undefined ? req.body.genre : song.genre},
            releaseYear = ${req.body.releaseYear !== undefined ? req.body.releaseYear : song.releaseYear},
            artist = ${req.body.artist !== undefined ? req.body.artist : song.artist},
            likes = ${req.body.likes !== undefined ? req.body.likes : song.likes}
            WHERE id = ${id}
        `;
        
        if (songUpdate.rowCount > 0) {
            res.json({ message: 'Song updated successfully' });
        } else {
            res.status(404).json({ error: 'Failed to update the song' });
        }
    } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({ error: 'An error occurred while updating the song' });
    }
});



// http://localhost:4000/tasks/1
app.delete('/songs/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const result = await sql`DELETE FROM songs WHERE id = ${id};`;

        if (result.rowCount > 0) {
            res.status(204).json({ message: 'Song deleted successfully' });
        } else {
            res.status(404).json({ error: 'Song not found' });
        }
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ error: 'An error occurred while deleting the song' });
    }
});

module.exports= app;