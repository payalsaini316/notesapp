const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const decoded = jwt.verify(token, "coding");

        req.userID = decoded.userID;

        next();

    } catch (error) {
        res.status(401).send({
            msg: "Login First"
        });
    }
};

module.exports = { auth };