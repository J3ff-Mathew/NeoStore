const express = require("express");
const deleteApi = express.Router();

const saltRounds = 10;

const userModel = require('../schema/userModel');
const validateToken = require("../Functions/validateToken");

deleteApi.delete('/deleteUserAddress/:email/:id', async (req, res) => {

    const email = req.params.email;
    const id = req.params.id;
    await userModel.updateOne({ email: email }, { $pull: { address: { _id: id } } }, (err, data) => {
        if (err) throw err;
        res.send({ err: 0, status: "success" });
    })
})

module.exports = deleteApi;