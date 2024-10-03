
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    }
);