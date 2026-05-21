const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // 1. Create a clean string 'id' from the MongoDB '_id' object
    returnedObject.id = returnedObject._id.toString()
    
    // 2. Remove the ugly internal database '_id'
    delete returnedObject._id
    
    // 3. Remove the MongoDB versioning counter (__v)
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)