const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const port = 3000;

app.use(cors());

app.get('/location', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
