const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();
const mongodb = require('./mongoose/mongooseConnection');
const PORT = 7000;
const addApi = require('./routes/addApi');
const getApi = require('./routes/getApi');
const updateApi = require('./routes/updateApi');
const deleteApi = require("./routes/deleteApi");

mongodb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/add', addApi);
app.use('/get', getApi);
app.use('/update', updateApi);
app.use('/delete', deleteApi);

app.listen(PORT, (err) => {
    if (err) throw err;
    else console.log(`Working on port ${PORT}`)
})