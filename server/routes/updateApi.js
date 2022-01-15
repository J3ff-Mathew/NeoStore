const express = require("express");
const updateApi = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');



const saltRounds = 10;

const jwtSecretKey = "jeffffejjeffffej";

const sendMail = require('../Functions/sendMail')
const userModel = require('../schema/userModel');
const productModel = require('../schema/productModel')
const upload = require('../Functions/fileUpload');
const validateToken = require('../Functions/validateToken');
updateApi.use(express.static("../client/public/images/"));
updateApi.use(express.json());
updateApi.use(express.urlencoded({ extended: true }));

updateApi.post('/updateUserDetails/:email', validateToken, upload.single('file'), async (req, res) => {
    let email = req.params.email;

    if (req.file == undefined)
        await userModel.findOneAndUpdate({ email: email }, { name: req.body.name });
    else {
        if (req.fileValidationError) {
            res.send({ err: 1, msg: "Invalid file Type" });
        }
        else {
            const imgPath = `images/${req.file.filename}`;
            let oldData = await userModel.findOneAndUpdate({ email: email }, { name: req.body.name, image: imgPath });
            if (!(/platform/.test(oldData.image) || /google/.test(oldData.image)))
                fs.unlinkSync(`../client/public/${oldData.image}`)
        }
    }
    userModel.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        let responseData = { name: data.name, email: data.email, type: data.type, address: data.address, cart: data.cart, image: data.image };
        res.send({ err: 0, responseData: responseData })
    });
});



updateApi.put('/changePassword/:email', validateToken, (req, res) => {
    console.log(req.body)
    const email = req.params.email;
    userModel.findOne({ email: email }, (err, data) => {
        if (err) {
            throw err;

        }
        bcrypt.compare(req.body.oldPassword, data.password, function (err, result) {
            if (err)
                throw err;
            if (result) {
                bcrypt.hash(req.body.newPassword, saltRounds, async function (err, hash) {
                    userModel.findOneAndUpdate({ password: data.password }, { password: hash }, (err, data) => {
                        if (err) throw err;
                        res.send({ err: 0, msg: "Password Changed Sucessfully" });
                    });
                });
            }
            else {
                res.send({ err: 1, msg: "Enter Valid Password" });
            }
        });
    });
});

updateApi.put("/forgotPasswordOtp/:email", (req, res) => {
    console.log(req.params.email);
    const email = req.params.email;
    userModel.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        if (data != null) {
            if (data.type == "remote") {
                console.log("In remote")
                const OTP = Math.floor(100000 + Math.random() * 900000);
                sendMail(OTP, email);
                userModel.findOneAndUpdate({ email: email }, { otp: OTP }, (err, data) => {
                    if (err) throw err;
                    res.send({ err: 0, msg: "OTP Has Been Sent To Registered Email ID" });
                })
            }
            else
                res.send({ err: 1, msg: "Cannot Set The Password of A Social Login User" });
        }
        else
            res.send({ err: 1, msg: "Email Does not Exists in Database" });
    })
});

updateApi.put("/verifyOtp/:email", (req, res) => {
    const email = req.params.email;
    const OTP = req.body.otp;
    userModel.findOne({ email: email }, (err, data) => {
        if (data.otp == OTP) {
            let payload = { id: data._id };
            const token = jwt.sign(payload, jwtSecretKey, { expiresIn: 1000 * 60 * 60 * 24 });
            res.send({ err: 0, msg: "OTP is valid", token: token })
        }
        else {
            res.send({ err: 1, msg: "OTP is invalid" })
        }
    })
});

updateApi.put("/setUserPassword/:email", validateToken, (req, res) => {
    const password = req.body.password;
    const email = req.params.email;
    userModel.findOne({ email: email }, (err, data) => {
        if (data.type == 'remote' && data.otp != null) {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) throw err;
                userModel.updateOne({ email: data.email }, { password: hash, otp: null }, (err, data) => {
                    if (err) throw err;
                    else
                        res.send({ err: 0, msg: "Password has been updated sucessfully" });
                })
            });

        }
        else {
            res.send(401, { err: 1, msg: "Bad Request cannot proces the Data" });
        }
    })
});


updateApi.put('/updateRating/:id', (req, res) => {
    const id = req.params.id;
    const newRating = req.body.newRating;
    const newRatingCount = req.body.newRatingCount;
    productModel.findOneAndUpdate({ _id: id }, { product_rating: newRating, product_ratingCount: newRatingCount }, (err, data) => {
        if (err) throw err;
        else {
            res.status(201).send({ msg: "Success" });
            console.log("inside", data)
        }

    });
});


updateApi.put('/updateAddress/:email/:id', validateToken, (req, res) => {

    const email = req.params.email;
    const id = req.params.id;
    console.log(req.body, email, id)
    userModel.findOneAndUpdate({ email: email, "address._id": id }, { $set: { "address.$.name": req.body.name, "address.$.address": req.body.address, "address.$.contact": req.body.contact } }, (err, data) => {
        if (err) throw err;
        console.log("send data", data);
        res.send({ err: 0, status: "success" })
    })
});





module.exports = updateApi;