const mCache = require('memory-cache');

const cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mCache.get(key);
        if (cachedBody) {
            res.send(cachedBody)
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mCache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
};

module.exports = {cache}