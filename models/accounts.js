const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    account_id: { type: String, required: true }
})

accountSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Account', accountSchema)
