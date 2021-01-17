const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const authenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const tokenDecoded = jwt.verify(token, process.env.AUTH_SECRET);
        console.log(token);

        const user = await User.findOne({
            _id: tokenDecoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();
    } catch(e) {
         res.status(401).send({error: 'Unauthenticated'});
    }
};

module.exports = authenticated;