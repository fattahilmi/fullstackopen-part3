require('dotenv').config(); 
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// const password = process.argv[2]
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.messages)
    })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// dont return __v and _id attribute
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
