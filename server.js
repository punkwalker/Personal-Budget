const exp = require('constants');
const express = require('express');
const app = express();
const port = 3000;

app.use('/', express.static('public'));


app.get('/hello', (req,res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    var data = getJsonFile();
    res.json(data);
});

function getJsonFile(){
    var data = require('./datastorage.json');
    return data;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});