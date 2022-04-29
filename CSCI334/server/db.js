const config = require('config');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
//mongoose.set('debug', true);

// access config variables using config.get('db.name');
module.exports = {connect: async function () {
        return await mongoose.connect(`mongodb://${process.env.CSCI334_MONGODB_USER}:${process.env.CSCI334_MONGODB_PASS}@${config.get('db.host')}/${config.get('db.name')}?ssl=true&replicaSet=atlas-o0cvsi-shard-0&authSource=admin&retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }};
