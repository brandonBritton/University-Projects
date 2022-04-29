var sanitize = require('mongo-sanitize');

const sanitizer = (req, res, next) => {
    sanitize(req.body);
    next();
};


module.exports = sanitizer;