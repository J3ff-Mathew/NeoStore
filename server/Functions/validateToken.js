const jwt = require("jsonwebtoken");
const jwtSecretKey = "jeffffejjeffffej";
const validateToken = async (req, res, next) => {
    console.log(req.headers)
    if (req.headers['authorization']) {
        let authHeader = await req.headers['authorization'];
        authHeader = authHeader.split(' ');
        console.log(authHeader)
        let token = authHeader[1]
        console.log(token);
        if (token != undefined) {
            jwt.verify(token, jwtSecretKey, (err, data) => {
                if (err) {
                    console.log(err)
                    res.json({ err: 1, message: "Token not valid" });
                }
                else {
                    console.log("token valid", data)
                    next();
                }
            })
        }
    }
}

module.exports = validateToken;