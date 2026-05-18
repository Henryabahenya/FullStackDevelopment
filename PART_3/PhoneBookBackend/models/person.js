const mongoose = require('mongoose')

const url = process.env.MONGODB_URI 

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    // 1. Enforce a minimum total length of 8 characters
    minlength: [8, 'Phone number must have at least 8 characters'],
    
    // 2. Use a custom validator with a Regular Expression (Regex)
    validate: {
      validator: function(v) {
        // Regex broken down:
        // ^\d{2,3}   -> Starts with exactly 2 or 3 digits
        // -          -> Followed by a single hyphen
        // \d+$       -> Ends with one or more digits until the end of the string
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXX.`
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)