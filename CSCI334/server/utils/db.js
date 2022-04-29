const mongoose = require("mongoose");
const clonedeep = require('lodash.clonedeep');

function autoPopulateField(schema, field){
    const autoPopulate = function (next) {
        this.populate(field);
        next();
    };

    schema.
    pre('findOne', autoPopulate).
    pre('find', autoPopulate);
}


// use this version so that virtuals and methods etc are also inherited
function extendSchema (Schema, definition={}, options={}) {
    let newSchema = new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        Object.assign({}, Schema._userProvidedOptions, options)
    );
    newSchema.virtuals = clonedeep(Schema.virtuals);
    newSchema.methods = clonedeep(Schema.methods);
    newSchema.statics = clonedeep(Schema.statics);
    newSchema.query = clonedeep(Schema.query);
    newSchema.aliases = clonedeep(Schema.aliases);
    newSchema.plugins = clonedeep(Schema.plugins); //causing error for some users to not return id

    return newSchema;
}

module.exports = {autoPopulateField, extendSchema};