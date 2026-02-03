const jwt = require('jsonwebtoken');


module.exports = (req, res, next ) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;  

    try {
        const token = req.header(tokenHeaderKey);
        if(!token){
            return res.status(403).send("A token is required for authentication");
        }
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            next();
        }
        else{
            return res.status(401).send("Invalid Token");
        }
        
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
}
