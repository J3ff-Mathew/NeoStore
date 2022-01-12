const express = require("express");
const addApi = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userModel = require('../schema/userModel');
const orderModel = require('../schema/orderModel');
const validateToken = require("../Functions/validateToken");


addApi.post('/addUser', async (req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        let insert = await new userModel({ name: req.body.name, email: req.body.email, password: hash, type: req.body.type, cart: [], address: [], image: '', otp: null });
        insert.save((err) => {
            if (err) {
                res.send({ error: "Email Already Exists in database" });
            }
            else
                res.status(201).send({ error: "" });
        });
    });


});
addApi.post('/addUserSocial', async (req, res) => {
    console.log(req.body);
    let insert = await new userModel({ name: req.body.name, email: req.body.email, type: req.body.type, address: [], cart: [], image: req.body.image });
    insert.save((err) => {
        if (err) {

            res.send({ error: "Email Already Exists in database" });
        }
        else
            res.status(201).send({ error: "" });
    });
});
addApi.post('/addAddress/:email', validateToken, (req, res) => {
    console.log(req.body)
    const email = req.params.email;
    userModel.findOneAndUpdate({ email: email }, { $push: { address: req.body } }, (err, data) => {
        console.log("send data", data);
        res.send({ err: 0, status: "success" })
    })
});


addApi.post('/addCart/:email', (req, res) => {
    const email = req.params.email;
    userModel.findOneAndUpdate({ email: email }, { cart: req.body }, (err, data) => {
        if (err) throw err;
        res.send(
            { msg: "added to cart" }
        )
    })
    // console.log(email, req.body)
});


addApi.post('/addOrder', validateToken, async (req, res) => {
    console.log(req.body);
    let insert = await new orderModel({ ...req.body });
    insert.save((err) => {
        if (err) {

            console.log(err)
        }
        else
            res.status(201).send({ msg: "Order Placed Sucessfully" });
    });
})


module.exports = addApi;