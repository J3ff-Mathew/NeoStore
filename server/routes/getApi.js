const express = require("express");
const getApi = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const jwtSecretKey = "jeffffejjeffffej";

const userModel = require('../schema/userModel');
const colorModel = require('../schema/colorModel');
const categoryModel = require("../schema/categoryModel");
const productModel = require("../schema/productModel");
const orderModel = require("../schema/orderModel");
const validateToken = require("../Functions/validateToken");




getApi.get('/getUser/:email/:password', (req, res) => {
    let email = req.params.email;
    let password = req.params.password;
    // console.log(email, password);
    userModel.findOne({ email: email }, (err, data) => {
        // console.log(data);
        if (err) {
            throw err;
        }
        // console.log(data != null)
        if (data != null) {
            if (data.type == "social") {
                res.send({ err: 1, msg: "Login Using Social Media" })
            }
            else {
                bcrypt.compare(password, data.password, function (err, result) {
                    if (err)
                        throw err;
                    if (result) {
                        let payload = { id: data._id };
                        const token = jwt.sign(payload, jwtSecretKey, { expiresIn: 1000 * 60 * 60 * 24 });
                        let responseData = { name: data.name, email: data.email, type: data.type, image: data.image };
                        res.send({ err: 0, responseData: responseData, token: token })
                    }
                    else {
                        res.send({ err: 1, msg: "Enter Valid Password" });
                    }
                });
            }


        } else {
            res.send({ err: 1, msg: "Invalid Email" });
        }
    });
});



getApi.get('/getSocialUser/:email', (req, res) => {
    let email = req.params.email;
    // console.log(email);
    userModel.findOne({ email: email }, (err, data) => {
        // console.log(data);
        if (err) {
            throw err;
        }
        // console.log(data != null)
        if (data != null) {
            if (data.type == "remote") {
                res.send({ err: 1, msg: "Login Using Remote Credentials" })
            }
            else {
                let payload = { id: data._id };
                const token = jwt.sign(payload, jwtSecretKey, { expiresIn: 1000 * 60 * 60 * 24 });
                let responseData = { name: data.name, email: data.email, type: data.type, image: data.image };
                res.send({ err: 0, responseData: responseData, token: token });
            }
        } else {
            res.send({ err: 1, msg: "Register First" });
        }
    });
});



getApi.get('/getAddress/:email', validateToken, (req, res) => {
    const email = req.params.email;
    userModel.findOne({ email: email }, (err, data) => {
        res.send(data.address)
    })
});



getApi.get('/getAllProducts', (req, res) => {
    productModel.find({}).populate(["color_id", "category_id"]).then(product => {
        res.send(product);
    })
});



getApi.get('/getSpecificProducts/:id', (req, res) => {
    const id = req.params.id;
    if (id.length != 24) {
        res.status(404).send({ err: 1, msg: "objectID Not Valid" })
    }
    else {
        productModel.find({ _id: id }).populate(["color_id", "category_id"]).then(product => {
            res.send({ err: 0, product: product });
        })

    }
});


getApi.get('/getCart/:email', (req, res) => {
    console.log('in cart')
    const email = req.params.email;
    userModel.find({ email: email }, { cart: 1, _id: 0 }, (err, data) => {
        if (err) throw err;
        console.log(data[0].cart)
        res.send(data[0].cart)
    })
});




getApi.get('/getCategoriesAndColors', async (req, res) => {
    const colors = await colorModel.find({});

    const categories = await categoryModel.find({});

    res.send({ colors: colors, categories: categories });
})

getApi.post('/getFilteredProducts', async (req, res) => {
    const data = req.body;
    if (data.category != '' && data.colorFilter.toString() != []) {
        console.log("both true")
        productModel.find({ color_id: req.body.colorFilter, category_id: req.body.category }).populate(["color_id", "category_id"]).then(product => {
            res.send(product)
        });
    }
    else if (data.category != '') {
        console.log("hello");
        productModel.find({ category_id: req.body.category }).populate(["color_id", "category_id"]).then(product => {
            res.send(product)
        });

    }
    else {
        productModel.find({ color_id: req.body.colorFilter }).populate(["color_id", "category_id"]).then(product => {
            res.send(product)
        });
    }
});


getApi.get('/getOrder/:email', validateToken, (req, res) => {
    const email = req.params.email;
    console.log(email);
    orderModel.find({ "buyer.email": email }, (err, data) => {
        if (err)
            throw err;
        else
            res.send(data)
    })
})


getApi.get('/getSpecificOrder/:email/:id', validateToken, (req, res) => {
    const email = req.params.email;
    const id = req.params.id;
    console.log('in getSpecificOrder');
    orderModel.find({ "buyer.email": email, _id: id }, (err, data) => {
        if (err)
            throw err;
        else {
            console.log(data)
            res.send(data)
        }

    })
});


getApi.post('/getSearch', (req, res) => {
    const text = req.body.search;
    // console.log(text);
    productModel.find({ product_name: { $regex: text, $options: '$i' } })
        .then(product => {
            res.json(product)
        })
})
getApi.get('/getTopRatedProducts', (req, res) => {
    // console.log("in products")
    productModel.find({}).sort({ product_rating: -1 }).limit(4)
        .then(product => res.json(product))
        .catch(err => res.send({ err: 1, msg: err }));
})






module.exports = getApi;